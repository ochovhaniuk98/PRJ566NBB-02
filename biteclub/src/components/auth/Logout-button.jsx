'use client';

import { createClient } from '@/lib/auth/client';
import { Button } from '@/components/auth/ui/Button';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return <Button onClick={logout}>Logout</Button>;
}
