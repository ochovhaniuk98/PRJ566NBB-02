// scripts/create-activated-challenge.js
import mongoose from 'mongoose';
import dbConnect from '../src/lib/db/dbConnect.js';
import { Challenge, ActivateChallengeDetail } from '../src/lib/model/dbSchema.js';

// activating one challenge for Olha
async function createActivatedChallenge() {
  await dbConnect();

  // get challenge
  const challenge = await Challenge.findById('6883d3eb558cca2944122e5b');

  const challengeSteps = challenge.restaurants.map(rid => ({
    restaurantId: rid,
    verificationStatus: false,
  }));

  const activatedChallenge = new ActivateChallengeDetail({
    userId: '6831f193ce0d8ebd1ea4877f',
    challengeId: challenge._id,
    challengeSteps: challengeSteps,
    completionStatus: 'in-progress',
    startDate: new Date('2025-07-01T00:00:00Z'),
    endDate: new Date('2025-08-15T00:00:00Z'),
  });

  try {
    await activatedChallenge.save();
    console.log('Challenge activated successfully:', activatedChallenge);
  } catch (err) {
    console.error('Error saving challenge:', err);
  } finally {
    mongoose.connection.close();
  }
}

createActivatedChallenge();
