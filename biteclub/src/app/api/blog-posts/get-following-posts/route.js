// src/app/api/blog-posts/get-following-posts/route.js
import { getListOfFollowingBlogPosts } from '@/lib/db/dbOperations';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId') || null;

    // get a list of following posts (posts of people user is following)
    const { posts, totalCount } = await getListOfFollowingBlogPosts(userId, page, limit);

    return new Response(JSON.stringify({ posts, totalCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to find a list of following posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
