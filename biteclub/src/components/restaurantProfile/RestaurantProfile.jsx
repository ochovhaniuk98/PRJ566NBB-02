import { createClient } from '@/lib/auth/client';

import MainBaseContainer from '@/components/shared/MainBaseContainer';
import ImageBanner from '@/components/restaurantProfile/ImageBanner';
import InfoBanner from '@/components/restaurantProfile/InfoBanner';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import ReviewsOnGrid3Col from '@/components/shared/ReviewsOnGrid3Col';
import PhotoGallery from '@/components/restaurantProfile/PhotoGallery';
import BusinessInfo from '@/components/restaurantProfile/BusinessInfo';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';

import { faHeart, faUtensils, faPen } from '@fortawesome/free-solid-svg-icons';
import AddInstagramEmbed from '@/components/restaurantProfile/AddInstagramEmbed';
import EditProfileDetails from '@/components/restaurantProfile/EditProfileDetails';
import { useEffect, useState } from 'react';
import RestaurantImageUpload from '@/components/restaurantProfile/RestaurantImageUpload';
import AddReviewForm from '../shared/AddReviewForm';
import GridCustomCols from '../shared/GridCustomCols';
import BlogPostCard from '../shared/BlogPostCard';
import { fakeBlogPost } from '@/app/data/fakeData';
import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';

export default function RestaurantProfile({ isOwner = false, restaurantId }) {
  const restaurantTabs = ['Reviews', 'Mentioned', 'Photos', 'Menu', 'Announcements', 'Business Info'];
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedTab, setSelectedTab] = useState(restaurantTabs[0]);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState({ value: 0, message: '' }); // stores the updated rating value when adding a review
  const [numOfFavourites, setNumOfFavourites] = useState(0);

  // stores the MongoDB user ID of the logged-in user, or restaurantId if owner
  const [userId, setUserId] = useState(isOwner ? restaurantId : null); // If the user is the owner, we can use restaurantId directly as userId.

  // states for editing profile
  const [showInstagramPopup, setShowInstagramPopup] = useState(false);
  const [showEditDetailsPopup, setShowEditDetailsPopup] = useState(false);

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

  const getSupabaseUserId = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user?.id) throw new Error('User not logged in');
      return data.user.id;
    } catch (err) {
      console.error('Error getting Supabase user ID:', err.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchMongoUserId = async () => {
      try {
        const supabaseUserId = await getSupabaseUserId();
        if (!supabaseUserId) {
          console.error('Supabase User ID not found');
          return;
        }
        const userMongoId = await getGeneralUserMongoIDbySupabaseId({ supabaseId: supabaseUserId });

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
  }, []);

  // When user save restaurant as favourite
  const handleFavouriteRestaurantClick = async () => {
    try {
      const supabaseUserId = await getSupabaseUserId();
      if (!supabaseUserId) {
        console.error('Supabase User ID not found');
        return;
      }

      const res = await fetch('/api/restaurants/save-as-favourite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          supabaseUserId: supabaseUserId,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to toggle favourite');

      // Re-fetch the updated Favourite count immediately from backend
      const countRes = await fetch(`/api/restaurants/num-of-favourites/${restaurantId}`);
      if (!countRes.ok) {
        throw new Error('Failed to fetch updated favourite count');
      }

      const countData = await countRes.json();
      setNumOfFavourites(countData.numOfFavourites);
    } catch (err) {
      console.error('Error toggling favourite:', err.message);
    }
  };

  if (!restaurantData || !reviewsData) {
    return <p>isLoading...</p>;
  }

  const { name, cuisines, rating, numReviews, priceRange, dietaryOptions, BusinessHours, location } = restaurantData;

  return (
    <MainBaseContainer>
      {/* 4 banner images (can be modified by owner) */}
      <ImageBanner restaurantId={restaurantId} images={bannerImages} setImages={setBannerImages} isOwner={isOwner} />
      <InfoBanner name={name} avgRating={rating} numReviews={numReviews} cuisine={cuisines} address={location}>
        {isOwner ? (
          <>
            <SingleTabWithIcon
              icon={faHeart}
              detailText={'Add Instagram Post'}
              onClick={() => setShowInstagramPopup(true)}
            />
            <RestaurantImageUpload
              restaurantId={restaurantId}
              images={restaurantImages}
              setImages={setRestaurantImages}
            />

            <SingleTabWithIcon
              icon={faHeart}
              detailText={'Edit Profile Details'}
              onClick={() => setShowEditDetailsPopup(true)}
            />
          </>
        ) : (
          <>
            <SingleTabWithIcon
              icon={faHeart}
              detailText={numOfFavourites ?? 0}
              onClick={handleFavouriteRestaurantClick}
            />
            <SingleTabWithIcon icon={faPen} detailText="Write a Review" onClick={() => setShowAddReviewForm(true)} />
            <SingleTabWithIcon icon={faUtensils} detailText="Reserve Table" />
          </>
        )}
      </InfoBanner>

      <div className="main-side-padding mb-16 w-full">
        <ProfileTabBar onTabChange={setSelectedTab} tabs={restaurantTabs} />

        {/* Reviews */}
        {selectedTab === restaurantTabs[0] && (
          <ReviewsOnGrid3Col
            selectedReview={selectedReview}
            setSelectedReview={setSelectedReview}
            reviewList={reviewsData} // internal + external reviews
          />
        )}
        {/* Mentioned */}
        {selectedTab === restaurantTabs[1] && (
          <GridCustomCols numOfCols={4}>
            {Array.from({ length: 12 }).map((_, i) => (
              <BlogPostCard key={i} blogPostData={fakeBlogPost} />
            ))}
          </GridCustomCols>
        )}
        {/* Photos */}
        {selectedTab === restaurantTabs[2] && <PhotoGallery photos={restaurantImages} isOwner={isOwner} />}

        {/* Business Info */}
        {selectedTab === restaurantTabs[5] && <BusinessInfo restaurant={restaurantData} />}
      </div>
      {showInstagramPopup && (
        <AddInstagramEmbed restaurantId={restaurantId} userId={userId} onClose={() => setShowInstagramPopup(false)} />
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
    </MainBaseContainer>
  );
}
