'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/client';
import GeneralUserProfile from '@/components/generalProfile/GeneralUserProfile';
import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';

export default function GeneralUserDashboard() {
  const [loading, setLoading] = useState(true);
  const [userMongoId, setUserMongoId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.getUser();

        if (authError || !data.user) {
          throw new Error('User not authenticated');
        }

        const user = data.user;
        const id = await getGeneralUserMongoIDbySupabaseId({ supabaseId: user.id });
        console.log(`MONGOID: `, id);

        if (!id) {
          throw new Error('MongoDB ID not found');
        }

        setUserMongoId(id);
      } catch (err) {
        setError(`(General Dashboard) Failed to fetch UserId: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return <GeneralUserProfile isOwner={true} generalUserId={userMongoId} />;
}

// import { redirect } from 'next/navigation';

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { LogoutButton } from '@/components/auth/Logout-button';
// import { createClient } from '@/lib/auth/client';

// export default function ProtectedPage() {
//   const router = useRouter();
//   const supabase = createClient();

//   const [user, setUser] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data, error } = await supabase.auth.getUser();

//       if (error || !data?.user) {
//         router.push('/login');
//         return;
//       }

//       setUser(data.user);

//       const res = await fetch('/api/get-general-user-profile-by-supabaseId', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ supabaseId: data.user.id }),
//       });

//       const { profile } = await res.json();
//       setUserProfile(profile);
//     };

//     fetchData();
//   }, [router, supabase]);

//   if (!user || !userProfile) {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   return (
//     <div className="flex flex-col h-svh w-full items-center justify-center gap-3">
//       <h1 className="text-3xl font-bold">General User Dashboard</h1>
//       <p>
//         Welcome back, <span>{userProfile.username}!</span>
//       </p>
//       <LogoutButton />
//     </div>
//   );
// }
