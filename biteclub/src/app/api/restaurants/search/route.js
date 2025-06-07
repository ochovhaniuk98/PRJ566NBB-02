// app/api/restaurants/search/route.js

// import { searchRestaurantsByQuery } from '@/lib/db/dbOperations';

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const query = searchParams.get('q') || '';

//   try {
//     const restaurants = await searchRestaurantsByQuery(query);

//     return new Response(JSON.stringify(restaurants), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: 'Failed to search restaurants' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

import { searchRestaurantsBySearchQuery } from '@/lib/db/dbOperations';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const { restaurants, totalCount } = await searchRestaurantsBySearchQuery(query, { page, limit });

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
