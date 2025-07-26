// src/app/api/challenges/all-challenges/get-by-challengeId/[challengeId]/route.js
import { getChallengeByChallengeId } from '@/lib/db/dbOperations';

export async function GET(request, { params }) {
  try {
    const { challengeId } = await params;
    const challenge = await getChallengeByChallengeId({ challengeId: challengeId });

    return new Response(JSON.stringify(challenge), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
