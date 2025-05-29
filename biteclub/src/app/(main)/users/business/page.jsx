'use client';

import RestaurantProfile from '@/components/restaurantProfile/RestaurantProfile';
import { getBusinessUserRestaurantId } from '@/lib/db/dbOperations';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/client';

export default function BusinessUserRestaurantPage() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setLoading(false);
        return;
      }

      const user = data.user;
      const profile = await getBusinessUserRestaurantId({ supabaseId: user.id });

      if (profile && profile.restaurantId) {
        setRestaurantId(profile.restaurantId);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!restaurantId) return <p>No restaurant found for this user.</p>;

  return <RestaurantProfile isOwner={true} restaurantId={restaurantId} />;
}
