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
import Avatar from '@/app/(auth)/account-setup/general/avatar';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleDeleteUser = async () => {
    if (!user) return;

    await fetch('/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });

    await supabase.auth.signOut();
    router.push('/');
  };


  return (
    <MainBaseContainer>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center m-16 bg-white">
        <Avatar uid={user?.id} url={avatarUrl} size={150} onUpload={url => setAvatarUrl(url)} />
        <form className="w-4xl mt-8">
          <GridCustomCols numOfCols={2}>
            <div className="py-1 px-12 flex flex-col gap-2">
              <h2 className="mb-4">Account Details</h2>
              <div>
                <Label htmlFor="email">
                  <h4>Username</h4>
                </Label>
                <Input id="email" type="email" placeholder="janedoe@myemail.com" required className="w-full" />
              </div>
              <div>
                <Label htmlFor="email">
                  <h4>Password</h4>
                </Label>
                <Input id="email" type="email" placeholder="password" required className="w-full" />
              </div>
              <div>
                <Label htmlFor="email">
                  <h4>Bio</h4>
                </Label>
                <textarea className="w-full p-2 border rounded-md h-32 resize-none" />
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
          <div className=" flex justify-end gap-x-2 ">
            <Button type="submit" className="w-30" variant="default" disabled={false}>
              Save
            </Button>

            <Button type="submit" className="w-30" variant="secondary" disabled={false}>
              Cancel
            </Button>
          </div>
        </form>
        <div className="w-4xl mt-8 py-8 px-12 border-t border-brand-peach">
          <h2 className="mb-4">Delete Account</h2>
          <p className="mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <Button type="submit" className="w-40" variant="danger" disabled={false} onClick={handleDeleteUser}>
            Delete Account
          </Button>
        </div>

        <div className="w-4xl mt-8 py-8 px-12 border-t border-brand-peach">
          {/* TODO: (TEMP LOGOUT) Change the style in /components/auth/Logout-button  */}
          <LogoutButton />
        </div>
      </div>
    </MainBaseContainer>
  );
}
