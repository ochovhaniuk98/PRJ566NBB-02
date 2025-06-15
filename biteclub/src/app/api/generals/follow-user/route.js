import dbConnect from '@/lib/db/dbConnect';
import { User } from '@/lib/model/dbSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { supabaseUserId, anotherUserId } = await req.json();

    if (!supabaseUserId || !anotherUserId) {
      return NextResponse.json({ error: 'Missing user or target user ID' }, { status: 400 });
    }

    await dbConnect();

    // Only need _id and followings
    const currentUser = await User.findOne({ supabaseId: supabaseUserId }).select('_id followings');

    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
    }

    // Prevent self-following (Just safeguard. This is already handled on the front-end)
    if (currentUser._id.toString() === anotherUserId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // Only need _id and followers
    const anotherUser = await User.findOne({ _id: anotherUserId }).select('_id followers');

    if (!anotherUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    const followingIndex = currentUser.followings.findIndex(id => id.toString() === anotherUserId);
    const followerIndex = anotherUser.followers.findIndex(id => id.toString() === currentUser._id.toString());

    const isAlreadyFollowing = followingIndex !== -1 && followerIndex !== -1;

    if (isAlreadyFollowing) {
      // array.splice(startIndex, deleteCount, item1, item2, ...)
      currentUser.followings.splice(followingIndex, 1);
      anotherUser.followers.splice(followerIndex, 1);
    } else {
      // Optional: double-check to avoid duplicates in case of partial desync
      if (followingIndex === -1) currentUser.followings.push(anotherUserId);
      if (followerIndex === -1) anotherUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await anotherUser.save();

    const isFollowing = !isAlreadyFollowing;

    // This returned `isFollowing` value is what lets the UI update immediately
    // On frontend: setIsFollowing(result.isFollowing) reflects toggle state
    return NextResponse.json({ isFollowing });
  } catch (err) {
    console.error('Error toggling follow status:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
