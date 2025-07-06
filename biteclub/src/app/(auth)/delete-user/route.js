import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { v2 as cloudinary } from 'cloudinary';
import { User, BusinessUser } from '@/lib/model/dbSchema';
import {
  getProfilePicByUserSuperbaseId,
  deleteAllExternalReviewsByUser,
  getGeneralUserMongoIDbySupabaseId,
} from '@/lib/db/dbOperations';

export async function POST(req) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const { data, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (getUserError || !data?.user) {
    return NextResponse.json({ error: 'User not found in Supabase' }, { status: 404 });
  }

  const userType = data.user.user_metadata?.user_type;

  try {
    await dbConnect();

    const deleteOperations = [];

    if (userType === 'general') {
      const userMongoId = await getGeneralUserMongoIDbySupabaseId({ supabaseId: userId });
      const profilePic = await getProfilePicByUserSuperbaseId(userId);

      deleteOperations.push(deleteAllExternalReviewsByUser(userMongoId));
      deleteOperations.push(User.findOneAndDelete({ supabaseId: userId }));

      if (profilePic?.public_id) {
        deleteOperations.push(
          cloudinary.uploader.destroy(profilePic.public_id).then(res => {
            if (res.result !== 'ok' && res.result !== 'not_found') {
              throw new Error('Cloudinary deletion failed');
            }
          })
        );
      }
    } else if (userType === 'business') {
      deleteOperations.push(BusinessUser.findOneAndDelete({ supabaseId: userId }));
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    // Supabase deletion
    deleteOperations.push(
      supabaseAdmin.auth.admin.deleteUser(userId).then(({ error }) => {
        if (error) throw new Error(`Supabase deletion failed: ${error.message}`);
      })
    );

    // Run all deletions concurrently
    await Promise.all(deleteOperations);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Atomic deletion failed:', err.message);
    return NextResponse.json({ error: `Atomic deletion failed: ${err.message}` }, { status: 500 });
  }
}
