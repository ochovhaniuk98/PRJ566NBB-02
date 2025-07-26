// src/app/api/challenges/active-challenges/detail/update/route.js

import { NextResponse } from 'next/server';
import { updateActiveChallengeDetail } from '@/lib/db/dbOperations';

export async function PUT(req) {
  try {
    const { activeChallengeDetailId, challengeSteps } = await req.json();

    if (!activeChallengeDetailId || !Array.isArray(challengeSteps)) {
      return NextResponse.json(
        { error: 'Invalid data: activeChallengeDetailId and challengeSteps are required' },
        { status: 400 }
      );
    }

    const updatedChallenge = await updateActiveChallengeDetail({
      activeChallengeDetailId,
      challengeSteps,
    });

    return NextResponse.json({ message: 'Challenge updated successfully', updatedChallenge }, { status: 200 });
  } catch (err) {
    console.error('Error updating challenge detail:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
