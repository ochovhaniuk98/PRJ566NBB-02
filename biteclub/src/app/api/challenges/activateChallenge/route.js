// src/app/api/challenges/active-challenges/detail/get-by-ids/route.js
import { ActivateChallengeDetail, Challenge } from '@/lib/model/dbSchema';

// Get Active Challenge by ChallengeId and User Id
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Body", body);
    const challenge = body.challenge;
    const uid = body.userId
    let ret = await Challenge.create(
      challenge
    )
    console.log("created challenge", ret);
    ret = await ActivateChallengeDetail.create({
      userId: uid, challengeId: ret._id, challengeSteps: ret.restaurants.map(res => { return { verificationStatus: false, restaurantId: res, _id: res } }),
      completionStatus: "in-progress", startDate: new Date(), endDate: new Date(Date.now() + challenge.duration * 24 * 60 * 60 * 1000), __v: 0
    })
    console.log("created challenge activated", ret);

    return new Response(JSON.stringify(ret), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
