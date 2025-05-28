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
      setUsername(data.user.user_metadata?.name || '');
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const data = {
      supabaseId: user.id,
      username: username || '',
      userBio: '', // Not required to input on signup
    };

    try {
      const res = await fetch('/api/update-general-user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to update profile');
      }

      router.push('/questionnaire');
    } catch (err) {
      console.error(err);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="form-widget max-w-md w-full p-6 bg-white shadow-md rounded-md space-y-4">
        <div>
          {user ? (
            <Avatar
              uid={user.id}
              url={avatar_url}
              size={150}
              onUpload={url => {
                setAvatarUrl(url);
              }}
            />
          ) : (
            <p>Loading user...</p>
          )}

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
              value={username}
              onChange={e => setUsername(e.target.value)}
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
