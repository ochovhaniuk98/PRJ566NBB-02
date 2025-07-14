// src/app/api/blog-posts/comments/add-like-dislike/route.js

import { addLikeOrDislikeToComment } from '@/lib/db/dbOperations';

export async function POST(request) {
  try {
    const body = await request.json();

    const { commentId, like = false, dislike = false, userId } = body;

    if (!commentId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing comment id and user id' }), {
        status: 400,
      });
    }

    const result = await addLikeOrDislikeToComment({
      commentId,
      like,
      dislike,
      userId,
    });

    return new Response(JSON.stringify({ message: 'Comment created', comment: result }), {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
    });
  }
}
