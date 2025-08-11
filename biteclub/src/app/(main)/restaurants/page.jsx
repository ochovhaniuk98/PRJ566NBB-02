'use client';
import RestaurantCard from '@/components/restaurantProfile/RestaurantCard';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Button } from '@/components/shared/Button';
import FilterMenu from '@/components/searchResults/FilterMenu';
import { useState, useEffect, useRef } from 'react';

const dietaryPreferencesArr = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free'];

export default function RestaurantResults() {
  const [restaurants, setRestaurants] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  // Filter states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [ratingRange, setRatingRange] = useState(3);
  const [distanceRange, setDistanceRange] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [cuisinesOfTheWeekArr, setCuisinesOfTheWeekArr] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const scrollPositionRef = useRef(0);

  // Fetch cuisines of the week
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

  // Get user's geolocation
  useEffect(() => {
    const requestGeolocation = async () => {
      if (!navigator.geolocation || !navigator.permissions) return;
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'granted' || result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            position => {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            error => {
              console.warn('User denied or error in location:', error.message);
            }
          );
        }
      } catch (error) {
        console.error('Error checking geolocation permissions:', error);
      }
    };
    requestGeolocation();
  }, []);

  // fetch restaurants with filters
  const fetchRestaurants = async (reset = false, clearFilters = true) => {
    setFetchCompleted(false);

    // Get search value from DOM
    let searchValue = '';
    const input = document.getElementById('search-bar-input');
    if (input) searchValue = input.value.trim();
    input.value = ''; // Reset search input after capturing value

    const params = new URLSearchParams({
      q: searchValue,
      page: reset ? 1 : page,
      limit: 20,
    });

    // Filtering, only if clearFilters is false
    if (!clearFilters) {
      if (selectedPrice != null) {
        const priceMap = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$', 5: '$$$$$' };
        params.append('price', priceMap[selectedPrice]);
      }
      if (ratingRange && ratingRange !== 3) {
        params.append('rating', ratingRange);
      }
      const cuisines = selectedItems.filter(i => cuisinesOfTheWeekArr.includes(i));
      if (cuisines.length > 0) {
        params.append('cuisines', cuisines.join(','));
      }
      const dietary = selectedItems.filter(i => dietaryPreferencesArr.includes(i));
      if (dietary.length > 0) {
        params.append('dietary', dietary.join(','));
      }
      if (isOpenNow) {
        params.append('isOpenNow', 'true');
      }
      if (distanceRange && distanceRange !== 10 && userLocation?.latitude && userLocation?.longitude) {
        params.append('distance', distanceRange);
        params.append('lat', userLocation.latitude);
        params.append('lng', userLocation.longitude);
      }
    }

    try {
      const res = await fetch(`/api/restaurants/search?${params.toString()}`);
      const data = await res.json();

      if (reset) {
        setRestaurants(data.restaurants);
        setHasMore(data.restaurants.length < data.totalCount);
      } else {
        // append data to existing list
        setRestaurants(prev => {
          const ids = new Set(prev.map(r => r._id));
          const newOnes = data.restaurants.filter(r => !ids.has(r._id));
          const combined = [...prev, ...newOnes];
          setHasMore(combined.length < data.totalCount);
          return combined;
        });
      }
      setFetchCompleted(true);
    } catch (error) {
      setFetchCompleted(true);
      console.error('(Restaurant results)Failed to fetch restaurants:', error);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchRestaurants(true, true); // fetch all, no filters, on mount
  }, []);

  // Fetch when page or refreshKey changes
  useEffect(() => {
    fetchRestaurants(page === 1, false);
  }, [page, refreshKey]);

  useEffect(() => {
    if (page > 1) {
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
    }
  }, [restaurants]);

  // Handle Enter key for search
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Enter' && window.location.pathname === '/restaurants') {
        setPage(1);
        setRefreshKey(k => k + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadMore = () => {
    // save current vertical scroll position before state update
    scrollPositionRef.current = window.scrollY;
    setPage(prev => prev + 1);
  };

  // When applying filters
  const handleApplyFilters = ({ clearFilters = false } = {}) => {
    if (clearFilters) {
      setSelectedPrice(null);
      setRatingRange(3);
      setDistanceRange(10);
      setSelectedItems([]);
      setIsOpenNow(false);
    }
    setPage(1);
    setRefreshKey(k => k + 1);
    setShowFilterMenu(false);
  };

  return (
    <MainBaseContainer className={'bg-brand-yellow'}>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center pt-18">
        <div className={'w-full h-full'}>
          <div className="flex justify-end mb-4">
            <div className="relative">
              <Button type="button" className="w-30" variant="default" onClick={() => setShowFilterMenu(prev => !prev)}>
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
                  onApply={handleApplyFilters}
                  onClose={() => setShowFilterMenu(false)}
                />
              )}
            </div>
          </div>
          {fetchCompleted && (
            <>
              {/* Restaurant List */}
              <GridCustomCols numOfCols={5} className="mt-4">
                {restaurants.length === 0 && (
                  <p className="col-span-5 text-center text-brand-grey">No restaurants found matching your search.</p>
                )}
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
