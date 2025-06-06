import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as strokedHeart } from '@fortawesome/free-regular-svg-icons';
import StarRating from '../shared/StarRating';

export default function RestaurantCard({ restaurantData, isFavourited = false }) {
  const [isHovered, setIsHovered] = useState(false); // tracks when user hovers over heart icon

  return (
    <Link href="/restaurants/682a2ecf70221a179b693583" className="w-full">
      <div className="w-full aspect-square border border-brand-yellow-lite flex flex-col items-center rounded-md cursor-pointer text-black hover:bg-brand-peach-lite">
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
            {/* limits length of restaurant name that can be displayed */}
            <h3>{restaurantData.name.length > 30 ? restaurantData.name.slice(0, 30) + '…' : restaurantData.name}</h3>
            {/* changes heart icon's style if owner favourites restaurant*/}
            <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <FontAwesomeIcon
                icon={isHovered || isFavourited ? solidHeart : strokedHeart}
                className={`icon-lg hover:text-brand-red ${isFavourited ? 'text-brand-red' : 'text-brand-navy'}`}
              />
            </div>
          </div>
          {/* shows only the first 3 cuisines */}
          <h5>{restaurantData.cuisines.slice(0, 3).join(', ')}</h5>
          <div className="flex items-center gap-1">
            <p className="font-medium">{restaurantData.rating}</p>
            <StarRating colour={'text-brand-green'} iconSize={'icon-lg'} ratingNum={restaurantData.rating} />
            <p>{restaurantData.numReviews}</p>
            {/* price range tag */}
            <div className="bg-brand-blue-lite px-2 rounded-full w-15 flex justify-center text-primary">
              {restaurantData.priceRange}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
