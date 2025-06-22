import { Slider, CustomCheckboxes, OpenNowSwitch } from './FilterOptions';
import { Button } from '../shared/Button';

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
}) {
  // dynamic array, changes weekly
  const cuisinesOfTheWeekArr = [
    'Burmese',
    'Laotian',
    'Somali',
    'Uyghur',
    'Georgian',
    'Tibetan',
    'Malagasy',
    'Armenian',
    'Sri Lankan',
    'Ethiopian',
    'Nepalese',
    'Guyanese',
  ];
  const dietaryPreferencesArr = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free'];

  // Clear All values
  const handleClearAll = () => {
    setSelectedPrice(null);
    setRatingRange(4);
    setDistanceRange(6);
    setSelectedItems([]);
    setIsOpenNow(false);
  };

  return (
    <div className=" bg-brand-yellow-extralite w-md h-fit absolute right-0 mt-2 rounded-md px-4 pb-4 pt-6 shadow-md z-10">
      <h3 className="uppercase mb-4">Filters</h3>
      <form className="flex flex-col gap-y-4">
        {/* Price */}
        <div>
          <h4>Price</h4>
          <div className="flex gap-x-2 w-full justify-center">
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
                  className={`priceTab ${isSelected ? 'bg-brand-yellow' : 'bg-brand-yellow-lite'}`}
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
