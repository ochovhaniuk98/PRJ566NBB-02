'use client';

// [BUG HERE]

import { useState, useEffect } from 'react';
// import { createClient } from '@/lib/auth/client';
import { useUser } from '@/context/UserContext';

import GeneralUserProfile from '@/components/generalProfile/GeneralUserProfile';
import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';

export default function GeneralUserDashboard() {
  const [loading, setLoading] = useState(true);
  const [userMongoId, setUserMongoId] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const supabase = createClient();

        // Always use supabase.auth.getUser() to protect pages and user data.
        // Never trust supabase.auth.getSession() inside Server Components. It isn't guaranteed to revalidate the Auth token.
        // It's safe to trust getUser() because it sends a request to the Supabase Auth server every time to revalidate the Auth token.
        // const { data, error: authError } = await supabase.auth.getUser();

        // if (authError || !data.user) {
        //   throw new Error('User not authenticated');
        // }

        // const user = data.user;
        // if (!user?.id) return; // Wait until user is available
        const id = await getGeneralUserMongoIDbySupabaseId({ supabaseId: user.id });
        
        console.log(`(userDashboard) MONGOID: `, id);

        if (!id) {
          throw new Error('MongoDB ID not found');
        }

        setUserMongoId(id);
      } catch (err) {
        setError(`(General Dashboard) Failed to fetch UserId -- ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="mb-8 p-16">
        <p>Loading Dashboard... for user {user?.id}</p>
      </div>
    );
  if (error)
    return (
      <div className="mb-8 p-16">
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );

  return <GeneralUserProfile isOwner={true} generalUserId={userMongoId} />;
}
