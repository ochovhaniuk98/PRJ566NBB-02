import dbConnect from '@/lib/db/dbConnect';
import { User } from '@/lib/model/dbSchema';

export async function POST(req) {
  try {
    await dbConnect();
    const { restaurantId, supabaseUserId } = await req.json();

    if (!supabaseUserId || !restaurantId) {
      throw new Error('Missing supabaseUserId or restaurantId');
    }

    const generalUser = await User.findOne({ supabaseId: supabaseUserId });
    if (!generalUser) throw new Error('User not found');

    const favourites = generalUser.favouriteRestaurants.map(id => id.toString());
    const alreadyFavourited = favourites.includes(restaurantId);

    // If user clicks again => remove from favourites => pull
    if (alreadyFavourited) {
      generalUser.favouriteRestaurants.pull(restaurantId);
    } else {
      generalUser.favouriteRestaurants.push(restaurantId);
    }

    await generalUser.save();

    const count = await User.countDocuments({
      favouriteRestaurants: restaurantId,
    });

    return new Response(JSON.stringify({ numOfFavourites: count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
