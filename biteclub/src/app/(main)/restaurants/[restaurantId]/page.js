'use client';
import ImageBanner from '@/components/restaurantProfile/ImageBanner';
import InfoBanner from '@/components/restaurantProfile/InfoBanner';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import bannerImages from '@/app/data/fakeData';
import ReviewCard from '@/components/shared/ReviewCard';

export default function RestaurantProfile() {
  const restaurantTabs = ['Reviews', 'Mentioned', 'Photos', 'Menu', 'Announcements', 'Business Info'];
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
          <div className="grid grid-cols-3 gap-3 auto-rows-[minmax(12rem, auto)]">
            <ReviewCard imageSrc={bannerImages} />
            <ReviewCard imageSrc={bannerImages} />
            <ReviewCard />
            <ReviewCard imageSrc={bannerImages} />
            <ReviewCard />
            <ReviewCard imageSrc={bannerImages} />
          </div>
        </div>
      </div>
    </div>
  );
}
