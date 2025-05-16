import { redirect } from 'next/navigation';

import { LogoutButton } from '@/components/auth/Logout-button';
import { createClient } from '@/lib/auth/server';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  // console.log(data.user)
  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col h-svh w-full items-center justify-center gap-3">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <p>
        Welcome back, <span>{data.user.user_metadata.name}!</span>
      </p>
      <LogoutButton />
    </div>
  );
}
