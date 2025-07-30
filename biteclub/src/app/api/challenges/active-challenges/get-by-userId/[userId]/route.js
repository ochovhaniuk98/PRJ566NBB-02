// src/app/api/challenges/active-challenges/get-by-userId/[userId]/route.js

import { getActiveChallengesByUserId } from '@/lib/db/dbOperations';

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    const activeChallenges = await getActiveChallengesByUserId({ userId: userId });

    return new Response(JSON.stringify(activeChallenges), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
