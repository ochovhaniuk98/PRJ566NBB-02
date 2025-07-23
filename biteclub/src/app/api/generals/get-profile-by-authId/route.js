import { NextResponse } from 'next/server';
import { getGeneralUserProfileBySupabaseId } from '@/lib/db/dbOperations';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const supabaseId = searchParams.get('authId');

    if (!supabaseId) {
      return NextResponse.json({ message: 'Missing supabaseId' }, { status: 400 });
    }

    const profile = await getGeneralUserProfileBySupabaseId({ supabaseId });

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
