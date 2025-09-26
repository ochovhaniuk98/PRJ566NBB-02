'use client';
import RestaurantCard from '@/components/restaurantProfile/RestaurantCard';
import GridCustomCols from '@/components/shared/GridCustomCols';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import ExploringBlogPostsAI from '@/components/blogPosts/ExploringBlogPostsAI';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowRightToBracket, faGamepad, faPepperHot } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import StyledPageTitle from '@/components/shared/StyledPageTitle';
import ExploringBlogPosts from '@/components/blogPosts/ExploringBlogPosts';
import { Button } from '@/components/shared/Button';
import RotatingGallery from '@/components/homepage/RotatingGallery';
import { POME_IMAGES } from '@/app/data/fakeData';
import StarRating from '@/components/shared/StarRating';
import Sparkles from '@/components/homepage/Sparkles';

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
          <div className="bg-gradient-to-br from-brand-yellow to-[#ffce5d]  w-full min-h-[350px] xl:h-[48vw] lg:h-[52vw] md:h-[64vw] h-[31rem] min-w-[20rem] relative overflow-hidden">
            <div className="absolute xl:size-[50vw] lg:size-[46vw] md:size-[56vw] sm:size-[66vw] size-[20rem] xl:left-[40vw] lg:left-[44vw] md:left-[38vw] sm:left-[32vw] left-[8rem] xl:-bottom-28 lg:-bottom-17 md:-bottom-16 sm:-bottom-15 -bottom-11 min-h-72">
              <Image
                src={'img/landingBannerLargeTxt2.png'}
                alt={'food plates'}
                quality={100}
                unoptimized={true}
                className="object-contain"
                fill={true}
              />
              <Sparkles />
            </div>
            <div className="absolute -top-2 left-[10%] font-secondary xl:leading-24 lg:leading-20 md:leading-17 leading-14 uppercase w-[50%] h-full cursor-default ">
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
                  Explore, taste, and collect points for discounts as you level up your palate with BiteClub.
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
          <div
            className=" flex flex-col gap-4 items-center justify-center w-full h-full md:p-8 p-2 md:py-8 py-4 bg-brand-aqua text-center
    bg-no-repeat
    sm:bg-[url('/img/lightSpoonFork.png')] sm:bg-[length:12rem] sm:bg-[position:10%_8rem]
    md:bg-[url('/img/lightSpoonFork.png')] md:bg-[length:12rem] md:bg-[position:5%_6rem]
    lg:bg-[url('/img/lightSpoonFork.png')] lg:bg-[length:12rem] lg:bg-[position:5%_6rem]
    xl:bg-[url('/img/lightSpoonFork.png')] xl:bg-[length:15rem] xl:bg-[position:18%_4rem]"
          >
            <div className="relative lg:w-3xl md:w-lg w-sm lg:h-17 h-8">
              <StyledPageTitle
                textString="Can't decide what to eat?"
                p_fontSize="lg:text-7xl md:text-5xl text-4xl"
                txtColour="text-white"
                outlineWidth="lg:[-webkit-text-stroke:0.75px_black] [-webkit-text-stroke:0.75px_black]"
                shadowPos="lg:top-[3px] top-[2px]"
                textAlign="text-center"
              />
            </div>
            <p className="w-sm">
              When everything looks good, choosing can be the hardest part. Let chance decide. Discover a cuisine you
              didn’t know you were craving.
            </p>
            {/*<button
              onClick={handleSurpriseMeSubmit}
              className=" bg-brand-peach uppercase flex items-center gap-2 font-primary text-lg font-semibold text-brand-navy cursor-pointer border-brand-navy border-1 rounded-sm shadow-lg py-2 px-4 transform transition-transform duration-200 hover:scale-110 [-webkit-text-stroke:0px_black]"
            >
              Surprise Me
              <FontAwesomeIcon icon={faArrowRight} className={`text-2xl`} />
            </button>*/}
            <Button className="m-auto" onClick={handleSurpriseMeSubmit} variant="secondary" disabled={false}>
              Surprise Me
              <FontAwesomeIcon icon={faArrowRight} className={`text-xl`} />
            </Button>
          </div>
        </>
      )}
      {/* Cuisine Spotlight */}
      {fetchedCuisineRestaurants && (
        <div className="main-side-padding mb-16 flex flex-col items-center w-full">
          <div className="flex items-baseline-last justify-between w-full relative h-auto mt-8 md:mb-0 mb-4">
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
          {/* The Pomegranate Reaturant Feature */}
          <div className=" bg-white mt-12 flex w-full min-h-96 border border-brand-yellow-lite p-3">
            <div className="w-3/7 pr-4">
              <RotatingGallery images={POME_IMAGES} />
            </div>
            <div className="w-4/7 flex justify-center items-center relative">
              <div className="absolute top-0 left-1 flex items-center text-brand-grey gap-2">
                <FontAwesomeIcon icon={faPepperHot} className={`text-xl text-brand-grey`} />
                <h3 className="">Hot Spot of the Week</h3>
              </div>
              <div className="flex flex-col gap-y-4 items-center p-12">
                <div className="absolute size-16 top-8 hidden">
                  <Image
                    src={'img/chefHat.png'}
                    alt={'food plates'}
                    quality={100}
                    unoptimized={true}
                    className="object-contain"
                    fill={true}
                  />
                </div>
                <StyledPageTitle
                  textString="The Pomegranate"
                  p_fontSize="lg:text-7xl md:text-5xl text-4xl"
                  txtColour="text-brand-yellow"
                  outlineWidth="lg:[-webkit-text-stroke:0.75px_black] [-webkit-text-stroke:0.75px_black]"
                  shadowPos="lg:top-[3px] top-[2px]"
                  textAlign="text-center"
                />

                <div className="flex items-center gap-x-2">
                  <h2 className="font-semibold">{4.2}</h2>
                  <StarRating colour={'text-brand-green'} iconSize={'md:icon-xl icon-lg'} ratingNum={4} />
                  <div className="font-normal text-xl font-primary">
                    {`1000 `}
                    <span className="font-normal text-xl font-primary">reviews</span>
                  </div>
                  {/* price range tag */}
                  <div className="bg-brand-blue-lite px-2 rounded-full w-15 h-fit flex justify-center text-primary">
                    <p>$</p>
                  </div>
                </div>
                <p className="text-black text-lg font-normal">
                  Opened in 2003 by Ali Fakhrashrafi and Danielle Schrage, The Pomegranate is a love letter to Ali’s
                  Iranian childhood. The couple set out to serve home-style Persian stews, researching recipes in
                  memoirs and historical texts. With chefs who’ve stayed two decades, they’ve built a living legacy.
                </p>
                <Button className="m-auto" variant="secondary" disabled={false}>
                  Visit Profile
                  <FontAwesomeIcon icon={faArrowRight} className={`text-xl`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="relative w-full lg:h-12 h-auto mt-12">
            <StyledPageTitle textString="Trending And Recently Posted" />
          </div>
          <ExploringBlogPosts />
        </div>
      )}
    </div>
  );
}
