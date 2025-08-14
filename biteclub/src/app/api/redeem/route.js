import { NextResponse } from 'next/server';
import { redeemPoints } from '@/lib/db/dbOperations';

export async function POST(req) {
  try {
    const body = await req.json();
    const { mongoId, reward, pointsNeeded } = body;

    const couponCode = await redeemPoints(mongoId, reward, pointsNeeded);
    console.log('Coupon Code received: ', couponCode);

    if (couponCode) {
      return NextResponse.json({ message: 'Points successfully redeemed!', couponCode }, { status: 200 });
    }
  } catch (err) {
    console.error('Error redeeming points:', err);
    if (err.message === 'Insufficient Points' || err.message === 'Coupon already exists') {
      return NextResponse.json({ message: err.message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
