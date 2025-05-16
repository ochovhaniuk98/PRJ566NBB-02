import { SignUpForm } from '@/components/Sign-up-form';

export default function Page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 pink-test">
      <div className="relative hidden bg-brand-green lg:block"></div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
