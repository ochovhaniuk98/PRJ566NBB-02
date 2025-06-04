import { Card, CardContent, CardHeader, CardTitle } from '@/components/auth/ui/Card';

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Thank you for submitting your information!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We’ve received your business license and details. Once we complete the verification process,
                we’ll notify you by email.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
