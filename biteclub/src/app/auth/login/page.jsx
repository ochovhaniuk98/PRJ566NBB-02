import { LoginForm } from '@/components/Login-form';
//import { GalleryVerticalEnd } from "lucide-react";
import { createClient } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import '../../styles/auth2.css';

export default async function Page() {
  // if user already logged in, they should be redirected back to the Dashboard.
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  // console.log(data.user)
  if (data?.user) {
    redirect('/users');
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2 pink-test">
      <div className="relative hidden bg-brand-green lg:block"></div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
