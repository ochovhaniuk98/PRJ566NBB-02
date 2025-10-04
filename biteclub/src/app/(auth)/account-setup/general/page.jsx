'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import Avatar from './avatar';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';
import Spinner from '@/components/shared/Spinner';
import Image from 'next/image';
import StyledPageTitle from '@/components/shared/StyledPageTitle';

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
      userBio: 'Tell us about yourself here.', // Not required to input on signup
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
    <div className="flex md:flex-row flex-col h-screen overflow-hidden">
      <div
        className="lg:w-1/2 md:w-1/3 w-full md:h-full h-1/6 bg-cover"
        style={{
          backgroundImage: "url('/img/greenOnYellowBG.png')",
          backgroundPosition: '-2rem',
          backgroundSize: '120rem',
        }}
      ></div>
      <div className="lg:w-1/2 md:w-2/3 w-full md:h-full h-5/6 md:px-12 px-0 md:py-16 py-0 ml-auto md:bg-white bg-brand-yellow-extralite flex items-center flex-col overflow-y-auto">
        <div className="form-widget md:max-w-md w-full md:px-14 px-6 py-16 pt-8 rounded-md space-y-4 bg-brand-yellow-extralite flex  flex-col justify-center items-stretch">
          <div className="relative size-12 mb-2 self-center">
            <Image src={'/img/hotdog.png'} alt={'hotdog'} className="object-contain" fill={true} />
          </div>
          <div className="w-full flex items-center justify-center">
            <StyledPageTitle textString="Welcome!" textAlign="text-center" />
          </div>
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
              <Spinner message="Loading User..." />
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

          <div className="w-full flex flex-col items-center ">
            <Button className="w-60" onClick={handleSubmit} variant="default" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} className={`icon-lg text-brand-navy`} />
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>

          <form action="/signout" method="post" className="relative">
            <button
              className="text-sm text-brand-navy font-primary font-medium p-2 rounded-md absolute md:-left-8 -bottom-15 underline cursor-pointer"
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
