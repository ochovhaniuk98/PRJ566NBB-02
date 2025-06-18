import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { User } from '@/lib/model/dbSchema';

export async function POST(req) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: 'Missing or invalid IDs array' }, { status: 400 });
    }

    await dbConnect();

    // IDs needs to be ObjectIds (Mongoose)
    const users = await User.find({ _id: { $in: ids } });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error('Error fetching user profiles:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
