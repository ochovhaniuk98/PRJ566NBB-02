// app/api/restaurants/search/route.js
import { searchRestaurantsBySearchQuery } from '@/lib/db/dbOperations';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // search
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  // filters
  const price = searchParams.get('price');
  const rating = parseFloat(searchParams.get('rating') || '0');
  const cuisines = searchParams.get('cuisines')?.split(',') || [];
  const dietary = searchParams.get('dietary')?.split(',') || [];
  const isOpenNow = searchParams.get('isOpenNow') === 'true';

  try {
    const { restaurants, totalCount } = await searchRestaurantsBySearchQuery(query, {
      page,
      limit,
      cuisines,
      dietary,
      rating,
      price,
      isOpenNow,
    });

    return new Response(JSON.stringify({ restaurants, totalCount }), {
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
