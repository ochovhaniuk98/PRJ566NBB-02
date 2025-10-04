import { useEffect, useState } from 'react';
import { useUserData } from '@/context/UserDataContext';
import { faGift, faPen, faPenClip } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import ImageBanner from '@/components/restaurantProfile/ImageBanner';
import BusinessInfo from '@/components/restaurantProfile/BusinessInfo';
import InfoBanner from '@/components/restaurantProfile/InfoBanner';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';
import RestaurantImageUpload from '@/components/restaurantProfile/RestaurantImageUpload';
import PhotoGallery from '@/components/restaurantProfile/PhotoGallery';
import AddInstagramEmbed from '@/components/restaurantProfile/AddInstagramEmbed';
import RedeemCouponEmbed from '@/components/restaurantProfile/RedeemCouponEmbed';
import EditProfileDetails from '@/components/restaurantProfile/EditProfileDetails';
import AddReviewForm from '../shared/AddReviewForm';
import MentionedTab from './MentionedTab';
import MasonryReviewGrid from './MasonryReviewGrid';
import EventsAndAnnounce from './EventsAndAnnounce';
import Spinner from '@/components/shared/Spinner';
import FavouriteButton from '../shared/FavouriteButton';
import LoginAlertModal from '../shared/LoginAlertModal';
import { useViewer } from '@/hooks/useViewer';

