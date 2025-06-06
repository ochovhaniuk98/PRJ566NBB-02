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
import StarRating from '../shared/StarRating';

export default function RestaurantProfile({ isOwner = false, restaurantId }) {
  // isVerified = false,
  const restaurantTabs = ['Reviews', 'Mentioned', 'Photos', 'Menu', 'Announcements', 'Business Info'];
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedTab, setSelectedTab] = useState(restaurantTabs[0]);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState({ value: 0, message: '' }); // stores the updated rating value when adding a review

  // states for editing profile
  const [showInstagramPopup, setShowInstagramPopup] = useState(false);
  const [showEditDetailsPopup, setShowEditDetailsPopup] = useState(false);

  const [restaurantData, setRestaurantData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/restaurants/${restaurantId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch restaurant data');
        }
        const restaurantData = await res.json();
        setRestaurantData(restaurantData);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchData();
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/restaurant-reviews/${restaurantId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch restaurant reviews');
        }
        const reviewsData = await res.json();
        setReviewsData(reviewsData);
      } catch (error) {
        console.error('Error fetching restaurant reviews:', error);
      }
    };
    fetchReviews();
  }, [restaurantId]);

  if (!restaurantData || !reviewsData) {
    return <p>isLoading...</p>;
  }

  const {
    name,
    cuisines,
    rating,
    numReviews,
    priceRange,
    dietaryOptions,
    BusinessHours,
    bannerImages,
    images,
    location,
  } = restaurantData;

  return (
    <MainBaseContainer>
      <ImageBanner images={bannerImages} />
      <InfoBanner name={name} avgRating={rating} numReviews={numReviews} cuisine={cuisines} address={location}>
        {isOwner ? ( // && isVerified
          <>
            <SingleTabWithIcon
              icon={faHeart}
              detailText={'Add Instagram Post'}
              onClick={() => setShowInstagramPopup(true)}
            />
            <RestaurantImageUpload buttonType={'iconTab'} />

            <SingleTabWithIcon
              icon={faHeart}
              detailText={'Edit Profile Details'}
              onClick={() => setShowEditDetailsPopup(true)}
            />
          </>
        ) : (
          <>
            <SingleTabWithIcon icon={faHeart} detailText={0} />
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
        {/* Photos */}
        {selectedTab === restaurantTabs[2] && <PhotoGallery photos={images} />}

        {/* Business Info */}
        {selectedTab === restaurantTabs[5] && <BusinessInfo restaurant={restaurantData} />}
      </div>
      {showInstagramPopup && (
        <AddInstagramEmbed restaurantId={restaurantData._id} onClose={() => setShowInstagramPopup(false)} />
      )}
      {showEditDetailsPopup && (
        <EditProfileDetails onClose={() => setShowEditDetailsPopup(false)} restaurantData={restaurantData} />
      )}

      {/* review form + interactive star rating */}
      {showAddReviewForm && (
        /* NOTE: "AddReviewForm" has two modes: Adding NEW reviews, and EDITING existing reviews.
               The paramter "editReviewMode" is false by default, but TRUE when user wants to edit review.*/
        <AddReviewForm onCancel={() => setShowAddReviewForm(false)}>
          {/* StarRating also has two modes: STATIC (for just viewing on review cards) and INTERACTIVE for inputting ratings in the AddReviewForm.
                Parameters "interactive" and "onChange" are false or empty by default, but need values when StarRating is being used for rating input.*/}
          <StarRating
            iconSize="text-4xl cursor-pointer"
            interactive={true}
            onChange={(val, msg) => setReviewRating({ value: val, message: msg })}
          />
          {reviewRating.value > 0 && <p>{reviewRating.message}</p>}
        </AddReviewForm>
      )}
    </MainBaseContainer>
  );
}
