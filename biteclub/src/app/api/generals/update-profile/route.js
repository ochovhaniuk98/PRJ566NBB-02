import { NextResponse } from 'next/server';
import { updateGeneralUsername } from '@/lib/db/dbOperations';

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      supabaseId,
      username,
      userBio,
      displayFavouriteRestaurants,
      displayFavouriteBlogPosts,
      displayVisitedPlaces,
      feedPersonalization
    } = body;

    // if (!supabaseId || !username) {
    //   return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    // }

    const updatedUser = await updateGeneralUsername({
      supabaseId,
      username,
      userBio,
      displayFavouriteRestaurants,
      displayFavouriteBlogPosts,
      displayVisitedPlaces,
      feedPersonalization
    });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found or not general type' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User profile updated', user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error('Error updating user profile:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
