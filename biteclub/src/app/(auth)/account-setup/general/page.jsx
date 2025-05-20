'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import Avatar from './avatar';

export default function GeneralSetupForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: update MongoDB with username and Cloudinary avatar_url
    //  updateProfile({ username, avatar_url });
    router.push('/users/general/questionnaire');
  };

  // =======================================================================+===================

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="form-widget max-w-md w-full p-6 bg-white shadow-md rounded-md space-y-4">
        <div>
          {/* General */}
          <Avatar
            uid={user?.id}
            url={avatar_url}
            size={150}
            onUpload={url => {
              setAvatarUrl(url);
              // TODO: Update Image with Cloudinary logic
              // updateProfile({ username, avatar_url: url });
            }}
          />

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={user?.email || ''}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Set your username
            </label>
            <input
              id="username"
              type="text"
              // value={username}
              // onChange={e => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <button
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Update'}
          </button>
        </div>

        <form action="/signout" method="post">
          <button
            className="w-full text-sm text-red-500 border border-red-300 py-2 rounded-md hover:bg-red-50 transition"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

// ===============================================================================================================================
// VERSION 1

// WE WILL USE mongoDB and Cloudinary TO STORE USERS INFO
// Users should be created on MongoDB after user selected their user type (Business / General) on this page:
// - General: username and profile picture
// - Business: Restaurant name, business license (img/pdf)

// 'use client';

// import { useCallback, useEffect, useState } from 'react';
// import { createClient } from '@/lib/auth/client';
// import { useRouter } from 'next/navigation';
// import Avatar from './avatar';

// export default async function GeneralSetupForm() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   // STORE TO mongoDB
//   const [username, setUsername] = useState('');
//   const [avatar_url, setAvatarUrl] = useState('');

//     const supabase = await createClient()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   // =======================================================================+===================

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="form-widget max-w-md w-full p-6 bg-white shadow-md rounded-md space-y-4">
//         <div>
//           {/* General */}
//           <Avatar
//             uid={user?.id}
//             url={avatar_url}
//             size={150}
//             onUpload={url => {
//               setAvatarUrl(url);
//               // TODO: Update Image with Cloudinary logic
//               // updateProfile({ username, avatar_url: url });
//             }}
//           />

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               id="email"
//               type="text"
//               value={user?.email}
//               disabled
//               className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//               Set your username
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username || ''}
//               onChange={e => setUsername(e.target.value)}
//               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
//             />
//           </div>
//         </div>

//         <div>
//           <button
//             className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
//             onClick={() => {
//               // TODO: Replace "updateProfile" with your mongoDB function/logic here to Create / Update user portfolio
//               updateProfile({ username, avatar_url });

//               // redirect user to further onboarding page (i.e. questionnaire) base on User role.
//               router.push('/users/general/questionnaire');
//             }}
//             disabled={loading}
//           >
//             {loading ? 'Loading ...' : 'Update'}
//           </button>
//         </div>

//         <div>
//           <form action="/signout" method="post">
//             <button
//               className="w-full text-sm text-red-500 border border-red-300 py-2 rounded-md hover:bg-red-50 transition"
//               type="submit"
//             >
//               Sign out
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// ===============================================================================================================================
// VERSION 2

// 'use client';

// import { useEffect, useState } from 'react';
// import { createClient } from '@/lib/auth/client';
// import { useRouter } from 'next/navigation';
// import Avatar from './avatar';

// export default function GeneralSetupForm() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [username, setUsername] = useState('');
//   const [avatar_url, setAvatarUrl] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const supabase = createClient();
//       const { data, error } = await supabase.auth.getUser();
//       if (!error) setUser(data.user);
//     };
//     fetchUser();
//   }, []);

//   const handleSubmit = async () => {
//     setLoading(true);
//     // TODO: update MongoDB with username and Cloudinary avatar_url
//     router.push('/users/general/questionnaire');
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="form-widget max-w-md w-full p-6 bg-white shadow-md rounded-md space-y-4">
//         <Avatar
//           uid={user.id}
//           url={avatar_url}
//           size={150}
//           onUpload={url => setAvatarUrl(url)}
//         />

//         <div>
//           <label>Email</label>
//           <input value={user.email} disabled className="input-disabled" />
//         </div>

//         <div>
//           <label>Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={e => setUsername(e.target.value)}
//             className="input"
//           />
//         </div>

//         <button onClick={handleSubmit} disabled={loading} className="btn">
//           {loading ? 'Submitting...' : 'Update'}
//         </button>

//         <form action="/signout" method="post">
//           <button type="submit" className="text-red-500 w-full mt-2">
//             Sign out
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
