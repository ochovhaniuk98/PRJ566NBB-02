'use client';
import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Button } from '@/components/shared/Button';
import SearchResultsTabBar from '@/components/searchResults/SearchResultsTabBar';
import GridCustomCols from '@/components/shared/GridCustomCols';
import BlogPostCard from '@/components/shared/BlogPostCard';
import GeneralUserCard from '@/components/generalProfile/GeneralUserCard';
import RestaurantCard from '@/components/restaurantProfile/RestaurantCard';
import SearchResultsNumMessage from '@/components/searchResults/SearchResultsNumMessage';
import FilterMenu from './FilterMenu';

const dietaryPreferencesArr = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free'];

// shows search results of restaurants, blog posts, and users
export default function SearchResults({ searchType = 0, searchQuery = '' }) {
  const [selectedTab, setSelectedTab] = useState(searchType); // for selecting search results type (default is restaurants)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsCount, setRestaurantsCount] = useState(0);

  const [blogPosts, setBlogPosts] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);

  // for filter menu
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(2);
  const [ratingRange, setRatingRange] = useState(4);
  const [distanceRange, setDistanceRange] = useState(6);
  const [selectedItems, setSelectedItems] = useState([]); //for checkboxes
  const [isOpenNow, setIsOpenNow] = useState(false);
  // cuisines of the week
  const [cuisinesOfTheWeekArr, setCuisinesOfTheWeekArr] = useState([]);
  // geolocation
  const [userLocation, setUserLocation] = useState(null);

  // get cuisines of the week
  useEffect(() => {
    async function fetchCuisines() {
      try {
        const res = await fetch('/api/restaurants/cuisines/cuisinesOfTheWeek');
        const data = await res.json();
        setCuisinesOfTheWeekArr(data.cuisines);
      } catch (err) {
        console.error('Failed to load cuisines of the week:', err);
      }
    }

    fetchCuisines();
  }, []);

  // Fetch restaurant data based on the search query
  const fetchRestaurants = async (reset = false, clearFilters = true) => {
    setFetchCompleted(false);

    // search query
    const params = new URLSearchParams({
      q: searchQuery,
      page,
      limit: 20,
    });

    // filtering
    if (!clearFilters) {
      // price
      if (selectedPrice != null) {
        const priceMap = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$', 5: '$$$$$' };
        console.log(`Price chosen: ${priceMap[selectedPrice]}`);
        params.append('price', priceMap[selectedPrice]);
      }
      // rating (3 is default)
      if (ratingRange && ratingRange != 3) {
        console.log(`Rating range value chosen: ${ratingRange}`);
        params.append('rating', ratingRange);
      }
      // cuisines
      const cuisines = selectedItems.filter(i => cuisinesOfTheWeekArr.includes(i));
      if (cuisines.length > 0) {
        params.append('cuisines', cuisines.join(','));
        console.log(`Cuisines chosen: ${cuisines.join(',')}`);
      }
      // dietary
      const dietary = selectedItems.filter(i => dietaryPreferencesArr.includes(i));
      if (dietary.length > 0) {
        params.append('dietary', dietary.join(','));
        console.log(`Dietary Options chosen: ${dietary.join(',')}`);
      }
      // open now
      if (isOpenNow) {
        params.append('isOpenNow', 'true');
        console.log(`Open now option chosen`);
      }
      // distance (10 is default)
      if (distanceRange && distanceRange != 10) {
        if (!userLocation?.latitude || !userLocation?.longitude) {
          console.warn('Distance selected but user location is unavailable');
        } else {
          console.log(`Distance range chosen: ${distanceRange}`);
          params.append('distance', distanceRange);
          // pass user location coordinates as well
          params.append('lat', userLocation.latitude);
          params.append('lng', userLocation.longitude);
        }
      }
    }

    try {
      // const res = await fetch(`/api/restaurants/search?q=${searchQuery}&page=${page}&limit=20`);
      const res = await fetch(`/api/restaurants/search?${params.toString()}`);
      const data = await res.json();

      if (reset) {
        setPage(1);
        setRestaurants(data.restaurants);
        setRestaurantsCount(data.totalCount);
      } else {
        setRestaurants(prev => {
          const ids = new Set(prev.map(r => r._id));
          const newOnes = data.restaurants.filter(r => !ids.has(r._id));
          return [...prev, ...newOnes];
        });
      }

      // if we've fetched everything, stop loading more
      console.log(`data?.restaurants?.length: ${data?.restaurants?.length}`);
      if ((reset ? data?.restaurants?.length : restaurants?.length + data?.restaurants?.length) >= data?.totalCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setFetchCompleted(true);
    } catch (error) {
      setFetchCompleted(true);
      console.error('Failed to fetch restaurants:', error);
    }
  };

  // Fetch blog posts data based on the search query
  const fetchBlogPosts = async (reset = false) => {
    setFetchCompleted(false);
    if (reset) {
      setPage(1);
    }

    try {
      const res = await fetch(`/api/blog-posts/search?q=${searchQuery}&page=${page}&limit=20`);
      const data = await res.json();

      if (reset) {
        setBlogPosts(data.posts);
        setPostsCount(data.totalCount);
      } else {
        // append data to existing list
        setBlogPosts(prev => [...prev, ...data.posts]);
      }

      // if we've fetched everything, stop loading more
      if ((reset ? data.posts.length : blogPosts.length + data.posts.length) >= data.totalCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setFetchCompleted(true);
    } catch (error) {
      setFetchCompleted(true);
      console.error('Failed to fetch posts:', error);
    }
  };

  // Fetch user data based on the search query
  const fetchUsers = async (reset = false) => {
    setFetchCompleted(false);
    console.log('Page: ', page);
    if (reset) {
      setPage(1);
    }

    try {
      const res = await fetch(`/api/users/search?q=${searchQuery}&page=${page}&limit=20`);
      const data = await res.json();

      if (reset) {
        setUsers(data.users);
        setUsersCount(data.totalCount);
      } else {
        // append data to existing list
        setUsers(prev => [...prev, ...data.users]);
      }

      // if we've fetched everything, stop loading more
      if ((reset ? data.users.length : users.length + data.users.length) >= data.totalCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setFetchCompleted(true);
    } catch (error) {
      setFetchCompleted(true);
      console.error('Failed to fetch users:', error);
    }
  };

  // reset page = 1
  useEffect(() => {
    setFetchCompleted(false);
    if (selectedTab === 0 && searchQuery) {
      setPage(1);
      fetchRestaurants(true); // reset = true
      console.log('Search query got changed');
      setShowFilterMenu(false);
      setSelectedPrice(2);
      setRatingRange(4);
      setDistanceRange(6);
      setSelectedItems([]);
      setIsOpenNow(false);
    } else if (selectedTab === 1 && searchQuery) {
      setPage(1);
      fetchBlogPosts(true); // reset = true
    } else if (selectedTab === 2 && searchQuery) {
      setPage(1);
      fetchUsers(true); // reset = true
    }
  }, [searchQuery, selectedTab]);

  // when page > 1
  useEffect(() => {
    if (selectedTab === 0 && page > 1) {
      fetchRestaurants();
    } else if (selectedTab === 1 && page > 1) {
      fetchBlogPosts();
    } else if (selectedTab === 2 && page > 1) {
      fetchUsers();
    }
  }, [page]);

  useEffect(() => {
    setFetchCompleted(false);
    setSelectedTab(searchType);
  }, [searchType]);

  // get user's geolocation
  useEffect(() => {
    const requestGeolocation = async () => {
      if (!navigator.geolocation || !navigator.permissions) return;

      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });

        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition(position => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(coords);
            console.log('Location granted:', coords);
          });
        } else if (result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            position => {
              const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              setUserLocation(coords);
              console.log('User allowed location access:', coords);
            },
            error => {
              console.warn('User denied or error in location:', error.message);
            }
          );
        } else if (result.state === 'denied') {
          console.log('Location permission denied previously.');
        }
      } catch (error) {
        console.error('Error checking geolocation permissions:', error);
      }
    };

    requestGeolocation();
  }, []);

  // for blog posts' Masonry grid
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };
  return (
    <MainBaseContainer className={'bg-brand-yellow'}>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center pt-18">
        <div className={'w-full h-full'}>
          <div className="flex justify-between mb-4 ">
            {/* tabs for selecting search type: restaurants, blog posts or users */}
            <SearchResultsTabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            {selectedTab === 0 && (
              <div className="relative">
                <Button
                  type="submit"
                  className="w-30"
                  variant="default"
                  onClick={() => setShowFilterMenu(prev => !prev)}
                >
                  Filter
                </Button>

                {showFilterMenu && (
                  <FilterMenu
                    selectedPrice={selectedPrice}
                    ratingRange={ratingRange}
                    distanceRange={distanceRange}
                    selectedItems={selectedItems}
                    isOpenNow={isOpenNow}
                    setSelectedPrice={setSelectedPrice}
                    setRatingRange={setRatingRange}
                    setDistanceRange={setDistanceRange}
                    setSelectedItems={setSelectedItems}
                    setIsOpenNow={setIsOpenNow}
                    onApply={({ clearFilters = false } = {}) => {
                      setPage(1);

                      // reset filters in state if needed
                      if (clearFilters) {
                        setSelectedPrice(null);
                        setRatingRange(3);
                        setDistanceRange(10);
                        setSelectedItems([]);
                        setIsOpenNow(false);
                      }
                      fetchRestaurants(true, clearFilters);
                    }}
                    onClose={() => setShowFilterMenu(false)}
                  />
                )}
              </div>
            )}
          </div>
          {/* Restaurant Results */}
          {selectedTab === 0 && fetchCompleted && (
            <>
              {/* shows message depending on search results */}
              <SearchResultsNumMessage
                searchTypeNum={selectedTab}
                numResults={restaurantsCount}
                searchString={searchQuery}
              />
              <GridCustomCols numOfCols={5} className="mt-4">
                {/* isFavourited is false by default */}
                {restaurants.map((restaurant, i) => (
                  //  isFavourited={false}
                  <RestaurantCard key={restaurant._id || i} restaurantData={restaurant} />
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
          {selectedTab === 1 && fetchCompleted && (
            <>
              <SearchResultsNumMessage searchTypeNum={selectedTab} numResults={postsCount} searchString={searchQuery} />
              <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2 mt-4" columnClassName="space-y-2">
                {blogPosts.map((post, i) => (
                  <BlogPostCard key={post._id || i} blogPostData={post} />
                ))}
              </Masonry>
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => setPage(prev => prev + 1)}>Load More</Button>
                </div>
              )}
            </>
          )}
          {/* User Results */}
          {selectedTab === 2 && (
            <>
              <SearchResultsNumMessage searchTypeNum={selectedTab} numResults={usersCount} searchString={searchQuery} />
              <GridCustomCols numOfCols={5} className="mt-4">
                {users.map((user, i) => (
                  <GeneralUserCard key={user._id || i} generalUserData={user} isFollowing={false} />
                ))}
              </GridCustomCols>
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => setPage(prev => prev + 1)}>Load More</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainBaseContainer>
  );
}
