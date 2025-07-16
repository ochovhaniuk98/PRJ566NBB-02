// src/app/api/blog-posts/get-exploring-posts/route.js

import { getListOfExploringBlogPosts } from '@/lib/db/dbOperations';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // get a list of exploring posts (popular and new)
    const { posts, totalCount } = await getListOfExploringBlogPosts(page, limit);

    return new Response(JSON.stringify({ posts, totalCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to find a list of exploring posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
