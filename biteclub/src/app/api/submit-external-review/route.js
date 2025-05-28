import { addExternalReview } from '@/lib/db/dbOperations';

export async function POST(request) {
  try {
    const { embedLink, userId, restaurantId } = await request.json();

    // Validate input
    if (!embedLink || !restaurantId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add the external review to the database
    const newReview = await addExternalReview(embedLink, userId, restaurantId);

    // Return the newly created review
    return new Response(JSON.stringify(newReview), {
      status: 201,
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
