'use client';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import ImageBanner from '@/components/restaurantProfile/ImageBanner';
import InfoBanner from '@/components/restaurantProfile/InfoBanner';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import { fakeRestaurantData, fakeReviews, embedList } from '@/app/data/fakeData';
import ReviewsOnGrid3Col from '@/components/shared/ReviewsOnGrid3Col';
import PhotoGallery from '@/components/restaurantProfile/PhotoGallery';
import BusinessInfo from '@/components/restaurantProfile/BusinessInfo';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';
import { faLocationDot, faHeart, faUtensils, faPen } from '@fortawesome/free-solid-svg-icons';
import AddInstagramEmbed from '@/components/restaurantProfile/AddInstagramEmbed';
import EditProfileDetails from '@/components/restaurantProfile/EditProfileDetails';

import { useState } from 'react';
// EDIT RESTAURANT PROFILE!!!!!!!!
export default function EditRestaurantProfile() {
  const restaurantTabs = ['Reviews', 'Mentioned', 'Photos', 'Menu', 'Announcements', 'Business Info'];
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedTab, setSelectedTab] = useState(restaurantTabs[0]);

  // states for editing profile
  const [showInstagramPopup, setShowInstagramPopup] = useState(false);
  const [showEditDetailsPopup, setShowEditDetailsPopup] = useState(false);

  /* combine external and internal reviews together in 1 arr */
  const taggedReviews = fakeReviews.map(r => ({ type: 'review', data: r }));
  const taggedEmbeds = embedList.map(e => ({ type: 'embed', embedLink: e.embedLink }));
  const combinedList = [...taggedReviews, ...taggedEmbeds];
  const randomCombinedList = combinedList.sort(() => Math.random() - 0.5);

  const isBusinessUser = true; // flag for business user

  return (
    <MainBaseContainer>
      <ImageBanner images={fakeRestaurantData.bannerImages} />
      <InfoBanner
        name={fakeRestaurantData.name}
        avgRating={fakeRestaurantData.rating}
        numReviews={fakeRestaurantData.numReviews}
        cuisine={fakeRestaurantData.cuisines}
        address={fakeRestaurantData.location}
      >
        {isBusinessUser ? (
          <>
            <SingleTabWithIcon
              icon={faHeart}
              detailText={'Add Instagram Post'}
              onClick={() => setShowInstagramPopup(true)}
            />
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
            reviewList={randomCombinedList} // internal + external reviews
          />
        )}
        {/* Photos */}
        {selectedTab === restaurantTabs[2] && <PhotoGallery photos={fakeRestaurantData.images} />}

        {/* Business Info */}
        {selectedTab === restaurantTabs[5] && (
          <BusinessInfo
            restaurant={fakeRestaurantData}
            mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.5846656953045!2d-79.409522823823!3d43.656808871101966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34ebdcdf5c1b%3A0x7aaa6b866b22f51a!2sPomegranate%20Restaurant!5e0!3m2!1sen!2sca!4v1747776810081!5m2!1sen!2sca"
          />
        )}
      </div>
      {showInstagramPopup && <AddInstagramEmbed onClose={() => setShowInstagramPopup(false)} />}
      {showEditDetailsPopup && (
        <EditProfileDetails onClose={() => setShowEditDetailsPopup(false)} restaurantData={fakeRestaurantData} />
      )}
    </MainBaseContainer>
  );
}
