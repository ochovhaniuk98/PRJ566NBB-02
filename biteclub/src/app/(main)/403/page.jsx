'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/auth/ui/Card';
import { Button } from '@/components/shared/Button';
import { useRouter } from 'next/navigation'; // useSearchParams

export default function Error403() {
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
              <CardTitle className="text-2xl">403 - Access Denied <br/>You don't have permission to view this page.</CardTitle>
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
