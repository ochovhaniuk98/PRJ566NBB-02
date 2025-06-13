import { getRestaurantNumOfFavourites } from '@/lib/db/dbOperations';

export async function GET(request,  { params }) {
  try {
    const { id } = await params;
    // console.log('received ID:', id)

    const numOfFavourites = await getRestaurantNumOfFavourites(id);

    return new Response(JSON.stringify({ numOfFavourites }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

