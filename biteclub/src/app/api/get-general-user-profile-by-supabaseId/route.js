import { NextResponse } from 'next/server';
import { getGeneralUserProfileBySupabaseId } from '@/lib/db/dbOperations';

export async function POST(req) {
  try {
    const body = await req.json();
    const { supabaseId } = body;

    if (!supabaseId) {
      return NextResponse.json({ message: 'Missing supabaseId' }, { status: 400 });
    }

    const profile = await getGeneralUserProfileBySupabaseId({ supabaseId });

    if (!profile) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });

  } catch (err) {
    console.error('Error fetching user profile:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
