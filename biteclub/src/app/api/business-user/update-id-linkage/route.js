import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { BusinessUser } from '@/lib/model/dbSchema';

export async function POST(request) {
  await dbConnect();

  try {
    const { supabaseId, restaurantId } = await request.json();

    if (!supabaseId || !restaurantId) {
      return NextResponse.json({ error: 'Missing supabaseId or restaurantId' }, { status: 400 });
    }

    const updatedUser = await BusinessUser.findOneAndUpdate(
      { supabaseId }, // find with supabaseId
      { restaurantId: restaurantId}, // update restaurantId to BusinessUser Schema
      { new: true, upsert: false } // no user will be created if not found
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Restaurant linked', user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
