'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/auth/ui/Card';
import { Button } from '@/components/auth/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleClick = () => {
    router.push('/login');
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sorry, something went wrong with authentication.</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-sm text-muted-foreground">Code error: {error}</p>
              ) : (
                <p className="text-sm text-muted-foreground">An unspecified error occurred.</p>
              )}
              <Button className="w-full font-roboto font-normal mt-4" onClick={handleClick}>
                Back To Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
