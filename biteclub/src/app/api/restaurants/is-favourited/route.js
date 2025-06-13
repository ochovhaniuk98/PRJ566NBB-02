import dbConnect from '@/lib/db/dbConnect';
import { User } from '@/lib/model/dbSchema';
import { NextResponse } from 'next/server';


// This route checks whether a restaurant is currently favourited by users
export async function GET(req) {
  try {
    const {searchParams} = new URL(req.url);
    const supabaseUserId = searchParams.get('authId');
    const restaurantId = searchParams.get('restaurantId');


    if (!supabaseUserId || !restaurantId) {
      return NextResponse.json({ error: 'Missing user or restaurant ID' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ supabaseId: supabaseUserId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isFavourited = user.favouriteRestaurants.some(
      (favId) => favId.toString() === restaurantId
    );

    return NextResponse.json({ isFavourited });
  } catch (err) {
    console.error('Error checking favourite status:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
