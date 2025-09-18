// Note: 'reverseDirection' is for the resturant rating option (NOT distance) since the green progress bar should start from the right-end of the slider
export function Slider({ value, setValue, reverseDirection = false }) {
  const SELECTED_OPTION_STYLING = 'bg-[#80c001] h-[20px] w-[8px] rounded-xl z-10 cursor-pointer translate-y-2';
  const UNSELECTED_OPTION_STYLING = 'bg-[#ffdcbe] h-[20px] w-[8px] rounded-xl z-10 cursor-pointer translate-y-2';
  const THUMB_STYLING =
    'bg-[#80c001] h-[24px] w-[24px] rounded-full z-10 cursor-pointer shadow-md absolute translate-y-1 transition-all duration-200';

  const SLIDER_RANGE = reverseDirection ? [3, 5] : [2, 10]; // range of slider for RATING or DISTANCE
  const NUM_TICKS = 5;
  const step = reverseDirection ? 0.5 : 2; // incremental value between each tick

  const tickValues = Array.from({ length: NUM_TICKS }, (_, i) => SLIDER_RANGE[0] + i * step);
  const index = tickValues.indexOf(value); // current index based on selected tickValue
  const progressPercent = reverseDirection
    ? ((NUM_TICKS - 1 - index) / (NUM_TICKS - 1)) * 100
    : (index / (NUM_TICKS - 1)) * 100;

  return (
    <div className="relative flex flex-row justify-between w-[95%] h-[60px] mx-auto">
      {/* background track */}
      <div className="absolute top-1/2 -translate-y-4 w-full h-[7px] bg-[#ffdcbe] rounded-full" />

      {/* green progress fill */}
      <div
        className={`absolute top-1/2 -translate-y-4 h-[7px] bg-[#80c001] rounded-full transition-all duration-200 ${
          reverseDirection ? 'right-0' : 'left-0'
        }`}
        style={{ width: `${progressPercent}%` }}
      />

      {/* tick buttons */}
      {tickValues.map((tickVal, i) => {
        const isSelected = reverseDirection ? i >= index : i <= index;

        return (
          <div key={i} className="flex flex-col items-center w-[5px]">
            <button
              type="button"
              value={tickVal}
              className={`${
                isSelected ? SELECTED_OPTION_STYLING : UNSELECTED_OPTION_STYLING
              } transition-transform hover:scale-130`}
              onClick={() => {
                setValue(tickVal);
                console.log('SELECTED TICK VALUE: ', tickVal);
              }}
            />
            <span className="mt-3 font-primary">
              {tickVal === SLIDER_RANGE[1] && !reverseDirection ? tickVal + '+' : tickVal}
            </span>
          </div>
        );
      })}

      {/* thumb */}
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
            <div key={i} className="flex gap-x-2 items-center h-8">
              {/*checkbox */}
              <div
                className={`custom-checkbox transition-transform hover:scale-110 cursor-pointer ${
                  isChecked ? 'custom-checked' : ''
                }`}
                onClick={() => {
                  toggleSelection(label);
                  console.log('SELECTED CHECKBOXES: ', selectedItems);
                }}
              >
                {/* show circle checkmark when user clicks checkbox */}
                {isChecked && <div className="custom-checkmark"></div>}
              </div>
              {/* remove characters before and including colon (e.g. Chinese: Cantonese --> Cantonese) */}
              <p className="capitalize"> {label.split(':').pop().trim()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OpenNowSwitch({ isOpenNow, setIsOpenNow }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setIsOpenNow(!isOpenNow)}
        className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out transition-colors cursor-pointer ${
          isOpenNow ? 'bg-[#80c001]' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
            isOpenNow ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </button>
    </div>
  );
}
