'use client';
import RestaurantCard from '@/components/restaurantProfile/RestaurantCard';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Button } from '@/components/shared/Button';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import ExploringBlogPostsAI from '@/components/blogPosts/ExploringBlogPostsAI';

export default function Home() {
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const { user } = useUser(); // Current logged-in user's Supabase info

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
      console.error('Failed to fetch restaurants:', error);
      setFetchCompleted(false);
    }
  };

  // reset page = 1
  useEffect(() => {
    setFetchCompleted(false);
    fetchRestaurants(true); // reset = true
  }, []);

  return fetchCompleted ? (
    <div>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center pt-18 ">
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
      <div>
        <h2>Blog posts for you</h2>
        <ExploringBlogPostsAI />
      </div>
    </div>
  ) : (
    <h1 className="text-5xl text-center font-primary font-bold text-brand-navy mt-50">This is the homepage.</h1>
  );
}
