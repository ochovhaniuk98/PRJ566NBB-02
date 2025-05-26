import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { User, BusinessUser } from '@/lib/model/dbSchema';

export async function POST(req) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Keep this secret; do not expose it to client
  );

  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: '(delete-user) Missing userId' }, { status: 400 });
  }

  // Get user metadata from Supabase
  const { data, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (getUserError || !data?.user) {
    return NextResponse.json({ error: 'User not found in Supabase' }, { status: 404 });
  }

  const userType = data.user.user_metadata?.user_type;

  // Delete from Supabase
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Delete from MongoDB
  try {
    await dbConnect();
    let deletedUser = null;

    if (userType === 'general') {
      deletedUser = await User.findOneAndDelete({ supabaseId: userId });
    } else if (userType === 'business') {
      deletedUser = await BusinessUser.findOneAndDelete({ supabaseId: userId });
    }

    if (!deletedUser) {
      console.warn(`No user found in MongoDB with supabaseId: ${userId}`);
    }
  } catch (mongoErr) {
    return NextResponse.json({ error: `MongoDB error: ${mongoErr.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
