// app/api/users/search/route.js

import { searchUsersByQuery } from '@/lib/db/dbOperations';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const { users, totalCount } = await searchUsersByQuery(query, { page, limit });

    return new Response(JSON.stringify({ users, totalCount }), {
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
