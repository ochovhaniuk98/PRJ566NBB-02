'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/auth/ui/Card';
import { Button } from '@/components/shared/Button';
import { useRouter } from 'next/navigation'; // useSearchParams

export default function Error404() {
  const router = useRouter();

  const handleClick = () => {
    // router.push('/');
    router.back();
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">404 - Page Not Found<br/>The page doesn't exist or can't be found.</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full font-roboto font-normal mt-4" onClick={handleClick}>
                 Back To Previous Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
