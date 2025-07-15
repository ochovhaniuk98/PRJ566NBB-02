import { NextResponse } from 'next/server';
import { getBusinessUserProfileBySupabaseId } from '@/lib/db/dbOperations';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const supabaseId = searchParams.get('authId');

    if (!supabaseId) {
      return NextResponse.json({ message: 'Missing authId' }, { status: 400 });
    }

    const profile = await getBusinessUserProfileBySupabaseId({ supabaseId });

    if (!profile) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    console.error('Error fetching business user profile:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
