import { NextResponse } from 'next/server';
import { getGeneralUserProfileByMongoId } from '@/lib/db/dbOperations';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mongoId = searchParams.get('dbId');

    if (!mongoId) {
      return NextResponse.json({ message: '(api/getGeneralUserProfile) Missing database Id' }, { status: 400 });
    }

    const profile = await getGeneralUserProfileByMongoId(mongoId);

    if (!profile) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
    // [!] Important: When calling this API and using res.json(),
    // make sure to destructure using: const { profile } = await res.json();
    // This matches the returned shape: { profile }

  } catch (err) {
    console.error('Error fetching user profile:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
