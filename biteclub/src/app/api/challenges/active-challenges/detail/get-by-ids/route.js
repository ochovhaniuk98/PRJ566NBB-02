// src/app/api/challenges/active-challenges/detail/get-by-ids/route.js
import { getActiveChallengeDetailByIds } from '@/lib/db/dbOperations';

// Get Active Challenge by ChallengeId and User Id
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');
    const userId = searchParams.get('userId');

    if (!challengeId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing challengeId or userId' }), { status: 400 });
    }

    const activeChallengeDetail = await getActiveChallengeDetailByIds({ challengeId, userId });

    return new Response(JSON.stringify(activeChallengeDetail), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
