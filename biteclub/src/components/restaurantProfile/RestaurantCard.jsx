'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter instead of next/Link, so we can manually handle the redirection on Clicking the Card (vs Saving the Restaurant as Favourite)

import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as strokedHeart } from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';
import StarRating from '../shared/StarRating';

export default function RestaurantCard({ restaurantData, onFavouriteToggle = () => {} }) {
  const router = useRouter();
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info
  const { userData, refreshUserData } = useUserData();
  const restaurantId = restaurantData._id;
  const isFavourited = userData?.favouriteRestaurants?.includes(restaurantId);

  const [isHovered, setIsHovered] = useState(false); // tracks when user hovers over heart icon
  // const image = Array.isArray(restaurantData?.images) ? restaurantData.images[0] : null;

  const handleFavouriteRestaurantClick = async e => {
    e.stopPropagation();

    try {
      // const { data, error } = await supabase.auth.getUser();
      // if (error || !data?.user?.id) throw new Error('User not logged in');
      if (!user?.id) return;
      const res = await fetch('/api/restaurants/save-as-favourite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          // supabaseUserId: data.user.id,
          supabaseUserId: user.id,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to toggle favourite');

      refreshUserData();
      onFavouriteToggle(result.isFavourited, restaurantId);
    } catch (err) {
      console.error('Error toggling favourite:', err.message);
    }
  };

  return (
    <div className="w-full" onClick={() => router.push(`/restaurants/${restaurantId}`)}>
      <div className="w-full lg:max-h-88 max-h-84  aspect-square border border-brand-yellow-lite flex flex-col items-center rounded-md cursor-pointer text-black hover:bg-brand-peach-lite">
        <div className="relative w-full aspect-3/2 max-h-60 border-b-1 border-brand-yellow-lite">
          {restaurantData?.bannerImages[0]?.url && (
            <Image
              src={restaurantData?.bannerImages[0]?.url}
              alt={restaurantData?.bannerImages[0]?.caption || 'Restaurant image'}
              fill={true}
              className="object-cover w-full rounded-t-md"
            />
          )}
        </div>
        <div className="py-2 px-3 text-left w-full">
          <div className="flex justify-between">
            <div className="h-8 overflow-hidden mr-1 mb-1 w-full">
              {/* limits length of restaurant name that can be displayed */}
              <h3>{restaurantData.name.length > 30 ? restaurantData.name.slice(0, 30) + '…' : restaurantData.name}</h3>
            </div>
            {/* changes heart icon's style if owner favourites restaurant*/}
            <div
              onClick={handleFavouriteRestaurantClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <FontAwesomeIcon
                icon={isHovered || isFavourited ? solidHeart : strokedHeart}
                className={`icon-xl hover:text-brand-aqua ${isFavourited ? 'text-brand-aqua' : 'text-brand-navy'}`}
              />
            </div>
          </div>
          {/* shows only the first cuisine */}
          <h5>
            {restaurantData.cuisines && restaurantData.cuisines.length > 0
              ? restaurantData.cuisines[0]
              : 'Cuisine Unavailable'}
          </h5>
          <div className="flex flex-wrap items-center gap-1">
            <p className="font-medium">{restaurantData.rating}</p>
            <StarRating colour={'text-brand-green'} iconSize={'icon-sm'} ratingNum={restaurantData.rating} />
            <p>{restaurantData.numReviews}</p>

            {/* price range tag */}
            <div className="bg-brand-blue-lite px-2 rounded-full w-15 flex justify-center font-primary text-sm">
              {restaurantData.priceRange || '$'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
