import { LoginForm } from '@/components/auth/Login-form';
import Image from 'next/image';

export default async function Page() {
  // If not logged in, show the login form
  return (
    <div className="flex lg:flex-row flex-col min-h-screen h-full">
      <div
        className="bg-brand-green flex flex-1 flex-col items-center justify-center lg:basis-1/2 lg:max-h-none max-h-40"
        style={{
          backgroundImage: "url('/img/doodleBG.png')",
          backgroundSize: '70rem',
          backgroundPosition: '0rem',
        }}
      >
        <div className="relative lg:h-40 h-20 lg:w-md w-sm bg-transparent">
          <Image src={'/img/logo_final.png'} alt={'BiteClub logo'} className="object-contain" fill={true} />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 p-0 lg:p-10 lg:basis-1/2 flex-grow">
        <LoginForm />
      </div>
    </div>
  );
}
