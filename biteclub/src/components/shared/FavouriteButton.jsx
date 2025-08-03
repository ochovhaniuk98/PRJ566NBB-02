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
  const btnStyling = forRestaurant
    ? 'flex items-center cursor-pointer font-primary font-medium text-brand-navy bg-brand-yellow-lite py-2 px-3 rounded-full mb-2 text-sm'
    : 'flex items-center w-10 cursor-pointer font-primary font-medium text-brand-grey';

  return (
    <button className={btnStyling} onClick={handleFavouriteToggle}>
      <FontAwesomeIcon
        icon={isFavourited ? faHeartSolid : faHeartRegular}
        className={`icon-lg mr-1 ${isFavourited ? 'text-brand-red' : 'text-brand-navy'}`}
      />
      {numOfFavourites ?? 0}
    </button>
  );
}
