import dbConnect from '@/lib/db/dbConnect';
import { ActivateChallengeDetail } from '@/lib/model/dbSchema';

export async function GET() {
  await dbConnect();

  const now = new Date();

  const leaderboard = await ActivateChallengeDetail.aggregate([
    {
      $match: {
        startDate: { $lte: now },       // startDate <= now (it started already)
        endDate: { $gte: now },         // endDate >= now (it hasn’t ended yet)
        completionStatus: 'completed',  // only counts all the completed ones
      },
    },
    {
    // the user who completed the most challenges will be on top.
    /*
    [
        { _id: user1, numChallengesCompleted: 10 },
        { _id: user2, numChallengesCompleted: 8 },
        { _id: user3, numChallengesCompleted: 7 },
        ...
    ]
    */
      $group: {
        _id: '$userId',
        numChallengesCompleted: { $sum: 1 },
      },
    },
    {
      $sort: { numChallengesCompleted: -1 }, // descending
    },
    {
    // join ActivateChallengeDetail with User
      $lookup: {        // Attach user details
        from: 'users',  // MongoDB collection for users
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user', // turn the joined array into a single object per user
    },
  ]);

  // Filter top 5 unique scores (include all ties)
  const result = [];
  const uniqueScores = new Set(); // track unique scores.

  for (const item of leaderboard) {
    if (uniqueScores.size < 5 || uniqueScores.has(item.numChallengesCompleted)) {
      result.push(item);
      uniqueScores.add(item.numChallengesCompleted); // If score already exists in the set, also push (to allow ties)
    } else {
      break; // Stop when we pass 5 unique scores.
    }
  }

  return Response.json(result);
}
