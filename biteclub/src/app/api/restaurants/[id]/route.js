import { getRestaurantById, updateRestaurant } from '@/lib/db/dbOperations';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Fetch the restaurant data from the database using the provided ID
    const restaurant = await getRestaurantById(id);

    // If the restaurant is not found, return a 404 response
    if (!restaurant) {
      return new Response(JSON.stringify({ error: 'Restaurant not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the restaurant data as a JSON response
    return new Response(JSON.stringify(restaurant), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate the request body
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the restaurant in the database
    const updatedRestaurant = await updateRestaurant(id, body);

    // If the restaurant is not found, return a 404 response
    if (!updatedRestaurant) {
      return new Response(JSON.stringify({ error: 'Restaurant not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the updated restaurant data as a JSON response
    return new Response(JSON.stringify(updatedRestaurant), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
