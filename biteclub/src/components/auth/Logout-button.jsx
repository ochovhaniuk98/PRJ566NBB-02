'use client';

import { createClient } from '@/lib/auth/client';
import { Button } from '@/components/shared/Button';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return <Button  className="w-40" variant="default"  onClick={logout}>Logout</Button>;
}