export default function RestaurantProfile({ isOwner = false, restaurantId }) {
  const restaurantTabs = ['Reviews', 'Mentioned', 'Photos', 'Events and Announcements', 'Business Info'];

  const { isAuthenticated, supabaseId, userData } = useViewer(); // info on current authentication states of user/viewer (mongo + supabase)
  const { refreshUserData } = useUserData();

  // stores the MongoDB user ID of the logged-in user, or restaurantId if owner;
  // If the user is the owner, we can use restaurantId directly as userId.
  const [userId, setUserId] = useState(isOwner ? restaurantId : null);

  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedTab, setSelectedTab] = useState(restaurantTabs[0]);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [numOfFavourites, setNumOfFavourites] = useState(0);
  const [isFavourited, setIsFavourited] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false); // shows custom alert for non-logged-in users

  // states for editing profile
  const [showInstagramPopup, setShowInstagramPopup] = useState(false);
  const [showEditDetailsPopup, setShowEditDetailsPopup] = useState(false);
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantImages, setRestaurantImages] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [reviewsData, setReviewsData] = useState(null);

  // Fetch restaurant data
  useEffect(() => {
    if (!restaurantId) return;

    const fetchAll = async () => {
      try {
        const [restaurantRes, reviewsRes, favouritesRes] = await Promise.all([
          fetch(`/api/restaurants/${restaurantId}`),
          fetch(`/api/restaurant-reviews/${restaurantId}`),
          fetch(`/api/restaurants/num-of-favourites/${restaurantId}`),
        ]);

        if (!restaurantRes.ok || !reviewsRes.ok || !favouritesRes.ok) {
          throw new Error('Fetch failed');
        }

        const [restaurantData, reviewsData, favouritesData] = await Promise.all([
          restaurantRes.json(),
          reviewsRes.json(),
          favouritesRes.json(),
        ]);

        setRestaurantData(restaurantData);
        setReviewsData(reviewsData);
        setNumOfFavourites(favouritesData.numOfFavourites);
      } catch (error) {
        console.error('Error fetching restaurant, review, or favourites data:', error);
      }
    };
    fetchAll();
  }, [restaurantId]);

  useEffect(() => {
    // Update images and banner images when restaurantData changes
    if (restaurantData?.images.length > 0) {
      setRestaurantImages(restaurantData.images);
    }
    if (restaurantData?.bannerImages.length > 0) {
      setBannerImages(restaurantData.bannerImages);
    }
  }, [restaurantData]);

  useEffect(() => {
    const fetchMongoUserId = async () => {
      try {
        if (!supabaseId) return;
        const userMongoId = await getGeneralUserMongoIDbySupabaseId({ supabaseId: supabaseId });

        if (!userMongoId) {
          console.error('MongoDB User ID not found for Supabase ID:', supabaseUserId);
          return;
        }
        setUserId(userMongoId);
      } catch (err) {
        console.error('Error getting user ID:', err.message);
        return;
      }
    };
    // Only fetch user ID if not the owner and userId is not already set
    if (!isOwner && !userId) fetchMongoUserId();
  }, [supabaseId]);

  // Syncs favourite icon with Supabase AND Mongo when it changes (prevents UI lag);
  // Clears immediately on logout, removing the filled-heart after logout
  useEffect(() => {
    if (!isAuthenticated) {
      setIsFavourited(false);
      return;
    }
    setIsFavourited(!!userData?.favouriteRestaurants?.includes(restaurantId));
  }, [isAuthenticated, userData?.favouriteRestaurants, restaurantId]);

  if (!restaurantData || !reviewsData) return <Spinner message="Loading..." />;

  // When user save restaurant as favourite
  const handleFavouriteRestaurantClick = async () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    // Optimistic UI -- makes favouriting action seem faster
    const next = !isFavourited;
    setIsFavourited(next);
    setNumOfFavourites(c => c + (next ? 1 : -1));

    try {
      const res = await fetch('/api/restaurants/save-as-favourite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          supabaseUserId: supabaseId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || 'Failed to toggle favourite');
      }

      await refreshUserData(); // update user favourites in context

      // still keep favourite count re-fetch if you want it live-updated
      const countRes = await fetch(`/api/restaurants/num-of-favourites/${restaurantId}`);
      if (countRes.ok) {
        const { numOfFavourites } = await countRes.json();
        setNumOfFavourites(numOfFavourites);
      }
    } catch (err) {
      console.error('Error toggling favourite:', err.message);
    }
  };

  // Show alert if "Write a Review" btn clicked and do NOT open form
  // if any user is NOT logged in
  const handleWriteReviewClick = () => {
    if (!supabaseId) {
      setShowLoginAlert(true);
      return;
    }
    setShowAddReviewForm(true);
  };

  const { name, cuisines, rating, numReviews, priceRange, dietaryOptions, BusinessHours, location } = restaurantData;

  return (
    <MainBaseContainer>
      {/* 4 banner images (can be modified by owner) */}
      <ImageBanner restaurantId={restaurantId} images={bannerImages} setImages={setBannerImages} isOwner={isOwner} />
      <InfoBanner
        name={name}
        avgRating={rating}
        numReviews={numReviews}
        priceRange={priceRange}
        cuisine={cuisines}
        address={location}
      >
        {isOwner ? (
          <>
            <SingleTabWithIcon icon={faGift} detailText={'Confirm Coupon'} onClick={() => setShowRedeemPopup(true)} />
            <SingleTabWithIcon
              icon={faInstagram}
              detailText={'Add Instagram Post'}
              onClick={() => setShowInstagramPopup(true)}
            />
            <RestaurantImageUpload
              restaurantId={restaurantId}
              images={restaurantImages}
              setImages={setRestaurantImages}
            />

            <SingleTabWithIcon
              icon={faPenClip}
              detailText={'Edit Profile Details'}
              onClick={() => setShowEditDetailsPopup(true)}
            />
          </>
        ) : (
          <div className="flex items-center ">
            <FavouriteButton
              handleFavouriteToggle={handleFavouriteRestaurantClick}
              isFavourited={isFavourited}
              numOfFavourites={numOfFavourites}
              forRestaurant={true}
            />
            <SingleTabWithIcon icon={faPen} detailText="Post a Review" onClick={handleWriteReviewClick} />
            {/*<SingleTabWithIcon icon={faUtensils} detailText="Reserve Table" />*/}
          </div>
        )}
      </InfoBanner>

      <div className="main-side-padding mb-16 w-full">
        <ProfileTabBar onTabChange={setSelectedTab} tabs={restaurantTabs} />

        {/* Reviews */}
        {selectedTab === restaurantTabs[0] && (
          <MasonryReviewGrid
            reviewList={reviewsData} // internal + external reviews
            selectedReview={selectedReview}
            setSelectedReview={setSelectedReview}
            restaurantId={restaurantId}
            restaurantName={name}
            isOwner={isOwner}
          />
        )}
        {/* Mentioned */}
        {selectedTab === restaurantTabs[1] && <MentionedTab restaurantId={restaurantId} />}
        {/* Photos */}
        {selectedTab === restaurantTabs[2] && <PhotoGallery photos={restaurantImages} isOwner={isOwner} />}
        {/* Events and Announcements */}
        {selectedTab === restaurantTabs[3] && <EventsAndAnnounce isOwner={isOwner} restaurantId={restaurantId} />}
        {/* Business Info */}
        {selectedTab === restaurantTabs[restaurantTabs.length - 1] && <BusinessInfo restaurant={restaurantData} />}
      </div>
      {showInstagramPopup && (
        <AddInstagramEmbed restaurantId={restaurantId} userId={userId} onClose={() => setShowInstagramPopup(false)} />
      )}
      {showRedeemPopup && (
        <RedeemCouponEmbed restaurantId={restaurantId} userId={userId} onClose={() => setShowRedeemPopup(false)} />
      )}
      {showEditDetailsPopup && (
        <EditProfileDetails
          onClose={() => setShowEditDetailsPopup(false)}
          images={restaurantImages}
          setImages={setRestaurantImages}
          restaurantData={restaurantData}
        />
      )}

      {/* review form + interactive star rating */}
      {userId && showAddReviewForm && (
        /* NOTE: "AddReviewForm" has two modes: Adding NEW reviews, and EDITING existing reviews.
               The paramter "editReviewMode" is false by default, but TRUE when user wants to edit review.*/
        <AddReviewForm
          restaurantId={restaurantId}
          userId={userId}
          onCancel={() => setShowAddReviewForm(false)}
        ></AddReviewForm>
      )}
      {showLoginAlert && <LoginAlertModal isOpen={showLoginAlert} handleClose={() => setShowLoginAlert(false)} />}
    </MainBaseContainer>
  );
}
