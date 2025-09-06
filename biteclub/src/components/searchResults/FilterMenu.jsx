import { Slider, CustomCheckboxes, OpenNowSwitch } from './FilterOptions';
import { Button } from '../shared/Button';
import { useState, useEffect } from 'react';

export default function FilterMenu({
  selectedPrice,
  ratingRange,
  distanceRange,
  selectedItems,
  isOpenNow,
  setSelectedPrice,
  setRatingRange,
  setDistanceRange,
  setSelectedItems,
  setIsOpenNow,
  onApply,
  onClose, // close the menu after applying
  forRestaurantList = false,
}) {
  // cuisines of the week, dynamic array, changes weekly
  const [cuisinesOfTheWeekArr, setCuisinesOfTheWeekArr] = useState([]);
  const dietaryPreferencesArr = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free'];

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

  // Clear All values
  const handleClearAll = () => {
    setSelectedPrice(null);
    setRatingRange(4);
    setDistanceRange(6);
    setSelectedItems([]);
    setIsOpenNow(false);

    // ignore filters when re-fetching (search)
    onApply({ clearFilters: true });

    if (onClose) onClose();
  };

  return (
    <div
      className={`bg-brand-yellow-extralite md:w-md w-full h-fit absolute right-0 md:mt-2 ${
        forRestaurantList ? 'mt-14' : 'mt-12'
      } rounded-md px-4 pb-4 pt-6 shadow-md z-200`}
    >
      <h3 className="uppercase mb-4">Filters</h3>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={e => {
          e.preventDefault(); // prevent page reload
          onApply(); // call fetch
          if (onClose) onClose(); // close filter menu
        }}
      >
        {/* Price */}
        <div>
          <h4>Price</h4>
          <div className="flex flex-wrap gap-2 w-full md:justify-center justify-start">
            {Array.from({ length: 5 }).map((_, i) => {
              const price = i + 1;
              const isSelected = selectedPrice === price;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    setSelectedPrice(price);
                    console.log('SELECTED PRICE: ', price);
                  }}
                  className={`priceTab ${isSelected ? 'bg-brand-yellow' : 'bg-brand-yellow-lite'} md:text-base text-sm`}
                >
                  {'$'.repeat(i + 1)}
                </button>
              );
            })}
          </div>
        </div>
        {/* Rating Slider */}
        <div>
          <h4>Rating</h4>
          <Slider value={ratingRange} setValue={setRatingRange} reverseDirection={true} />
        </div>
        {/* Cuisines of the Week */}
        <CustomCheckboxes
          title="Featured Cuisines of the Week"
          itemLabels={cuisinesOfTheWeekArr}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
        {/* Dietary Preferences */}
        <CustomCheckboxes
          title="Dietary Preferences"
          itemLabels={dietaryPreferencesArr}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
        {/* Distance Slider */}
        <div>
          <h4>Distance</h4>
          <Slider value={distanceRange} setValue={setDistanceRange} />
        </div>
        {/* Open Now Switch */}
        <div className="flex items-center gap-x-4">
          <h4>Open Now</h4>
          <OpenNowSwitch isOpenNow={isOpenNow} setIsOpenNow={setIsOpenNow} />
        </div>
        <div className="flex justify-between items-end mt-8">
          {/* Clear All */}
          <button type="button" className="cursor-pointer text-brand-navy underline" onClick={handleClearAll}>
            <h5>Clear All</h5>
          </button>
          {/* Submit Button */}
          <Button type="submit" className="w-30" variant={'default'}>
            Apply
          </Button>
        </div>
      </form>
    </div>
  );
}
