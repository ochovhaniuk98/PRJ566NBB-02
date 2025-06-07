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
export default function SearchResults({ searchType = 0, searchQuery = '' }) {
  const [selectedTab, setSelectedTab] = useState(searchType); // for selecting search results type (default is restaurants)
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsCount, setRestaurantsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [blogPosts, setBlogPosts] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch restaurant data based on the search query
  const fetchRestaurants = async (reset = false) => {
    console.log('Page: ', page);
    try {
      const res = await fetch(`/api/restaurants/search?q=${searchQuery}&page=${page}&limit=20`);
      const data = await res.json();

      if (reset) {
        setPage(1);
        setRestaurants(data.restaurants);
        setRestaurantsCount(data.totalCount);
      } else {
        // append data to existing list
        setRestaurants(prev => [...prev, ...data.restaurants]);
      }

      // if we've fetched everything, stop loading more
      if ((reset ? data.restaurants.length : restaurants.length + data.restaurants.length) >= data.totalCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    }
  };

  useEffect(() => {
    if (selectedTab === 0 && searchQuery) {
      setPage(1);
      fetchRestaurants(true); // reset = true
    }
  }, [searchQuery, selectedTab]);

  useEffect(() => {
    if (selectedTab === 0 && page > 1) {
      fetchRestaurants();
    }
  }, [page]);

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
              <SearchResultsNumMessage
                searchTypeNum={selectedTab}
                numResults={restaurantsCount}
                searchString={searchQuery}
              />
              <GridCustomCols numOfCols={6} className="mt-4">
                {/* isFavourited is false by default */}
                {restaurants.map((restaurant, i) => (
                  <RestaurantCard key={restaurant._id || i} restaurantData={restaurant} isFavourited={false} />
                ))}
              </GridCustomCols>
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => setPage(prev => prev + 1)}>Load More</Button>
                </div>
              )}
            </>
          )}
          {/* Blog Post Results */}
          {selectedTab === 1 && (
            <>
              <SearchResultsNumMessage searchTypeNum={selectedTab} numResults={1} searchString={searchQuery} />
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
              <SearchResultsNumMessage searchTypeNum={selectedTab} numResults={0} searchString={searchQuery} />
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
