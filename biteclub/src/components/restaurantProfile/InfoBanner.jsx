//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faHeart, faUtensils, faPen } from '@fortawesome/free-solid-svg-icons';
import RestaurantIconDetail from '@/components/restaurantProfile/RestaurantIconDetail';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';
import StarRating from '../shared/StarRating';

export default function InfoBanner({ name, avgRating, numReviews, cuisine, address, numFavourites }) {
  return (
    // bg-brand-yellow-extralite
    <div className="bg-brand-white flex justify-between main-side-margins pt-8">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="flex items-center gap-x-2">
          <h2 className="font-semibold">{avgRating}</h2>
          <StarRating colour={'text-brand-green'} iconSize={'icon-xl'} ratingNum={1.3} />
          <div className="font-normal text-xl font-primary">
            {`${numReviews} `}
            <span className="font-normal text-xl font-primary">reviews</span>
          </div>
        </div>
        <RestaurantIconDetail icon={faLocationDot} detailText={address} />
        <RestaurantIconDetail icon={faLocationDot} detailText={cuisine} />
      </div>
      <div>
        <SingleTabWithIcon icon={faHeart} detailText={numFavourites} />
        <SingleTabWithIcon icon={faPen} detailText="Write a Review" />
        <SingleTabWithIcon icon={faUtensils} detailText="Reserve Table" />
      </div>
    </div>
  );
}
