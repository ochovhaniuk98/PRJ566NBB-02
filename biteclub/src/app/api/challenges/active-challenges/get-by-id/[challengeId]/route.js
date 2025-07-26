// src/app/api/challenges/active-challenges/get-by-id/[id]/route.js
import { getActiveChallengeById } from '@/lib/db/dbOperations';

// Get Active Challenge by ChallengeId
export async function GET(request, { params }) {
  try {
    const { challengeId } = await params;
    const activeChallenge = await getActiveChallengeById({ challengeId: challengeId });

    return new Response(JSON.stringify(activeChallenge), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
