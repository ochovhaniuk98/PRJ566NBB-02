// src/app/api/users/get-general-user/route.js
// get general user
// passed supabase id in request
import { getGeneralUserMongoIDbySupabaseId, getGeneralUserProfileByMongoId } from '@/lib/db/dbOperations';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabaseId = searchParams.get('id');

    if (!supabaseId) {
      return new Response(JSON.stringify({ error: 'Missing Supabase ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // get mongo id of the user
    const mongoId = await getGeneralUserMongoIDbySupabaseId({ supabaseId });
    if (!mongoId) {
      return new Response(JSON.stringify({ error: 'MongoDB ID not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // get user
    const user = await getGeneralUserProfileByMongoId(mongoId);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch user MongoDB id:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
