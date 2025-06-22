//import { useState } from 'react';
export function Slider({ index, setIndex, forRestaurantRating = false, reverseDirection = false }) {
  const SELECTED_OPTION_STYLING = 'bg-[#80c001] h-[20px] w-[8px] rounded-xl z-10 cursor-pointer translate-y-2';
  const UNSELECTED_OPTION_STYLING = 'bg-[#ffdcbe] h-[20px] w-[8px] rounded-xl z-10 cursor-pointer translate-y-2';
  const THUMB_STYLING =
    'bg-[#80c001] h-[24px] w-[24px] rounded-full z-10 cursor-pointer shadow-md absolute translate-y-1 transition-all duration-200';

  const RATING_RANGE = forRestaurantRating ? [3, 5] : [2, 10]; // range is for restaurant rating OR distance from user
  const NUM_TICKS = 5;
  let tickVal = RATING_RANGE[0]; // leftmost value of slider
  let step = forRestaurantRating ? 0.5 : 2; // incremental value of each tick in slider
  const ticks = [];

  for (let i = 1; i <= NUM_TICKS; i++) {
    const progressIndex = reverseDirection ? NUM_TICKS - i + 1 : i; // if slider is for restaurant rating, starts the green progress bar from the right (from highest value)
    ticks.push(
      <div key={i} className="flex flex-col items-center w-[5px]">
        <button
          type="button"
          key={i}
          value={progressIndex}
          className={progressIndex <= index ? SELECTED_OPTION_STYLING : UNSELECTED_OPTION_STYLING}
          onClick={e => {
            //const idx = Number(e.target.value); // 1 through NUM_STEPS
            setIndex(Number(e.target.value));
            console.log('Selected Index:', e.target.value);
          }}
        />
        <span className="mt-3 font-primary">{tickVal}</span>
      </div>
    );
    tickVal += step;
  }

  const progressPercent = ((index - 1) / (NUM_TICKS - 1)) * 100;

  return (
    <div className="relative flex flex-row justify-between w-[95%] h-[60px]  mx-auto">
      {/* background track */}
      <div className="absolute top-1/2 -translate-y-4 w-full h-[7px] bg-[#ffdcbe] rounded-full" />

      {/* progress fill */}
      <div
        className={`absolute top-1/2 -translate-y-4 h-[7px] bg-[#80c001] rounded-full transition-all duration-200 ${
          reverseDirection ? 'right-0' : 'left-0'
        }`}
        style={{ width: `${progressPercent}%` }}
      />
      {/*ticks + thumb */}
      {ticks}
      <div
        className={THUMB_STYLING}
        style={
          reverseDirection
            ? { right: `calc(${progressPercent}% - 12px)` }
            : { left: `calc(${progressPercent}% - 12px)` }
        }
      />
    </div>
  );
}

export function CustomCheckboxes({ title, itemLabels, selectedItems, setSelectedItems }) {
  const toggleSelection = label => {
    setSelectedItems(prev => (prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]));
  };
  return (
    <div>
      <h4>{title}</h4>
      <div className="grid grid-cols-3 gap-1 mt-2">
        {itemLabels.map((label, i) => {
          const isChecked = selectedItems.includes(label);
          return (
            <div key={i} className="flex gap-x-2 items-center">
              {/* controlled checkbox */}
              <div
                className={`custom-checkbox transition-transform hover:scale-110 cursor-pointer ${
                  isChecked ? 'custom-checked' : ''
                }`}
                onClick={() => toggleSelection(label)}
              >
                {/* show circle checkmark when user clicks checkbox */}
                {isChecked && <div className="custom-checkmark"></div>}
              </div>
              <p>{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
