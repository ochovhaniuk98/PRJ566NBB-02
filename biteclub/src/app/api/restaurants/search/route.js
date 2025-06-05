// app/api/restaurants/search/route.js

import { searchRestaurantsByQuery } from '@/lib/db/dbOperations';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    const restaurants = await searchRestaurantsByQuery(query);

    return new Response(JSON.stringify(restaurants), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to search restaurants' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
