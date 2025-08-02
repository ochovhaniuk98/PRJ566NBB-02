// src/app/api/blog-posts/add-like-dislike/route.js
import { addLikeOrDislikeToPost } from '@/lib/db/dbOperations';

export async function POST(request) {
  try {
    const body = await request.json();

    const { postId, like = false, dislike = false, userId } = body;

    if (!postId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing postId or user id' }), {
        status: 400,
      });
    }

    const result = await addLikeOrDislikeToPost({
      postId,
      like,
      dislike,
      userId,
    });

    return new Response(JSON.stringify({ message: 'Like/DIslike added to a Blog Post', comment: result }), {
      status: 201,
    });
  } catch (error) {
    console.error('Error adding like/dislike to a blog post:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
    });
  }
}
