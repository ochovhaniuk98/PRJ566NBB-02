import MainBaseContainer from '@/components/shared/MainBaseContainer';
import ImageBanner from '@/components/restaurantProfile/ImageBanner';
import InfoBanner from '@/components/restaurantProfile/InfoBanner';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import ReviewsOnGrid3Col from '@/components/shared/ReviewsOnGrid3Col';
import PhotoGallery from '@/components/restaurantProfile/PhotoGallery';
import BusinessInfo from '@/components/restaurantProfile/BusinessInfo';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';

import { faLocationDot, faHeart, faUtensils, faPen } from '@fortawesome/free-solid-svg-icons';
import AddInstagramEmbed from '@/components/restaurantProfile/AddInstagramEmbed';
import EditProfileDetails from '@/components/restaurantProfile/EditProfileDetails';
import { useEffect, useState } from 'react';
import RestaurantImageUpload from '@/components/restaurantProfile/RestaurantImageUpload';

export default function RestaurantProfile({ isOwner = false, isVerified = false, restaurantId }) {
  const restaurantTabs = ['Reviews', 'Mentioned', 'Photos', 'Menu', 'Announcements', 'Business Info'];
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedTab, setSelectedTab] = useState(restaurantTabs[0]);

  // states for editing profile
  const [showInstagramPopup, setShowInstagramPopup] = useState(false);
  const [showEditDetailsPopup, setShowEditDetailsPopup] = useState(false);
  const [showAddPhotoPopup, setShowAddPhotoPopup] = useState(false);

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
        
        {isOwner && isVerified ? (
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
            <SingleTabWithIcon icon={faPen} detailText="Write a Review" />
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
    </MainBaseContainer>
  );
}
