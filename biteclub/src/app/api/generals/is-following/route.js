import dbConnect from '@/lib/db/dbConnect';
import { User } from '@/lib/model/dbSchema';
import { NextResponse } from 'next/server';

// This route checks whether a user is following another user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const supabaseUserId = searchParams.get('authId');
    const followingId = searchParams.get('fId');

    if (!supabaseUserId || !followingId) {
      return NextResponse.json({ error: 'Missing Supabase user ID or follow target ID' }, { status: 400 });
    }

    await dbConnect();

    // .lean(): returns a plain JS object instead of a Mongoose document (faster, no virtuals/methods)
    const userFollowings = await User.findOne({ supabaseId: supabaseUserId }).select('followings').lean();

    if (!userFollowings) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isFollowing =
      Array.isArray(userFollowings.followings) &&
      userFollowings.followings.some(followedId => followedId.toString() === followingId);

    return NextResponse.json({ isFollowing });
  } catch (err) {
    console.error('Error checking following status:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
