import { LoginForm } from '@/components/auth/Login-form';
import Image from 'next/image';

export default async function Page() {
  // If not logged in, show the login form
  return (
    <div className="flex lg:flex-row flex-col not-last:lg:h-screen h-full">
      <div
        className="bg-brand-green flex flex-col items-center justify-center top-0 lg:h-screen h-40 lg:w-1/2"
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
      <div className="flex flex-col justify-center items-center gap-4 p-0 lg:p-10 lg:w-1/2 flex-grow ">
        <LoginForm />
      </div>
    </div>
  );
}
