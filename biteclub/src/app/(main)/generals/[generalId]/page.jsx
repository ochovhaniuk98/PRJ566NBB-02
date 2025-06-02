'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/auth/client';
import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';
import GeneralUserProfile from '@/components/generalProfile/GeneralUserProfile';

export default function GeneralPage() {

  // Notes for useParams(): 
  // - useParams() returns values as strings, but when used in a dynamic segment like /general/[generalUserId], it will be:
  // - const params = useParams(); // returns an object like: { generalUserId: '683dd306de808a3cb965680f' }
  // - So, const { generalUserId } = useParams(); is correct, as long as route is set like /general/[generalUserId]/page.jsx.

  const { generalId } = useParams(); //  SHOULD BE USER'S MONGODB ID (NOT SUPABASE) e.g. /generals/683dae479e032cae84e39a65
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!generalId) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setLoading(false);
        return;
      }

      const user = data.user;
      const userMongoId = await getGeneralUserMongoIDbySupabaseId({ supabaseId: user.id });

      if (userMongoId && userMongoId === generalId) {
        setIsOwner(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [generalId]);

  if (loading) return <p>Loading...</p>;
  if (!generalId) return <p>Invalid user profile link.</p>;

  return <GeneralUserProfile isOwner={isOwner} generalUserId={generalId} />;
}

// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { createClient } from '@/lib/auth/client';
// import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';
// import GeneralUserProfile from '@/components/generalProfile/GeneralUserProfile';


// export default function GeneralPage() {
//   // Notes for useParams(): 
//   // - useParams() returns values as strings, but when used in a dynamic segment like /general/[generalUserId], it will be:
//   // - const params = useParams(); // returns an object like: { generalUserId: '683dd306de808a3cb965680f' }
//   // - So, const { generalUserId } = useParams(); is correct, as long as route is set like /general/[generalUserId]/page.jsx.

//   const { generalUserId } = useParams(); // SHOULD BE USER'S MONGODB ID (NOT SUPABASE)
//   const [isOwner, setIsOwner] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // When user search and click on the link, we need to verify if the current user is the profile owner of that useParams
//   useEffect(() => {
//     const fetchData = async () => {
//       const supabase = createClient();
//       const { data, error } = await supabase.auth.getUser();

//       if (error || !data.user) {
//         setLoading(false);
//         return;
//       }

//       const user = data.user;
//       const userMongoId = await getGeneralUserMongoIDbySupabaseId({ supabaseId: user.id });

//       // compare user's mongoId with useParams, if they are the same, they are the Profile Owner
//       if (userMongoId && userMongoId == generalUserId) {
//         setIsOwner(true);
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, [generalUserId]);

//   if (loading) return <p>Loading...</p>;
//   // if (!generalUserId) return <p>No user found for this user.</p>;

//   return <GeneralUserProfile isOwner={isOwner} generalUserId={generalUserId} />;
// }