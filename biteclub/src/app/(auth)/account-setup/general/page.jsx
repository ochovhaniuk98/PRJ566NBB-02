'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Avatar from './avatar';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';
import Spinner from '@/components/shared/Spinner';

export default function GeneralSetupForm() {
  const router = useRouter();
  const { user } = useUser(); // Current logged-in user's Supabase info

  const [username, setUsername] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Set username from user metadata or fallback
      setUsername(user.user_metadata?.name || user.email || '');
    }
  }, [user]);
  

  const handleSubmit = async () => {
    setLoading(true);

    const data = {
      supabaseId: user.id,
      username: username || '',
      userBio: '', // Not required to input on signup
    };

    try {
      const res = await fetch('/api/generals/update-profile', {
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
    <div className="min-h-screen flex items-center justify-center bg-brand-green-lite">
      <div className="form-widget max-w-md w-full px-12 py-16 border border-brand-yellow-lite shadow-md rounded-md space-y-4 bg-brand-yellow-extralite flex  flex-col justify-center items-stretch">
        <h2 className="text-center">Welcome to Biteclub!</h2>
        <div>
          {/* Show avatar image upload if USER */}
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
           <Spinner message='Loading User...' />
          )}

          <div>
            <Label htmlFor="email" className={'hidden'}>
              Email
            </Label>
            <Input id="email" type="text" value={user?.email || ''} disabled className="w-full hidden" />
          </div>

          <div className="mt-8">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Button className="w-full" onClick={handleSubmit} variant="default" disabled={loading}>
            {loading ? 'Submitting...' : 'Update'}
          </Button>
        </div>

        <form action="/signout" method="post" className="relative">
          <button
            className="text-sm text-brand-navy font-primary font-medium p-2 rounded-md absolute -left-8 -bottom-15 underline cursor-pointer"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
// border border-brand-navy
