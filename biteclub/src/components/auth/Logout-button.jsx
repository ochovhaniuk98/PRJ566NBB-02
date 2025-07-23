'use client';
import { useState } from 'react';
import { createClient } from '@/lib/auth/client';
import { Button } from '@/components/shared/Button';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/shared/Spinner';

export function LogoutButton() {
    const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoggingOut(true);
    router.push('/');
  };

  if (loggingOut) return <Spinner message='Logging out...'/>

  return <Button  className="w-40" variant="default"  onClick={logout}>Logout</Button>;
}
