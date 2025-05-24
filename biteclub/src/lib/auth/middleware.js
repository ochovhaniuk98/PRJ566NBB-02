import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { getUserTypeBySupabaseId } from '@/lib/db/dbOperations';

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If request is for: https://example.com/users/business
  // request.nextUrl.pathname => "/users/business"
  const pathname = request.nextUrl.pathname;

  // Not logged in — redirect to /login
  if (!user && !pathname.startsWith('/login')) {
    // request.nextUrl is immutable — you can't change it directly
    // The 2 lines below will Creates a new copy of the current URL, but changes the path to /login.
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    // Then we redirect the user to this new URL:
    return NextResponse.redirect(loginUrl);
  }

  // Logged in but restricted based on userType
  // if (user) {
  //   try {
  //     const userType = await getUserTypeBySupabaseId(user.id);
  //     console.log(`userType: ${userType}`);
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   if (pathname.startsWith('/users/business') && userType !== 'business') {
  //     const forbiddenUrl = request.nextUrl.clone();
  //     forbiddenUrl.pathname = '/403';
  //     return NextResponse.redirect(forbiddenUrl);
  //   }

  //   if (pathname.startsWith('/users/general') && userType !== 'general') {
  //     const forbiddenUrl = request.nextUrl.clone();
  //     forbiddenUrl.pathname = '/403';
  //     return NextResponse.redirect(forbiddenUrl);
  //   }
  // }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
