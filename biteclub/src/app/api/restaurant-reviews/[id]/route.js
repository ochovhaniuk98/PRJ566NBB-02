import { getRestaurantReviews } from '@/lib/db/dbOperations';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Fetch the restaurant reviews from the database using the provided ID
    const reviews = await getRestaurantReviews(id);

    // If no reviews are found, return an empty array
    if (!reviews) {
      return new Response(JSON.stringify({ reviews: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the reviews as a JSON response
    return new Response(JSON.stringify(reviews), {
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
