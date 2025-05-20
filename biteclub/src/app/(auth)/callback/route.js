import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/server';
import dbConnect from '@/lib/db/dbConnect';
import { User, BusinessUser } from '@/lib/model/dbSchema';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const userType = searchParams.get('userType') || 'general';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth-error`);
  }

  const supabase = await createClient();
  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    return NextResponse.redirect(`${origin}/auth-error`);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(`${origin}/auth-error`);
  }

  // Connect and save to MongoDB
  try {
    await dbConnect();

    const Model = userType === 'business' ? BusinessUser : User;

    const existingUser = await Model.findOne({ supabaseId: user.id });
    if (!existingUser) {
      await new Model({
        supabaseId: user.id,
        userType,
      }).save();
    }

  } catch (err) {
    console.error('MongoDB error:', err.message);
    return NextResponse.redirect(`${origin}/auth-error`);
  }

  // Determine redirect path
  const hasOnboarded = user.user_metadata?.hasOnboarded === true;

  const target = hasOnboarded ? '/users' : '/account-setup';

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
