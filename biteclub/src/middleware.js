// import { updateSession } from '@/utils/supabase/middleware'
import { updateSession } from '@/lib/auth/middleware';

export async function middleware(request) {
  // update user's auth session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */

    // $: excludes the empty string path (i.e. localhost:3000/)
    // '/((?!_next/|favicon.ico|img/|auth|error|restaurants|$).*)',

    // TODO: always remember to check if the route is public or protected. 
    // If public, we need to update the below, or Auth Session will be null somehow...
    '/((?!_next/|favicon.ico|img/|login|sign-up|sign-up-success|callback|auth-error|forgot-password|update-password|confirm|signout|$).*)',
  ],
};
