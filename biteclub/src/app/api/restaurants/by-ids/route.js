// app/api/restaurants/by-ids/route.js
import { Restaurant } from '@/lib/model/dbSchema';
import dbConnect from '@/lib/db/dbConnect';

// Used in: General User Dashboard - fetch Restaurant Profile to display on "Favourite Restaurants" Tab
export async function POST(req) {
  try {
    const { ids } = await req.json();
    await dbConnect();

    const restaurants = await Restaurant.find({ _id: { $in: ids } })
      .select('-__v -locationCoords -BusinessHours -images -latitude -longitude')
      .lean();
    return new Response(JSON.stringify({ restaurants }), {
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
