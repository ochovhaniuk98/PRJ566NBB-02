// WE WILL USE mongoDB and Cloudinary TO STORE USERS INFO
// Users should be created on MongoDB after user selected their user type (Business / General) on this page:
// - General: username and profile picture
// - Business: Restaurant name, business license (img/pdf)

'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';
import Avatar from './avatar';
import { Switch } from '@/components/auth/ui/Switch';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@/components/auth/ui/Dropzone';

export default function AccountForm({ user }) {
  const router = useRouter();

  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(false); // Switch: Business Account -> True

  // STORE TO mongoDB
  const [restaurantName, setRestaurantName] = useState(null);
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  // =======================================================================+===================
  // TODO:
  // get userType from mongoDB:
  // If userType is Business, show business form
  // If userTypes is General, show general form

  // [TODO]: CHANGE IT TO mongoDB logic for updating username and avatar
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
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      // alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username, avatar_url }) {
    try {
      setLoading(true);

      const { error: updateError } = await supabase.from('profiles').upsert({
        id: user?.id,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (updateError) throw updateError;

      // Mark user as onboarded
      const { error: metaError } = await supabase.auth.updateUser({
        data: { hasOnboarded: true },
      });

      // if (metaError) throw metaError;
      // alert('Profile updated!');
    } catch (error) {
      // alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================================================

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="form-widget max-w-md w-full p-6 bg-white shadow-md rounded-md space-y-4">
        <div className="flex items-center gap-2">
          <label htmlFor="user-role" className="text-sm text-gray-700">
            I am a restaurant business.
          </label>
          <Switch id="user-role" checked={userType} onCheckedChange={setUserType} />
        </div>

        {userType ? (
          <div>
            {/* Business */}
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

            <div>
              <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                Enter Restaurant Name
              </label>
              <input
                id="restaurantName"
                type="text"
                value={restaurantName || ''}
                onChange={e => setRestaurantName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700">
                Upload your business license
              </label>

              {/* Drop Business License Here */}
              {/* TODO: replace the onDrop function with your upload file function */}
              <Dropzone onDrop={files => console.log(files)}></Dropzone>
            </div>
          </div>
        ) : (
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
                value={user?.email}
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
                value={username || ''}
                onChange={e => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        )}

        <div>
          <button
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
            onClick={() => {
              // TODO: Replace "updateProfile" with your mongoDB function/logic here to Create / Update user portfolio
              updateProfile({ username, avatar_url });

              // redirect user to further onboarding page (i.e. questionnaire) base on User role.
              router.push(userType ? '/users/business/business-info' : '/users/general/questionnaire');
            }}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>

        <div>
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
    </div>
  );
}
