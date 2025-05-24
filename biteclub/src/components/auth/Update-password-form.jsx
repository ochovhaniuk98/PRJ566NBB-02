'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/auth/client';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/auth/ui/Card';
import { Input } from '@/components/shared/Input';
import { Label } from '@/components/shared/Label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function UpdatePasswordForm({ className, ...props }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async e => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.

      //  const userType = await getUserTypeBySupabaseId(data.user.id); // This can only work on server side, not client side.
      const { data } = await supabase.auth.getUser();

      const response = await fetch('/api/get-user-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId: data.user.id }),
      });

      const { userType } = await response.json();

      // console.log(data.user)
      if (userType) {
        // Redirect Users to different dashboard base on UserType.
        router.push(`/users/${userType}`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save new password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
