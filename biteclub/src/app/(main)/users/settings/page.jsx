'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Input } from '@/components/shared/Input';
import { Label } from '@/components/shared/Label';
import { Switch } from '@/components/shared/Switch';
import { Button } from '@/components/shared/Button';
import { LogoutButton } from '@/components/auth/Logout-button';
import { DeleteAccountButton } from '@/components/auth/Delete-account-button';
import Avatar from '@/app/(auth)/account-setup/general/avatar';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [userBio, setUserBio] = useState('');
  const supabase = createClient();

  
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;
      
      setUser(data.user);
      
      const res = await fetch('/api/get-general-user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId: data.user.id }),
      });
      
      const { profile } = await res.json();
      
      setUsername(profile.username || '')
      setUserBio(profile.userBio || '');
      // setAvatarUrl(profile.avatarUrl || '');
    };
    
    fetchData();
  }, []);
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    if (password !== '') {
      await supabase.auth.updateUser({ password });
    }
    
    if (user?.id) {
      await fetch('/api/update-general-user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: user.id,
          userBio,
          username,
        }),
      });
    }
    
    alert('Settings updated!');
    setPassword('');
  };
  
  // If the user signed up using Google OAuth, they do not need to update their password.
  const isGoogleUser = user?.app_metadata?.provider === 'google' || user?.app_metadata?.providers?.includes('google');

  return (
    <MainBaseContainer>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center m-16 bg-white">
        <Avatar uid={user?.id} url={avatarUrl} size={150} onUpload={url => setAvatarUrl(url)} />

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
                  <Label htmlFor="password">
                    <h4>Password</h4>
                  </Label>
                  <input
                    id="password"
                    type="password"
                    // placeholder="(optional) set your new password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full"
                  />
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
                <Switch id="user-role" checked={true} />
              </div>

              <div className="flex items-center justify-between mb-8">
                <label htmlFor="user-role">
                  <h4>Visited Places</h4>
                </label>
                <Switch id="user-role" checked={true} />
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
