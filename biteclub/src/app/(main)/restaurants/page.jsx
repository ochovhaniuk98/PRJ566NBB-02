'use client';
import RestaurantCard from '@/components/restaurantProfile/RestaurantCard';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Button } from '@/components/shared/Button';
import { useState, useEffect, useRef } from 'react';

export default function RestaurantResults() {
  const [restaurants, setRestaurants] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const scrollPositionRef = useRef(0);

  // fetch restaurants
  const fetchRestaurants = async (reset = false) => {
    setFetchCompleted(false);

    try {
      const res = await fetch(`/api/restaurants/list?page=${page}&limit=20`);
      const data = await res.json();

      if (reset) {
        setPage(1);
        setRestaurants(data.restaurants);
      } else {
        // append data to existing list
        setRestaurants(prev => {
          const ids = new Set(prev.map(r => r._id));
          const newOnes = data.restaurants.filter(r => !ids.has(r._id)); // avoid duplicates
          return [...prev, ...newOnes];
        });
      }

      // if we've fetched everything, stop loading more
      if ((reset ? data?.restaurants?.length : restaurants?.length + data?.restaurants?.length) >= data?.totalCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setFetchCompleted(true);
    } catch (error) {
      setFetchCompleted(true);
      console.error('(Restaurant results)Failed to fetch restaurants:', error);
    }
  };

  // reset page = 1
  useEffect(() => {
    setFetchCompleted(false);
    fetchRestaurants(true); // reset = true
  }, []);

  // when page > 1
  useEffect(() => {
    fetchRestaurants();
  }, [page]);

  useEffect(() => {
    if (page > 1 && fetchCompleted) {
      // restore exact user's scroll position
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
    }
  }, [restaurants]);

  const loadMore = () => {
    // save current vertical scroll position before state update
    scrollPositionRef.current = window.scrollY;
    setPage(prev => prev + 1);
  };

  return (
    <MainBaseContainer className={'bg-brand-yellow'}>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center pt-18">
        <div className={'w-full h-full'}>
          <h2>Popular And New Restaurants</h2>
          {fetchCompleted && (
            <>
              {/* Restaurant List */}
              <GridCustomCols numOfCols={5} className="mt-4">
                {restaurants.map((restaurant, i) => (
                  <RestaurantCard key={restaurant._id || i} restaurantData={restaurant} />
                ))}
              </GridCustomCols>
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button type="button" onClick={loadMore}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainBaseContainer>
  );
}
