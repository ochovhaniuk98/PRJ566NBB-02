import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

// FavouriteButton appears specifically on BlogPost.jsx and RestaurantProfile.jsx
export default function FavouriteButton({
  handleFavouriteToggle,
  numOfFavourites,
  isFavourited,
  forRestaurant = false,
}) {
  const [hover, setHover] = useState(false);

  const btnStyling = forRestaurant
    ? 'flex items-center cursor-pointer font-primary font-medium text-brand-navy bg-white py-2 px-3 rounded-full mb-2 text-sm'
    : 'flex items-center w-10 cursor-pointer font-primary font-medium text-brand-grey';

  // show solid while favourited OR when hovered
  const showSolid = isFavourited || hover;

  return (
    <button
      type="button"
      className={btnStyling}
      onClick={handleFavouriteToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={!!isFavourited}
    >
      <FontAwesomeIcon
        icon={showSolid ? faHeartSolid : faHeartRegular}
        className={`icon-lg mr-1 ${isFavourited || hover ? 'text-brand-aqua' : 'text-brand-navy'}`}
      />
      {numOfFavourites ?? 0}
    </button>
  );
}
