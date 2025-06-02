import { NextResponse } from 'next/server';
import { getGeneralUserProfileByMongoId } from '@/lib/db/dbOperations';

export async function POST(req) {
  try {
    const body = await req.json();
    const { generalUserId } = body; // user mongoID

    if (!generalUserId) {
      return NextResponse.json({ message: '(api/getGeneralUserProfile) Missing mongoId' }, { status: 400 });
    }

    const profile = await getGeneralUserProfileByMongoId({ mongoId: generalUserId });

    if (!profile) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });

  } catch (err) {
    console.error('Error fetching user profile:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
