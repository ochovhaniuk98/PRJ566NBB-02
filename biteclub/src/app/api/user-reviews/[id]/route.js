import { getUserReviews } from '@/lib/db/dbOperations';

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'User ID is missing' }), { status: 400 });
  }

  try {
    // Fetch the user reviews from the database using the provided ID
    const reviews = await getUserReviews(id);

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
