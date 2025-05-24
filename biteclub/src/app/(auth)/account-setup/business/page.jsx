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
    router.push('/users/business');
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
