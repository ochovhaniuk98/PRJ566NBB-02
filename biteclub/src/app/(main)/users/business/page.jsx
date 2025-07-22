'use client';

import RestaurantProfile from '@/components/restaurantProfile/RestaurantProfile';
import { getBusinessUserRestaurantId, getBusinessUserVerificationStatus } from '@/lib/db/dbOperations';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';

import { useRouter } from 'next/navigation';

export default function BusinessUserRestaurantPage() {
  const { user } = useUser(); // Current logged-in user's Supabase info
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {

        if (!user?.id) return;
        
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
  }, [router, user?.id]);

  if (loading)
    return (
      <div className="mb-8 p-16">
        <p>Loading Dashboard...</p>
      </div>
    );

  return <RestaurantProfile isOwner={true} restaurantId={restaurantId} />;
}
