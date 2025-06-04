'use client';

import RestaurantProfile from '@/components/restaurantProfile/RestaurantProfile';
import { getBusinessUserRestaurantId, getBusinessUserVerificationStatus } from '@/lib/db/dbOperations';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

export default function BusinessUserRestaurantPage() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [isVerified, setIsVerified] = useState(null);
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

        // find and validate profile
        const profile = await getBusinessUserRestaurantId({ supabaseId: user.id });
        const verified = await getBusinessUserVerificationStatus({ supabaseId: user.id });
        setIsVerified(verified);

        // If restaurantId is not found (i.e., null), it means the business user has not set up their account.
        // We will redirect them back to the account setup page.
        if (profile?.restaurantId) {
          setRestaurantId(profile.restaurantId);
        } else {
          router.push('/account-setup/business');
        }
      } catch (err) {
        console.error('Failed to fetch restaurant ID:', err);
        // router.push('/account-setup/business'); // Still redirect if server fails
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <RestaurantProfile isOwner={true} isVerified={isVerified} restaurantId={restaurantId} />;
}
