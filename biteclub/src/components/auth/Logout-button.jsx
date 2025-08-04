'use client';
import { useState } from 'react';
import { createClient } from '@/lib/auth/client';
import { Button } from '@/components/shared/Button';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/shared/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoggingOut(true);
    router.push('/');
  };

  if (loggingOut) return <Spinner message="Logging out..." />;

  return (
    <Button className="w-40" variant="secondary" onClick={logout}>
      <FontAwesomeIcon icon={faRightFromBracket} className="icon-lg text-brand-navy" />
      Logout
    </Button>
  );
}
