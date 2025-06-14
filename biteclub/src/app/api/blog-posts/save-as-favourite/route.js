import dbConnect from '@/lib/db/dbConnect';
import { User } from '@/lib/model/dbSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { supabaseUserId, postId } = await req.json();

    if (!supabaseUserId || !postId) {
      return NextResponse.json({ error: 'Missing user or post ID' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ supabaseId: supabaseUserId });

    // Handle invalid user ID
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the post is already in the user's favourite list
    const index = user.favouriteBlogs.findIndex(
      (favId) => favId.toString() === postId
    );

    let isFavourited;

    if (index !== -1) {
      // Already favourited → remove from list (toggle off)
      user.favouriteBlogs.splice(index, 1);
      isFavourited = false;
    } else {
      // Not yet favourited → add to list (toggle on)
      user.favouriteBlogs.push(postId);
      isFavourited = true;
    }

    await user.save();

    // This returned `isFavourited` value is what lets the UI update immediately
    // On frontend: setIsFavourited(result.isFavourited) reflects toggle state
    return NextResponse.json({ isFavourited });
  } catch (err) {
    console.error('Error toggling favourite status:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
