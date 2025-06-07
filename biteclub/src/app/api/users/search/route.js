// app/api/users/search/route.js

import { searchUsersByQuery } from '@/lib/db/dbOperations';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    const users = await searchUsersByQuery(query);

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to search users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
