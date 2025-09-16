'use client';
import RestaurantCard from '@/components/restaurantProfile/RestaurantCard';
import GridCustomCols from '@/components/shared/GridCustomCols';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import ExploringBlogPostsAI from '@/components/blogPosts/ExploringBlogPostsAI';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowRightToBracket, faGamepad } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import StyledPageTitle from '@/components/shared/StyledPageTitle';
import ExploringBlogPosts from '@/components/blogPosts/ExploringBlogPosts';

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
    <div className="md:pl-12 pb-12">
      {fetchCompleted ? (
        <div className="main-side-padding mb-16 w-full flex flex-col items-center">
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
          <div className="mb-16 w-full flex flex-col items-center pt-18 ">
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
        /* Placeholder if recommendations are unavailable */
        /* lg:bg-brand-green md:bg-brand-peach bg-pink-400 */
        <>
          <div className="bg-gradient-to-br from-brand-yellow to-[#ffc94c]  w-full min-h-[350px] xl:h-[48vw] lg:h-[52vw] md:h-[64vw] h-[31rem] relative overflow-hidden">
            <div className="absolute xl:size-[48vw] lg:size-[46vw] md:size-[56vw] size-[66vw] xl:left-[40vw] lg:left-[44vw] md:left-[40vw] left-[32vw] xl:-bottom-27 lg:-bottom-17 md:-bottom-16 -bottom-14">
              <Image
                src={'/img/foodPlatesCoin.png'}
                alt={'food plates'}
                quality={100}
                unoptimized={true}
                className="object-contain"
                fill={true}
              />
            </div>
            {/*<div className="relative size-168 w-full -left-140 -bottom-16">
              <Image src={'/img/spilledBottle.png'} alt={'spilled bottle'} className="object-contain" fill={true} />
            </div>*/}
            <div
              className="absolute -top-2 left-[10%] font-secondary xl:leading-24 lg:leading-20 md:leading-17 leading-14 uppercase w-[50%] h-full cursor-default "
              style={{
                backgroundImage: '', // url('/img/spilledBottle.png')
                backgroundSize: '40vw', // try 80%, 100%, 120% to increase size
                backgroundPosition: '0rem 7rem',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="landingContainer">
                <div className="absolute xl:w-100 lg:w-90 md:w-70 w-full left-0 h-full">
                  <div className="landingTitle absolute">
                    Level Up Your
                    <br />
                    <span className="landingTitleSpan">Taste</span>
                  </div>
                  <div className="landingTitle absolute md:top-1 top-[2px] text-brand-green md:[-webkit-text-stroke:1px_black] [-webkit-text-stroke:0.75px_black]">
                    Level Up Your
                    <br />
                    <span className="landingTitleSpan text-white">Taste</span>
                  </div>
                </div>
                <div className="landingText">
                  Turn every meal into an adventure.
                  <br />
                  Explore, taste, and collect points for discounts as you level up your palate with BiteClub
                </div>
                <div className="landingButtons">
                  <button
                    onClick={() => router.push('/sign-up')}
                    className="landingButtonSingle bg-brand-green transform transition-transform duration-200 hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faGamepad} className={`text-2xl`} />
                    Join to Play
                  </button>
                  <button onClick={() => router.push('/login')} className="landingButtonSingle bg-brand-peach">
                    <FontAwesomeIcon icon={faArrowRightToBracket} className={`text-2xl text-brand-navy`} />
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*<div className="flex gap-4 items-center justify-center w-full h-20 bg-brand-green font-secondary text-4xl text-brand-navy">
            Can't decide what to eat?
            <button
              onClick={handleSurpriseMeSubmit}
              className="flex items-center gap-2 font-primary text-lg font-semibold text-brand-navy cursor-pointer border-b-2 border-brand-navy transform transition-transform duration-200 hover:scale-110"
            >
              Surprise Me <FontAwesomeIcon icon={faArrowRight} className={`text-2xl text-brand-navy`} />
            </button>
            <button
              onClick={handleSurpriseMeSubmit}
              className=" bg-brand-green uppercase flex items-center gap-2 font-primary text-lg font-semibold text-brand-navy cursor-pointer border-brand-navy border-1 rounded-sm shadow-lg py-2 px-4 transform transition-transform duration-200 hover:scale-110"
            >
              Surprise Me
              <FontAwesomeIcon icon={faArrowRight} className={`text-2xl`} />
            </button>
          </div> */}
        </>
      )}
      {/* Cuisine Spotlight */}
      {fetchedCuisineRestaurants && (
        <div className="main-side-padding mb-16 flex flex-col items-center w-full">
          <div className="flex items-center justify-between w-full relative h-12">
            <StyledPageTitle textString={cuisine} />

            <button className="font-primary font-semibold text-brand-navy cursor-pointer" onClick={handleViewAllSubmit}>
              View All
            </button>
          </div>
          <GridCustomCols numOfCols={5} className="md:mt-4 mt-0">
            {restaurants.map((restaurant, i) => (
              <RestaurantCard key={restaurant._id || i} restaurantData={restaurant} />
            ))}
          </GridCustomCols>
          <ExploringBlogPosts />
        </div>
      )}
    </div>
  );
}
