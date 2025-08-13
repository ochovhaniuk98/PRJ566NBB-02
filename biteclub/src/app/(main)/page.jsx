'use client';
import RestaurantCard from '@/components/restaurantProfile/RestaurantCard';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Button } from '@/components/shared/Button';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import ExploringBlogPostsAI from '@/components/blogPosts/ExploringBlogPostsAI';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info

  // cuisine spotlight restaurants
  const [cuisine, setCuisine] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [fetchedCuisineRestaurants, setFetchedCuisineRestaurants] = useState(false);
  const router = useRouter();

  // fetch restaurants
  const fetchRestaurants = async (reset = false) => {
    setFetchCompleted(false);

    if (!user) {
      console.warn('User not found. Skipping personalized fetch.');
      return;
    }

    try {
      if (!user?.id) return;
      const personalizedRecommendationsRes = await fetch(
        `${process.env.NEXT_PUBLIC_RECOMMENDER_URL}/restaurants/recommend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ supabaseId: user.id }),
        }
      );

      if (!personalizedRecommendationsRes.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await personalizedRecommendationsRes.json();
      setPersonalizedRecommendations(data.recommendations);
      console.log(data.recommendations);
      setFetchCompleted(true);
    } catch (error) {
      console.error('(main) Failed to fetch restaurants:', error);
      setFetchCompleted(false);
    }
  };

  // get cuisine spotlight
  useEffect(() => {
    async function fetchCuisineSpotlight() {
      try {
        // fetch cuisine
        const res = await fetch('/api/restaurants/cuisines/cuisineOfTheWeek');
        const data = await res.json();
        setCuisine(data.cuisines);

        console.log('Cuisine Spotlight', data.cuisines);
      } catch (err) {
        console.error('Failed to load cuisine spotlight of the week:', err);
      }
    }

    fetchCuisineSpotlight();
  }, []);

  useEffect(() => {
    // fetch cuisine restaurants
    async function fetchCuisineSpotlightRestaurants() {
      try {
        // fetch restaurants
        const params = new URLSearchParams({
          q: '',
          page: 1,
          limit: 5,
        });

        if (cuisine) {
          params.append('cuisines', cuisine.join(','));
          // console.log(`Cuisines chosen: ${cuisine.join(',')}`);
        }

        const res = await fetch(`/api/restaurants/search?${params.toString()}`);
        const data = await res.json();

        let filteredRestaurants = data.restaurants;
        filteredRestaurants = data.restaurants.filter(r => r.cuisines?.some(c => cuisine.includes(c)));

        setRestaurants(filteredRestaurants);
        setFetchedCuisineRestaurants(true);

        console.log('Cuisine spotlight restaurants', data.restaurants);
      } catch (err) {
        console.error('Failed to load cuisine spotlight restaurants:', err);
      }
    }

    fetchCuisineSpotlightRestaurants();
  }, [cuisine]);

  // reset page = 1
  useEffect(() => {
    setFetchCompleted(false);
    fetchRestaurants(true); // reset = true
  }, [user?.id]);

  const handleViewAllSubmit = async () => {
    router.push('/restaurants/cuisine');
  };

  const handleSurpriseMeSubmit = async () => {
    // TODO: redirect to random cuisine
    router.push('/restaurants/cuisine/random');
  };

  return (
    <>
      {fetchedCuisineRestaurants && (
        <div className="mb-16 w-full flex flex-col items-center pt-18 ">
          <div>
            <div className="flex items-center justify-between">
              <h2>CUISINE SPOTLIGHT: {cuisine}</h2>
              {/* 
              <Button variant="link" size="lg" onClick={handleSurpriseMeSubmit}>
                <h3>Surprise Me →</h3>
              </Button>*/}
              <button
                onClick={handleSurpriseMeSubmit}
                className="flex items-center gap-2 font-primary text-lg font-semibold text-brand-navy cursor-pointer border-b-2 border-brand-navy transform transition-transform duration-200 hover:scale-110"
              >
                Surprise Me <FontAwesomeIcon icon={faArrowRight} className={`text-2xl text-brand-navy`} />
              </button>

              <button
                className="font-primary font-semibold text-brand-navy cursor-pointer"
                onClick={handleViewAllSubmit}
              >
                View All
              </button>
            </div>
            <div className="overflow-x-scroll scrollbar-hide">
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
      {fetchCompleted ? (
        <div className="mb-16 w-full flex flex-col items-center">
          <div>
            <div className="flex items-center justify-between">
              {personalizedRecommendations.length > 0 && (
                <div>
                  <h2>For you</h2>
                  <div className="overflow-x-scroll">
                    <div className="w-fit h-full flex flex-row">
                      {fetchCompleted && (
                        <>
                          <GridCustomCols numOfCols={5} className="mt-4">
                            {personalizedRecommendations.map((restaurant, i) => (
                              <RestaurantCard key={restaurant._id || i} restaurantData={restaurant} />
                            ))}
                          </GridCustomCols>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mb-16 w-full flex flex-col items-center  pt-18 ">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2>Blog posts for you</h2>
                  <ExploringBlogPostsAI />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-5xl text-center font-primary font-bold text-brand-navy mt-50">This is the homepage.</h1>
      )}
    </>
  );
}
