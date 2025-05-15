// LATER WE WILL USE MONGO DB TO STORE USER INFO

'use client';
import { useCallback, useEffect, useState } from 'react';
// import { createClient } from "@/utils/supabase/client";
import { createClient } from '@/lib/auth/client';
import Avatar from './avatar';
import { Switch } from '@/components/ui/Switch';
import { useRouter } from 'next/navigation';

export default function AccountForm({ user }) {
  const router = useRouter();

  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  // const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  // const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [user_role, setUserRole] = useState(false); // Switch: Business Account -> True

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        // .select(`full_name, username, website, avatar_url`)
        .select(`username, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        // setFullname(data.full_name);
        setUsername(data.username);
        // setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username, avatar_url }) { // fullname, website
    try {
      setLoading(true);

      const { error: updateError } = await supabase.from('profiles').upsert({
        id: user?.id,
        // full_name: fullname,
        username,
        // website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      // if (error) throw error;

      if (updateError) throw updateError;

      // Mark user as onboarded
      const { error: metaError } = await supabase.auth.updateUser({
        data: { hasOnboarded: true },
      });

      if (metaError) throw metaError;
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="form-widget max-w-md w-full p-6 bg-white shadow-md rounded-md space-y-4">
        {/* Add to the body */}

        <Avatar
          uid={user?.id}
          url={avatar_url}
          size={150}
          onUpload={url => {
            setAvatarUrl(url);
            // updateProfile({ fullname, username, website, avatar_url: url });
            updateProfile({ username, avatar_url: url });
          }}
        />

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={user?.email}
            disabled
            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 cursor-not-allowed"
          />
        </div>
        {/* <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullname || ""}
            onChange={(e) => setFullname(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div> */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Set your username
          </label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        {/* <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700"
          >
            Website
          </label>
          <input
            id="website"
            type="url"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div> */}

        <div className="flex items-center gap-2">
          <label htmlFor="user-role" className="text-sm text-gray-700">
            Register as Business Account
          </label>
          <Switch id="user-role" checked={user_role} onCheckedChange={setUserRole} />
          {/* Base on this, we will decide which database schema will be created, and which page we are going to redirect them to. */}
        </div>

        <div>
          <button
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
            onClick={() => {
              // updateProfile({ fullname, username, website, avatar_url })
              updateProfile({ username, avatar_url });

              // redirect user to further onboarding page (i.e. questionnaire) base on User role.
              router.push(user_role ? '/users/business/business-info' : '/users/general/questionnaire');
            }}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>

        <div>
          <form action="/auth/signout" method="post">
            <button
              className="w-full text-sm text-red-500 border border-red-300 py-2 rounded-md hover:bg-red-50 transition"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
