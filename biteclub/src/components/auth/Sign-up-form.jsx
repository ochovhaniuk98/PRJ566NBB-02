'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/auth/client';
import { Button } from '@/components/auth/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/auth/ui/Card';
import { Input } from '@/components/auth/ui/Input';
import { Label } from '@/components/auth/ui/Label';
import { Switch } from '@/components/auth/ui/Switch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignUpForm({ className, ...props }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState(false); // Switch: Business Account -> True
  const router = useRouter();

  // TODO:
  // Connect to MongoDB and Create user schema: Business vs General
  // This function will be used in the handleSignUp() and handleGoogleLogin() functions, once user click on sign up, the schema will be created and stored to the mongoDB
  // - If userType is True -> create business user
  // - If userType is False -> create general user

  // TODO: Remove "Switch" Logic in (auth)/account-form afterwards.
  // After signup, we retrieve userType from MongoDB, and redirect them to account-setup

  // Supabase Auth
  // Email Sign Up
  const handleSignUp = async e => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });
      if (error) throw error;
      router.push('/sign-up-success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }

    // Use the defined function to CREATE USER IN MONGODB
  };

  // Google Sign Up
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // RedirectTo:
          // New users will be redirected to onboarding page.
          // Registered users will be redirected back to user dashboard.
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
    
    // Use the defined function to CREATE USER IN MONGODB
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            <h2>Sign up</h2>
          </CardTitle>
          <CardDescription>
            <h3 className="text-center">Create a new account</h3>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* User Type Switch -- Ignore label text for now, Not sure what it should say yet. */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <label htmlFor="user-role">
              <h5>I am a restaurant business.</h5>
            </label>
            <Switch id="user-role" checked={userType} onCheckedChange={setUserType} />
          </div>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-4">

              <div className="flex items-center gap-2">
                <label htmlFor="user-role" className="text-sm text-gray-700">
                  Register as Business Account
                </label>
                <Switch id="user-role" checked={userType} onCheckedChange={setUserType} />
              </div>

              <div className="flex flex-col gap-4 items-center">
                <Button
                  // It's the first button inside the form, browsers might treat it as the default submit button when pressing Enter in a form input.
                  // Pressing "Enter" to create account should be for Email registration, not Google.
                  type="button" // To prevent that, explicitly set the type (vs default: "submit")
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
                  Sign up with Google
                </Button>
              </div>
              <div className="relative text-center text-sm text-brand-grey-lite after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-brand-yellow-extralite px-2 text-brand-grey text-xs uppercase font-primary font-semibold">
                  Or
                </span>
              </div>
              <div className="grid">
                <Label htmlFor="email">
                  {' '}
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
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="grid">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">
                    <h4>Confirm Password</h4>
                  </Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={e => setRepeatPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center">
                {error && <p className="text-sm text-red-500">{error}</p>}

                {/* Change variant for another button theme */}
                <Button type="submit" className="w-60" variant="default" disabled={isLoading}>
                  {isLoading ? 'Creating an account...' : 'Sign up'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h5>
                Already have an account?{' '}
                <Link href="/login" className="underline underline-offset-4 font-primary text-sm font-semibold">
                  Login
                </Link>
              </h5>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
