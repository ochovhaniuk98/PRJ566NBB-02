// src/app/api/users/get-general-user-by-MgId/route.js
// get general user
// passed MongoDb id in request
import { getGeneralUserProfileByMongoId } from '@/lib/db/dbOperations';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mongoId = searchParams.get('id');

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
