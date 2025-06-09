'use client';

import RestaurantProfile from '@/components/restaurantProfile/RestaurantProfile';
import { useParams } from 'next/navigation';

export default function RestaurantPage() {
  const { restaurantId } = useParams();

  return <RestaurantProfile restaurantId={restaurantId} isOwner={true} />; // REMINDER TO CESCA! REMVOE TRUE
}
