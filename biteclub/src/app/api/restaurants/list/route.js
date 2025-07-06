// src/app/api/restaurants/list/route.js
import { getListOfRestaurants } from '@/lib/db/dbOperations';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // get a list of restaurants (popular and new)
    const restaurants = await getListOfRestaurants(page, limit);

    return new Response(JSON.stringify({ restaurants }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to find a list of restaurants' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
