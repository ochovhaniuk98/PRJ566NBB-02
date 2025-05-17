'use client';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/auth/client';
import { Button } from '@/components/auth/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/auth/ui/Card';
import { Input } from '@/components/auth/ui/Input';
import { Label } from '@/components/auth/ui/Label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async e => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push('/users');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);
    try {
      // const { error } = await supabase.auth.signInWithOAuth({
      //   provider: "google",
      // });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // [!] REDIRECT TO THE ROUTE THAT YOU DESIRE. e.g. users (the origin "protected").
          // Old user will be redirected to the user dashboard
          // redirectTo: `${window.location.origin}/auth/callback?next=/users`,

          // let the /callback decide where user should go
          redirectTo: `${window.location.origin}/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      // Supabase will redirect automatically to the callback URL
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            <h2>Login</h2>
          </CardTitle>
          <CardDescription>
            <p className="text-center">Login with your Google account</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 items-center">
                {/* <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button> */}
                <Button
                  variant="googlebtn"
                  className="w-60 font-roboto font-normal"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <div className="bg-white p-[2px] rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="100"
                      height="100"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      ></path>
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      ></path>
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                    </svg>
                  </div>
                  Login with Google
                </Button>
              </div>
              <div className="relative text-center text-sm text-brand-grey-lite after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-brand-yellow-extralite px-2 text-brand-grey text-xs uppercase font-primary font-semibold">
                  Or
                </span>
              </div>
              <div className="grid">
                <Label htmlFor="email">
                  <h4>Email</h4>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="janedoe@myemail.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="grid">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    <h4>Password</h4>
                  </Label>
                  <Link
                    href="forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 text-brand-navy font-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center">
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-60" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h5>
                Don&apos;t have an account?&nbsp;
                <Link href="/sign-up" className="underline underline-offset-4 font-primary text-sm font-semibold">
                  Sign up
                </Link>
              </h5>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
