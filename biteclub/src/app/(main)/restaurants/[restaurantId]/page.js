'use client';
import ImageBanner from '@/components/restaurantProfile/ImageBanner';
import InfoBanner from '@/components/restaurantProfile/InfoBanner';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import { bannerImages, reviewList } from '@/app/data/fakeData';
import ReviewCard from '@/components/shared/ReviewCard';
import GridCustomCols from '@/components/shared/GridCustomCols';
import ReviewsOnGrid3Col from '@/components/shared/ReviewsOnGrid3Col';

import { useState } from 'react';

export default function RestaurantProfile() {
  const restaurantTabs = ['Reviews', 'Mentioned', 'Photos', 'Menu', 'Announcements', 'Business Info'];
  const [selectedReview, setSelectedReview] = useState(null);
  return (
    <div>
      <div className="absolute top-0 left-12 right-0">
        <div className="flex flex-col ">
          <ImageBanner images={bannerImages} />
          <InfoBanner
            name="The Pomegranate Restaurant"
            avgRating={4.6}
            numReviews={1781}
            cuisine="Persian"
            address="420 College St, Toronto, ON M5T 1T3"
            numFavourites={123}
          />
        </div>
        <div className="main-side-margins mb-16">
          <ProfileTabBar onTabChange={tab => console.log(tab)} tabs={restaurantTabs} />
          <GridCustomCols numOfCols={3}>
            <ReviewsOnGrid3Col
              selectedReview={selectedReview}
              setSelectedReview={setSelectedReview}
              reviewList={reviewList}
            />
          </GridCustomCols>
        </div>
      </div>
    </div>
  );
}
// ${selectedReview ? 'grid-cols-2' : 'grid-cols-3'}
