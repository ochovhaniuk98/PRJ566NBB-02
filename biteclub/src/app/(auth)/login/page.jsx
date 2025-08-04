import { LoginForm } from '@/components/auth/Login-form';
import Image from 'next/image';

export default async function Page() {
  // If not logged in, show the login form
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div
        className="bg-brand-green flex flex-col items-center justify-center sticky top-0 h-screen"
        style={{
          backgroundImage: "url('/img/doodleBG.png')",
          backgroundSize: '120%',
          backgroundPosition: '0rem',
        }}
      >
        <div className="relative h-30 w-md bg-transparent">
          <Image src={'/img/logo_final.png'} alt={'BiteClub logo'} className="object-cover" fill={true} />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 ">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
