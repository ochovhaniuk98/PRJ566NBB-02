'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@/components/auth/ui/Dropzone';

export default function BusinessSetupForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
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
    // updateProfile({ username, avatar_url });
    setLoading(true);
    // TODO: Store restaurantName and uploaded file to MongoDB / Cloudinary
    router.push('/users/business/business-info');
  };

  // if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="form-widget max-w-md w-full p-6 bg-white shadow-md rounded-md space-y-4">
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
          <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
            Enter Restaurant Name
          </label>
          <input
            id="restaurantName"
            type="text"
            // value={restaurantName}
            // onChange={e => setRestaurantName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700">
            Upload your business license
          </label>
          <Dropzone onDrop={files => console.log(files)} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Update'}
        </button>

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
// 'use client';

// import { useCallback, useEffect, useState } from 'react';
// import { createClient } from '@/lib/auth/client';
// import { useRouter } from 'next/navigation';
// import { Dropzone } from '@/components/auth/ui/Dropzone';

// export default async function BusinessSetupForm() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);

//   // STORE TO mongoDB
//   const [restaurantName, setRestaurantName] = useState('');

//   const supabase = await createClient()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   // =======================================================================+===================

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="form-widget max-w-md w-full p-6 bg-white shadow-md rounded-md space-y-4">
//         <div>
//           {/* Business */}
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
//             <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
//               Enter Restaurant Name
//             </label>
//             <input
//               id="restaurantName"
//               type="text"
//               value={restaurantName || ''}
//               onChange={e => setRestaurantName(e.target.value)}
//               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
//             />
//           </div>
//           <div>
//             <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700">
//               Upload your business license
//             </label>

//             {/* Drop Business License Here */}
//             {/* TODO: replace the onDrop function with your upload file function */}
//             <Dropzone onDrop={files => console.log(files)}></Dropzone>
//           </div>
//         </div>

//         <div>
//           <button
//             className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
//             onClick={() => {
//               // TODO: Replace "updateProfile" with your mongoDB function/logic here to Create / Update user portfolio
//               updateProfile({ username, avatar_url });

//               // redirect user to further onboarding page (i.e. questionnaire) base on User role.
//               router.push('/users/business/business-info');
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
// import { Dropzone } from '@/components/auth/ui/Dropzone';

// export default function BusinessSetupForm() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [restaurantName, setRestaurantName] = useState('');
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
//     // TODO: Store restaurantName and uploaded file to MongoDB / Cloudinary
//     router.push('/users/business/business-info');
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="form-widget max-w-md w-full p-6 bg-white shadow-md rounded-md space-y-4">
//         <div>
//           <label>Email</label>
//           <input value={user.email} disabled className="input-disabled" />
//         </div>

//         <div>
//           <label>Restaurant Name</label>
//           <input
//             type="text"
//             value={restaurantName}
//             onChange={e => setRestaurantName(e.target.value)}
//             className="input"
//           />
//         </div>

//         <div>
//           <label>Upload Business License</label>
//           <Dropzone onDrop={files => console.log(files)} />
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
