// src/app/api/blog-posts/comments/add-comment/route.js

import { createPostComment } from '@/lib/db/dbOperations';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      blogPostId, // required
      parent_id = null,
      avatarURL,
      content, // required
      author, // required (MongoDB user _id)
      date_posted = Date.now(),
      user,
    } = body;

    if (!blogPostId || !content || !user) {
      return new Response(JSON.stringify({ error: 'Missing blogPostId, content, or author' }), {
        status: 400,
      });
    }

    const result = await createPostComment({
      blogPostId,
      parent_id,
      avatarURL,
      content,
      author,
      date_posted,
      user,
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
