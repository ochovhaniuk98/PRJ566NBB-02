'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';

import GeneralUserProfile from '@/components/generalProfile/GeneralUserProfile';
import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';

export default function GeneralUserDashboard() {
  const { user } = useUser(); // Current logged-in user's Supabase info
  const [loading, setLoading] = useState(true);
  const [userMongoId, setUserMongoId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        if (!user?.id) return;
        const id = await getGeneralUserMongoIDbySupabaseId({ supabaseId: user.id });

        console.log(`(userDashboard) MONGOID: `, id);

        if (!id) {
          throw new Error('MongoDB ID not found');
        }

        setUserMongoId(id);
      } catch (err) {
        setError(`Something went wrong. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (loading)
    return (
      <div className="mb-8 p-16">
        <p>Loading Dashboard...</p>
      </div>
    );
  if (error)
    return (
      <div className="mb-8 p-16">
        <p className='text-red-400'>{error}</p>
      </div>
    );

  return <GeneralUserProfile isOwner={true} generalUserId={userMongoId} />;
}
