'use client';

import RestaurantProfile from '@/components/restaurantProfile/RestaurantProfile';
import { getBusinessUserRestaurantId, getBusinessUserVerificationStatus } from '@/lib/db/dbOperations';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

export default function BusinessUserRestaurantPage() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          setLoading(false);
          return;
        }

        const user = data.user;

        // Fetch restaurantId and verification status in parallel
        const [profile, verified] = await Promise.all([
          getBusinessUserRestaurantId({ supabaseId: user.id }),
          getBusinessUserVerificationStatus({ supabaseId: user.id }),
        ]);

        // If restaurantId is not found (i.e., null), it means the business user has not set up their account.
        // We will redirect them back to the account setup page.
        if (profile?.restaurantId && !verified) {
          router.push('/account-setup/business');
        } else if (!verified) {
          router.push('/account-setup/business/awaiting-verification');
        } else {
          setRestaurantId(profile.restaurantId);
        }
      } catch (err) {
        console.error('Failed to fetch restaurant or verification status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading)
    return (
      <div className="mb-8 p-16">
        <p>Loading...</p>
      </div>
    );

  return <RestaurantProfile isOwner={true} restaurantId={restaurantId} />;
}
