// import { createClient } from '@/lib/auth/server'; // do not use. not useful
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';

// Delete a User. See:
// https://supabase.com/docs/reference/javascript/auth-admin-deleteuser

export async function POST(req) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // This is secret, not for public, do not expose
  );
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: '(delete-user) Missing userId' }, { status: 400 });
  }

  const { error } = (await supabaseAdmin).auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
