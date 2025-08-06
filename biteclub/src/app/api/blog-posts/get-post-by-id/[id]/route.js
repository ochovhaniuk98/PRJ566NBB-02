// api/blog-posts/get-post-by-id/[id]/route.js
import { getBlogPost } from '@/lib/db/dbOperations';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // blog post id

    const post = await getBlogPost({ id });

    if (!post) {
      return new Response(JSON.stringify({ error: 'Blog post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
