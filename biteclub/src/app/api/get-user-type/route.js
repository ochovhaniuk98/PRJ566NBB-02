// biteclub/src/app/api/get-user-type/route.js
// Get userType from MongoDB using supabaseID

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { User, BusinessUser } from '@/lib/model/dbSchema';


export async function POST(req) {
  try {
    const body = await req.json();
    const { supabaseId } = body;

    if (!supabaseId) {
      return NextResponse.json({ message: 'Missing Supabase ID' }, { status: 400 });
    }

    await dbConnect();

    let user = await User.findOne({ supabaseId });
    if (!user) user = await BusinessUser.findOne({ supabaseId });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ userType: user.userType }, { status: 200 });

  } catch (err) {
    console.error('Error fetching userType:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
