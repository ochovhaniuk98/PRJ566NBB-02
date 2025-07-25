// src/app/(main)/restaurants/cuisine/random/page.jsx
'use client';
import { getRandomCuisine } from '@/lib/cuisinesOfTheWeek';
import { useState, useEffect } from 'react';
import GridCustomCols from '@/components/shared/GridCustomCols';
import RestaurantCard from '@/components/restaurantProfile/RestaurantCard';
import { Button } from '@/components/shared/Button';

export default function RandomCuisinePage() {
  // random cuisine restaurants
  const [cuisine, setCuisine] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [fetchedCuisineRestaurants, setFetchedCuisineRestaurants] = useState(false);
  const [restaurantsCount, setRestaurantsCount] = useState(0);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchRandomCuisine() {
      const randomCuisine = [await getRandomCuisine()];
      if (isMounted) {
        try {
          // fetch random cuisine
          const randomCuisine = [await getRandomCuisine()];
          setCuisine(randomCuisine);

          console.log('Random Cuisine', randomCuisine);
        } catch (err) {
          console.error('Failed to load random cuisine:', err);
        }
      }
    }

    fetchRandomCuisine();

    return () => {
      isMounted = false;
    };
  }, []);

  // fetch cuisine restaurants
  async function fetchCuisineSpotlightRestaurants() {
    try {
      // fetch restaurants
      const params = new URLSearchParams({
        q: '',
        page: page,
        limit: 20,
      });

      if (cuisine) {
        params.append('cuisines', cuisine.join(','));
        // console.log(`Random Cuisine: ${cuisine}`);
      } else {
        return;
      }

      const res = await fetch(`/api/restaurants/search?${params.toString()}`);
      const data = await res.json();
      console.log('Raw data:', data);

      let filteredRestaurants = data.restaurants;
      filteredRestaurants = data.restaurants.filter(r => r.cuisines?.some(c => cuisine.includes(c)));

      setRestaurants(prev => {
        const ids = new Set(prev.map(r => r._id));
        const newOnes = filteredRestaurants.filter(r => !ids.has(r._id));
        return [...prev, ...newOnes];
      });

      setRestaurantsCount(prev => prev + filteredRestaurants?.length);

      // if we've fetched everything, stop loading more
      // console.log(`filteredRestaurants?.length: ${filteredRestaurants?.length}`);
      console.log(`filteredRestaurants?.length : ${filteredRestaurants?.length}`);
      console.log(`data?.restaurants?.length: ${data?.restaurants?.length}`);
      console.log(`data?.totalCoun: ${data?.totalCount}`);
      console.log(`restaurantsCount: ${restaurantsCount}`);
      console.log(`hasMore: ${hasMore}`);
      if (filteredRestaurants?.length + data?.restaurants?.length >= data?.totalCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setFetchedCuisineRestaurants(true);
      console.log(`hasMore: ${hasMore}`);

      //   let allRestaurants = data.restaurants;
      //   let filteredRestaurants = allRestaurants.filter(r => r.cuisines?.some(c => cuisine.includes(c)));

      //   const rejectedCount = allRestaurants.length - filteredRestaurants.length;
      //   const newTotalCount = data.totalCount - rejectedCount;

      //   setRestaurants(prev => {
      //     const ids = new Set(prev.map(r => r._id));
      //     const newOnes = filteredRestaurants.filter(r => !ids.has(r._id));
      //     return [...prev, ...newOnes];
      //   });

      //   // Use the updated newTotalCount instead of restaurantsCount
      //   const totalFetched = restaurants.length + filteredRestaurants.length;

      //   setHasMore(totalFetched < newTotalCount);

      //   setFetchedCuisineRestaurants(true);

      // console.log('Cuisine spotlight restaurants', data.restaurants);
    } catch (err) {
      console.error('Failed to load cuisine spotlight restaurants:', err);
    }
  }

  // when page > 1 || cuisine changes
  useEffect(() => {
    fetchCuisineSpotlightRestaurants();
  }, [cuisine, page]);

  return (
    <>
      {fetchedCuisineRestaurants && (
        <div className="main-side-padding mb-16 w-full flex flex-col items-center pt-18 ">
          <div>
            <h2>SURPRISE CUISINE: {cuisine}</h2>
            <div className="overflow-x-scroll">
              <div className="w-fit h-full flex flex-row">
                <GridCustomCols numOfCols={5} className="mt-4">
                  {restaurants.map((restaurant, i) => (
                    <RestaurantCard key={restaurant._id || i} restaurantData={restaurant} />
                  ))}
                </GridCustomCols>
              </div>
            </div>
          </div>
        </div>
      )}
      {hasMore && (
        <>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => setPage(prev => prev + 1)}>Load More</Button>
          </div>
          <br />
        </>
      )}
    </>
  );
}
