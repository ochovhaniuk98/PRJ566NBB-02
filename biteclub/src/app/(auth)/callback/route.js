import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/server';
import dbConnect from '@/lib/db/dbConnect';
import { User, BusinessUser } from '@/lib/model/dbSchema';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const userSelectedUserType = searchParams.get('userType'); // Will be defined on Sign Up, but undefined on Login

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

  let finalUserType = null;
  const isNewSignup = userSelectedUserType === 'business' || userSelectedUserType === 'general';

  // Connect and save to MongoDB
  try {
    await dbConnect();

    let existingUser =
      (await User.findOne({ supabaseId: user.id })) || (await BusinessUser.findOne({ supabaseId: user.id }));

    if (!existingUser) {
      if (!isNewSignup) {
        console.error('No userType found in DB and no userType provided by searchParams');

        // If New user login (not Sign Up) with Google account, they do not have userType.
        // Force logout from Supabase
        await supabase.auth.signOut();

        // return NextResponse.redirect(`${origin}/auth-error`);
        return NextResponse.redirect(`${origin}/auth-error?reason=unauthorised_google_signup`);
      }

      const Model = userSelectedUserType === 'business' ? BusinessUser : User;

      const newUser = new Model({
        supabaseId: user.id,
        userType: userSelectedUserType,
      });

      await newUser.save();

      finalUserType = userSelectedUserType;
    } else {
      // If user already registered, we use the current userType stored in MongoDB
      finalUserType = existingUser.userType;
    }
  } catch (err) {
    console.error('MongoDB error:', err.message);
    return NextResponse.redirect(`${origin}/auth-error`);
  }

  // Determine proper redirect destination

  // const hasOnboarded = user.user_metadata?.hasOnboarded === true;
  // const target = hasOnboarded ? '/users' : '/account-setup';
  let target;
  if (isNewSignup) {
    // New signup → onboarding
    target = finalUserType === 'business' ? '/account-setup/business' : '/account-setup/general';
  } else {
    // Returning user → dashboard
    target = finalUserType === 'business' ? '/users/business' : '/users/general';
  }

  // Vercel-aware redirect handling
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
