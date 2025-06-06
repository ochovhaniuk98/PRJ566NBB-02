'use client';
import { useState } from 'react';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Button } from '@/components/shared/Button';
import SearchResultsTabBar from '@/components/searchResults/SearchResultsTabBar';
import GridCustomCols from '@/components/shared/GridCustomCols';
import { fakeBlogPost, fakeUser, fakeRestaurantData } from '@/app/data/fakeData';
import BlogPostCard from '@/components/shared/BlogPostCard';
import GeneralUserCard from '@/components/shared/GeneralUserCard';
import RestaurantCard from '@/components/searchResults/RestaurantCard';

export default function RestaurantResults() {
  const [selectedTab, setSelectedTab] = useState(0); // for selecting search results type (default is restaurants)

  return (
    <MainBaseContainer className={'bg-brand-yellow'}>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center pt-18">
        <div className={'w-full h-full'}>
          <div className="flex justify-between mb-3">
            <SearchResultsTabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            {selectedTab === 0 && (
              <Button type="submit" className="w-30" variant="default">
                Filter
              </Button>
            )}
          </div>
          {selectedTab === 0 && (
            <GridCustomCols numOfCols={6}>
              <RestaurantCard restaurantData={fakeRestaurantData} />
            </GridCustomCols>
          )}
          {selectedTab === 1 && (
            <GridCustomCols numOfCols={4}>
              {Array.from({ length: 12 }).map((_, i) => (
                <BlogPostCard key={i} blogPostData={fakeBlogPost} />
              ))}
            </GridCustomCols>
          )}
          {selectedTab === 2 && (
            <GridCustomCols numOfCols={6}>
              {Array.from({ length: 18 }).map((_, i) => (
                <GeneralUserCard key={i} generalUserData={fakeUser} isFollowing={false} />
              ))}
            </GridCustomCols>
          )}
        </div>
      </div>
    </MainBaseContainer>
  );
}

/*
<Link href="/restaurants/682a2ecf70221a179b693583" className="mt-12">
Click here to see The Pomegranate Restaurant’s profile. check
</Link>
*/
