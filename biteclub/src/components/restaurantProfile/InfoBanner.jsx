//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faUtensils } from '@fortawesome/free-solid-svg-icons';
import RestaurantIconDetail from '@/components/restaurantProfile/RestaurantIconDetail';
import StarRating from '../shared/StarRating';

export default function InfoBanner({ name, avgRating, numReviews, priceRange, cuisine, address, children }) {
  return (
    <div className="bg-brand-white flex justify-between main-side-padding pt-8 w-full">
      <div className="flex flex-col gap-y-1">
        <span className="text-3xl font-bold font-primary mb-1">{name}</span>
        <div className="flex items-center gap-x-2">
          <h2 className="font-semibold">{avgRating}</h2>
          <StarRating colour={'text-brand-green'} iconSize={'icon-xl'} ratingNum={avgRating} />
          <div className="font-normal text-xl font-primary">
            {`${numReviews} `}
            <span className="font-normal text-xl font-primary">reviews</span>
          </div>
          {/* price range tag */}
          <div className="bg-brand-blue-lite px-2 rounded-full w-15 h-fit flex justify-center text-primary">
            {priceRange}
          </div>
        </div>

        <RestaurantIconDetail icon={faLocationDot} detailText={address} />
        <RestaurantIconDetail icon={faUtensils} detailText={cuisine.join(', ')} />
      </div>
      <div>{children}</div>
    </div>
  );
}
