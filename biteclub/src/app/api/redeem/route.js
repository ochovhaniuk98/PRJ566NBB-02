import { NextResponse } from 'next/server';
import { getGeneralUserProfileBySupabaseId, redeemPoints, updatePoints } from '@/lib/db/dbOperations';

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      supabaseId,
      reward
    } = body;

    let pointsNeeded = null;
    if (reward == 5) {
      pointsNeeded = 1000;
    } else if (reward == 10) {
      pointsNeeded = 1500;
    } else if (reward == 15) {
      pointsNeeded = 2000;
    } else if (reward == 20) {
      pointsNeeded = 2500;
    } else if (reward == 25) {
      pointsNeeded = 1000;
    }

    // if (!supabaseId || !username) {
    //   return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    // }
    const profile = await getGeneralUserProfileBySupabaseId({ supabaseId });
    console.log("Profile", profile);
    if (profile.numOfPoints < pointsNeeded) {
      return NextResponse.json({ message: 'Insufficient Points' }, { status: 409 });
    }

    const couponCode = redeemPoints(supabaseId, reward)
    if(couponCode) {
      return NextResponse.json({message: "Points successfully redeemed!", couponCode}, {status: 200});
    } else {
      return NextResponse.json({ message: 'Insufficient Points/Coupon already exists' }, { status: 409 });
    }
  } catch (err) {
    console.error('Error redeeming points:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}