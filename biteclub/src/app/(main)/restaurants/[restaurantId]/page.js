'use client';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import ImageBanner from '@/components/restaurantProfile/ImageBanner';
import InfoBanner from '@/components/restaurantProfile/InfoBanner';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import { bannerImages, reviewList, photosList } from '@/app/data/fakeData';
import ReviewsOnGrid3Col from '@/components/shared/ReviewsOnGrid3Col';
import { useState } from 'react';
import PhotoGallery from '@/components/restaurantProfile/PhotoGallery';

export default function RestaurantProfile() {
  const restaurantTabs = ['Reviews', 'Mentioned', 'Photos', 'Menu', 'Announcements', 'Business Info'];
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedTab, setSelectedTab] = useState(restaurantTabs[0]);

  return (
    <MainBaseContainer>
      <ImageBanner images={bannerImages} />
      <InfoBanner
        name="The Pomegranate Restaurant"
        avgRating={4.6}
        numReviews={1781}
        cuisine="Persian"
        address="420 College St, Toronto, ON M5T 1T3"
        numFavourites={123}
      />

      <div className="main-side-padding mb-16 w-full">
        <ProfileTabBar onTabChange={setSelectedTab} tabs={restaurantTabs} />

        {/* Reviews */}
        {selectedTab === restaurantTabs[0] && (
          <ReviewsOnGrid3Col
            selectedReview={selectedReview}
            setSelectedReview={setSelectedReview}
            reviewList={reviewList}
          />
        )}
        {/* Photos */}
        {selectedTab === restaurantTabs[2] && <PhotoGallery />}
      </div>
    </MainBaseContainer>
  );
}
// ${selectedReview ? 'grid-cols-2' : 'grid-cols-3'}
