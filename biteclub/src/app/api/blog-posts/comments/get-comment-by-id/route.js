// src/app/api/blog-posts/comments/get-comment-by-id/route.js
// get comment by comment id
import { getPostComment } from '@/lib/db/dbOperations';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return new Response(JSON.stringify({ error: 'Missing commentId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const comment = await getPostComment({ commentId });

    return new Response(JSON.stringify(comment), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-comment-by-id:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
