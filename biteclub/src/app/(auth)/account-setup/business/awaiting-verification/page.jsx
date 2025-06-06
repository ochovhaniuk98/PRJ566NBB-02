'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/auth/ui/Card';
import { Button } from '@/components/shared/Button';
import { useRouter } from 'next/navigation';
export default function Page() {
  const router = useRouter();
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Thank you for submitting your information!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We've received your business license and details. The verification process will take up to 3 business
                days to complete.
              </p>
              {/* Only when "verificationStatus" is set to true will users be allowed to access the user dashboard route. 
                  Therefore, even if they are logged in, we will redirect them to the homepage instead of the dashboard. */}
              <Button className="w-full font-roboto font-normal mt-4" onClick={() => router.push('/')}>
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
