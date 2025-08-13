import { NextResponse } from 'next/server';
import { User } from '@/lib/model/dbSchema';

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      couponCode
    } = body;

    if (!couponCode) {
      return NextResponse.json({ message: "Please provide a coupon code" }, { status: 400 })
    }
    let user = await User.findOne({ "coupon.code": couponCode });
    if (user == null) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 })
    }

    const value = user.coupon.value;
    user = await User.findOneAndUpdate({ "coupon.code": couponCode }, { "coupon": null }, { new: true });
    console.log(user);
    if (user != null) {
      return NextResponse.json({ message: "Successfully redeemed", value }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 })
    }

  } catch (err) {
    console.error('Error redeeming points:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
