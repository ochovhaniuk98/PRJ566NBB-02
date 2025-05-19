'use client';
import ImageBanner from '@/components/restaurantProfile/ImageBanner';
import InfoBanner from '@/components/restaurantProfile/InfoBanner';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import { bannerImages, reviewList } from '@/app/data/fakeData';
import ReviewCard from '@/components/shared/ReviewCard';
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
          <div className={`grid grid-cols-3 gap-3 auto-rows-[minmax(12rem, auto)]`}>
            {selectedReview ? (
              <>
                {/* Left two columns: nested grid of reviews */}
                <div className="col-span-2 grid grid-cols-2 gap-3">
                  {reviewList.map(review => (
                    <ReviewCard
                      key={review.id}
                      imageSrc={review.imageSrc}
                      onClick={() => setSelectedReview(review)}
                      isSelected={selectedReview?.id === review.id}
                    />
                  ))}
                </div>

                {/* Third column: expanded review */}
                <div className="border border-brand-peach rounded-md p-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">Expanded Review</h2>
                    <button onClick={() => setSelectedReview(null)} className="text-sm text-blue-600 hover:underline">
                      Close
                    </button>
                  </div>
                  <p>This is full review for ID: {selectedReview.id}</p>
                  {selectedReview.imageSrc && (
                    <img src={selectedReview.imageSrc[0]} alt="full" className="mt-4 rounded-md" />
                  )}
                </div>
              </>
            ) : (
              // Default 3-column review grid
              reviewList.map(review => (
                <ReviewCard key={review.id} imageSrc={review.imageSrc} onClick={() => setSelectedReview(review)} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ${selectedReview ? 'grid-cols-2' : 'grid-cols-3'}
