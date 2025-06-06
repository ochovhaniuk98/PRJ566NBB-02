import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import StarRating from '../shared/StarRating';

export default function RestaurantCard({ restaurantData }) {
  return (
    <div className="w-full aspect-square border border-brand-yellow-lite flex flex-col items-center rounded-md cursor-pointer hover:bg-brand-peach-lite">
      <div className="relative w-full aspect-3/2">
        <Image
          src={restaurantData.images[0].url}
          alt={restaurantData.images[0].caption}
          fill={true}
          className="object-cover w-full rounded-t-md"
        />
      </div>
      <div className="py-2 px-3 text-left w-full">
        <div className="flex justify-between">
          <h3>{restaurantData.name}</h3>
          <FontAwesomeIcon icon={solidHeart} className={`icon-lg hover:text-brand-red text-brand-navy`} />
        </div>
        <h5>Persian, Middle Eastern</h5>
        <div className="flex items-center gap-1">
          <p>{restaurantData.rating}</p>
          <StarRating colour={'text-brand-green'} iconSize={'icon-lg'} ratingNum={restaurantData.rating} />
          <p>{restaurantData.numReviews}</p>
        </div>
      </div>
    </div>
  );
}
