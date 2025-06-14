import { addInternalReview } from '@/lib/db/dbOperations';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, restuarantId, review } = body;

    if (!userId || !restuarantId || !review) {
      return new Response(JSON.stringify({ error: 'User ID and review content are required' }), { status: 400 });
    }

    const savedReview = await addInternalReview({
      userId,
      restaurantId,
      review,
    });

    if (!savedReview) {
      throw new Error('Failed to save review or user not found');
    }

    return new Response(JSON.stringify(savedReview), {
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
