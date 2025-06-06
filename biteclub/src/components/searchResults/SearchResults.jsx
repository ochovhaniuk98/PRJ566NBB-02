'use client';
import { useState, useEffect } from 'react';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Button } from '@/components/shared/Button';
import SearchResultsTabBar from '@/components/searchResults/SearchResultsTabBar';
import GridCustomCols from '@/components/shared/GridCustomCols';
import { fakeBlogPost, fakeUser, fakeRestaurantData } from '@/app/data/fakeData';
import BlogPostCard from '@/components/shared/BlogPostCard';
import GeneralUserCard from '@/components/shared/GeneralUserCard';
import RestaurantCard from '@/components/searchResults/RestaurantCard';
import SearchResultsNumMessage from '@/components/searchResults/SearchResultsNumMessage';

// shows search results of restaurants, blog posts, and users
export default function SearchResults({ searchType = 0 }) {
  const [selectedTab, setSelectedTab] = useState(searchType); // for selecting search results type (default is restaurants)

  useEffect(() => {
    setSelectedTab(searchType);
  }, [searchType]);

  return (
    <MainBaseContainer className={'bg-brand-yellow'}>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center pt-18">
        <div className={'w-full h-full'}>
          <div className="flex justify-between mb-4">
            {/* tabs for selecting search type: restaurants, blog posts or users */}
            <SearchResultsTabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            {selectedTab === 0 && (
              <Button type="submit" className="w-30" variant="default">
                Filter
              </Button>
            )}
          </div>
          {/* Restaurant Results */}
          {selectedTab === 0 && (
            <>
              {/* shows message depending on search results */}
              <SearchResultsNumMessage searchTypeNum={selectedTab} numResults={123} searchString="Persian food" />
              <GridCustomCols numOfCols={6} className="mt-4">
                {/* isFavourited is false by default */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <RestaurantCard key={i} restaurantData={fakeRestaurantData} isFavourited={true} />
                ))}
              </GridCustomCols>
            </>
          )}
          {/* Blog Post Results */}
          {selectedTab === 1 && (
            <>
              <SearchResultsNumMessage searchTypeNum={selectedTab} numResults={1} searchString="abc" />
              <GridCustomCols numOfCols={4} className="mt-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <BlogPostCard key={i} blogPostData={fakeBlogPost} />
                ))}
              </GridCustomCols>
            </>
          )}
          {/* User Results */}
          {selectedTab === 2 && (
            <>
              <SearchResultsNumMessage searchTypeNum={selectedTab} numResults={0} searchString="abc" />
              <GridCustomCols numOfCols={6} className="mt-4">
                {Array.from({ length: 18 }).map((_, i) => (
                  <GeneralUserCard key={i} generalUserData={fakeUser} isFollowing={false} />
                ))}
              </GridCustomCols>
            </>
          )}
        </div>
      </div>
    </MainBaseContainer>
  );
}
