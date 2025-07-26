'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import GeneralUserProfile from '@/components/generalProfile/GeneralUserProfile';
import Spinner from '@/components/shared/Spinner';

export default function GeneralUserDashboard() {
  const { user } = useUser(); // Current logged-in user's Supabase info
  const { userData, loadingData } = useUserData(); // Current logged-in user's MongoDB data (User / BusinessUser Object)
  const [loading, setLoading] = useState(true);
  const [userMongoId, setUserMongoId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData?._id) return;

        setUserMongoId(userData._id);
      } catch (err) {
        setError(`Something went wrong. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?._id]);

  if (loading) return <Spinner message="Loading Dashboard..." />;

  if (error)
    return (
      <div className="mb-8 p-16">
        <p className="text-red-400">{error}</p>
      </div>
    );

  return <GeneralUserProfile isOwner={true} generalUserId={userMongoId} />;
}
