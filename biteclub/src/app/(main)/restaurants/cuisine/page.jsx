// src/app/(main)/restaurants/cuisine/page.jsx
'use client';
import { useState, useEffect } from 'react';
import GridCustomCols from '@/components/shared/GridCustomCols';
import RestaurantCard from '@/components/restaurantProfile/RestaurantCard';
import { Button } from '@/components/shared/Button';
import StyledPageTitle from '@/components/shared/StyledPageTitle';

export default function CuisinePage() {
  // cuisine spotlight restaurants
  const [cuisine, setCuisine] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [fetchedCuisineRestaurants, setFetchedCuisineRestaurants] = useState(false);
  const [restaurantsCount, setRestaurantsCount] = useState(0);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // get cuisine spotlight
  useEffect(() => {
    async function fetchCuisineSpotlight() {
      try {
        // fetch cuisine
        const res = await fetch('/api/restaurants/cuisines/cuisineOfTheWeek');
        const data = await res.json();
        setCuisine(data.cuisines);

        // console.log('Cuisine Spotlight', data.cuisines);
      } catch (err) {
        console.error('Failed to load cuisine spotlight of the week:', err);
      }
    }

    fetchCuisineSpotlight();
  }, []);

  // fetch cuisine restaurants
  async function fetchCuisineSpotlightRestaurants(reset = false) {
    try {
      // fetch restaurants
      const params = new URLSearchParams({
        q: '',
        page: page,
        limit: 20,
      });

      if (cuisine) {
        params.append('cuisines', cuisine.join(','));
        //   console.log(`Cuisines chosen: ${cuisine}`);
      }

      const res = await fetch(`/api/restaurants/search?${params.toString()}`);
      const data = await res.json();
      let filteredRestaurants = data.restaurants;
      filteredRestaurants = data.restaurants.filter(r => r.cuisines?.some(c => cuisine.includes(c)));

      if (reset) {
        setPage(1);
        setRestaurants(filteredRestaurants);
        setRestaurantsCount(filteredRestaurants?.length);
      } else {
        setRestaurants(prev => {
          const ids = new Set(prev.map(r => r._id));
          const newOnes = filteredRestaurants.filter(r => !ids.has(r._id));
          return [...prev, ...newOnes];
        });
      }

      // if we've fetched everything, stop loading more
      // console.log(`filteredRestaurants?.length: ${filteredRestaurants?.length}`);
      if (
        (reset ? data?.restaurants?.length : filteredRestaurants?.length + data?.restaurants?.length) >=
        data?.totalCount
      ) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setFetchedCuisineRestaurants(true);

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
    <div className="md:pl-12">
      {fetchedCuisineRestaurants && (
        <div className="mb-16 w-full flex flex-col items-center pt-18 ">
          <div className={'w-full h-full relative'}>
            <StyledPageTitle textString={cuisine}></StyledPageTitle>
          </div>
          <div className="w-full h-full flex flex-row">
            <GridCustomCols numOfCols={5} className="mt-4">
              {restaurants.map((restaurant, i) => (
                <RestaurantCard key={restaurant._id || i} restaurantData={restaurant} />
              ))}
            </GridCustomCols>
          </div>
        </div>
      )}
      {hasMore && (
        <>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => setPage(prev => prev + 1)} variant="secondary">
              View More
            </Button>
          </div>
          <br />
        </>
      )}
    </div>
  );
}
