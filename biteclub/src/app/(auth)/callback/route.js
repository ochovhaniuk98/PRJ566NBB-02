import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/error`); // /auth/
  }

  const supabase = await createClient();
  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    return NextResponse.redirect(`${origin}/error`);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(`${origin}/error`);
  }

  // Check if user has already onboarded
  const hasOnboarded = user.user_metadata?.hasOnboarded === true;

  const target = hasOnboarded ? '/users' : '/users/onboarding';

  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${target}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${target}`);
  } else {
    return NextResponse.redirect(`${origin}${target}`);
  }
}
