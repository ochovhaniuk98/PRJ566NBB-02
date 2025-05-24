import { LoginForm } from '@/components/auth/Login-form';

export default async function Page() {

  // If not logged in, show the login form
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
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
