'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';
import GeneralUserProfile from '@/components/generalProfile/GeneralUserProfile';
import Spinner from '@/components/shared/Spinner';

export default function GeneralPage() {
  const { user } = useUser(); // Current logged-in user's Supabase info
  // Notes for useParams():
  // - useParams() returns values as strings, but when used in a dynamic segment like /general/[generalUserId], it will be:
  // - const params = useParams(); // returns an object like: { generalUserId: '683dd306de808a3cb965680f' }
  // - So, const { generalUserId } = useParams(); is correct, as long as route is set like /general/[generalUserId]/page.jsx.
  const { generalUserId } = useParams(); //  SHOULD BE USER'S MONGODB ID (NOT SUPABASE) e.g. /generals/683dae479e032cae84e39a65
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      try {
        if (!user?.id) return; // Wait until user is available
        const userMongoId = await getGeneralUserMongoIDbySupabaseId({ supabaseId: user.id });

        if (userMongoId && userMongoId === generalUserId) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error('Failed to fetch Mongo ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [generalUserId]);

  if (loading) return <Spinner message='Loading Profile...' />;

  if (!generalUserId) return <p>Invalid user profile link.</p>;

  return <GeneralUserProfile isOwner={isOwner} generalUserId={generalUserId} />;
}
