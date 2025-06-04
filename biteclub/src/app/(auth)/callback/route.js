import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
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

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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

        // If a new user logs in (not signs up) using Google, they won't have a userType.
        // However, Google OAuth still creates a user record in the Supabase Auth database.
        // We want to remove this user from the Auth database.
        supabaseAdmin.auth.admin.deleteUser(user.id);

        // return NextResponse.redirect(`${origin}/auth-error`);
        return NextResponse.redirect(`${origin}/auth-error?reason=unauthorised_google_signup`);
      }

      const Model = userSelectedUserType === 'business' ? BusinessUser : User;

      // const newUser = new Model({
      //   supabaseId: user.id,
      //   userType: userSelectedUserType,
      // });

      let newUser;

      if (userSelectedUserType === 'business') {
        newUser = new BusinessUser({
          supabaseId: user.id,
          userType: userSelectedUserType,
          verificationStatus: false, // only for business users
        });
      } else {
        newUser = new User({
          supabaseId: user.id,
          userType: userSelectedUserType,
        });
      }

      await newUser.save();

      finalUserType = userSelectedUserType;

      // We also update user metadata (userType) on Supabase, See:
      // https://supabase.com/docs/reference/javascript/auth-updateuser
      await supabase.auth.updateUser({
        data: { user_type: finalUserType },
      });
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
