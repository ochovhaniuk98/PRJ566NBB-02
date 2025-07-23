'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Input } from '@/components/shared/Input';
import { Label } from '@/components/shared/Label';
import { Switch } from '@/components/shared/Switch';
import { Button } from '@/components/shared/Button';
import { LogoutButton } from '@/components/auth/Logout-button';
import { DeleteAccountButton } from '@/components/auth/Delete-account-button';
import Spinner from '@/components/shared/Spinner';
import Avatar from '@/app/(auth)/account-setup/general/avatar';

export default function Settings() {
  // User infomation
  const { user } = useUser(); // Current logged-in user's Supabase info
  const { userData, loadingData, refreshUserData } = useUserData(); // Current logged-in user's MongoDB data (User / BusinessUser Object)

  const [username, setUsername] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [userBio, setUserBio] = useState('');

  // Display preference
  const [displayFavouriteRestaurants, setDisplayFavouriteRestaurants] = useState(false);
  const [displayFavouriteBlogPosts, setDisplayFavouriteBlogPosts] = useState(false);
  const [displayVisitedPlaces, setDisplayVisitedPlaces] = useState(false);
  const [feedPersonalization, setFeedPersonalization] = useState(false);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loadingData || !userData) return;

    setUsername(userData.username || '');
    setUserBio(userData.userBio || '');
    setDisplayFavouriteRestaurants(userData.displayFavouriteRestaurants ?? false);
    setDisplayFavouriteBlogPosts(userData.displayFavouriteBlogPosts ?? false);
    setDisplayVisitedPlaces(userData.displayVisitedPlaces ?? false);
    setFeedPersonalization(userData.feedPersonalization ?? false);
    setLoading(false);
  }, [loadingData, userData]);

  if (loadingData || loading) return <Spinner />;

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); // reset error state

    try {
      if (!user?.id) return;
      if (password !== '') {
        const { error } = await supabase.auth.updateUser({ password });

        // Throw an error here if password update fails
        if (error) throw error;
      }

      const res = await fetch('/api/generals/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: user.id,
          userBio,
          username,
          displayFavouriteRestaurants,
          displayFavouriteBlogPosts,
          displayVisitedPlaces,
          feedPersonalization,
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Profile update failed');
      }

      alert('Settings updated!');
      setPassword('');
    } catch (err) {
      console.error(err);

      // Password-related errors will be caught and set here
      setError(err instanceof Error ? err.message : JSON.stringify(err));
    }
  };

  // If the user signed up using Google OAuth, they do not need to update their password.
  const isGoogleUser = user?.app_metadata?.provider === 'google' || user?.app_metadata?.providers?.includes('google');

  return (
    <MainBaseContainer>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center m-16 bg-white">
        {/* <Avatar uid={user?.id} url={avatarUrl} size={150} onUpload={url => setAvatarUrl(url)} /> */}
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

        <form className="w-4xl mt-8" onSubmit={handleSubmit}>
          <GridCustomCols numOfCols={2}>
            <div className="py-1 px-12 flex flex-col gap-2">
              <h2 className="mb-4">Account Details</h2>

              <div>
                <Label htmlFor="username">
                  <h4>Username</h4>
                </Label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {!isGoogleUser && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Set a new password"
                    // required // THIS IS OPTIONAL. WE DO NOT FORCE USER TO UPDATE PASSWORD EVERYTIME.
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              )}

              <div>
                <Label htmlFor="userbio">
                  <h4>Bio</h4>
                </Label>
                <textarea
                  className="w-full p-2 border rounded-md h-32 resize-none"
                  value={userBio}
                  onChange={e => setUserBio(e.target.value)}
                />
              </div>
            </div>

            <div className="py-1 px-12 flex flex-col gap-2">
              <h2 className="mb-4">Display Preferences</h2>
              <p className="mb-4">You can modify what page to show the public.</p>

              <div className="flex items-center justify-between mb-4">
                <label htmlFor="user-role">
                  <h4>Favourite Restaurants</h4>
                </label>
                <Switch
                  id="user-role"
                  checked={displayFavouriteRestaurants}
                  onCheckedChange={checked => {
                    setDisplayFavouriteRestaurants(checked);
                  }}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <label htmlFor="user-role">
                  <h4>Favourite Blog Posts</h4>
                </label>
                <Switch
                  id="user-role"
                  checked={displayFavouriteBlogPosts}
                  onCheckedChange={checked => {
                    setDisplayFavouriteBlogPosts(checked);
                  }}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <label htmlFor="user-role">
                  <h4>Visited Places</h4>
                </label>
                <Switch
                  id="user-role"
                  checked={displayVisitedPlaces}
                  onCheckedChange={checked => {
                    setDisplayVisitedPlaces(checked);
                  }}
                />
              </div>

              <h2 className="mb-4">Feed Personalization</h2>
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="user-role">
                  <h4>AI personalized feed</h4>
                </label>
                <Switch
                  id="user-role"
                  checked={feedPersonalization}
                  onCheckedChange={checked => {
                    setFeedPersonalization(checked);
                  }}
                />
              </div>
            </div>
          </GridCustomCols>

          <div className="flex justify-end gap-x-2">
            <Button type="submit" className="w-30" variant="default">
              Save
            </Button>

            <Button type="button" className="w-30" variant="secondary" onClick={() => window.location.reload()}>
              Cancel
            </Button>
          </div>
        </form>

        <div className="w-4xl mt-8 py-8 px-12 border-t border-brand-peach">
          <h2 className="mb-4">Delete Account</h2>
          <p className="mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <DeleteAccountButton user={user} />
        </div>

        <div className="w-4xl mt-8 py-8 px-12 border-t border-brand-peach">
          <LogoutButton />
        </div>
      </div>
    </MainBaseContainer>
  );
}
