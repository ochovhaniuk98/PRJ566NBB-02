import dbConnect from '@/lib/db/dbConnect';
import { User } from '@/lib/model/dbSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { supabaseUserId, restaurantId } = await req.json();

    if (!supabaseUserId || !restaurantId) {
      return NextResponse.json({ error: 'Missing user or restaurant ID' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ supabaseId: supabaseUserId });

    // Handle invalid user ID
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the restaurant is already in the user's favourite list
    const index = user.favouriteRestaurants.findIndex(
      (favId) => favId.toString() === restaurantId
    );

    let isFavourited;

    if (index !== -1) {
      // Already favourited → remove from list (toggle off)
      user.favouriteRestaurants.splice(index, 1);
      isFavourited = false;
    } else {
      // Not yet favourited → add to list (toggle on)
      user.favouriteRestaurants.push(restaurantId);
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
