// api/blog-posts/get-posts-by-userId/[id]/route.js
// get blog post by user id

import { getBlogPosts } from '@/lib/db/dbOperations';
import { formatBlogPost } from '@/lib/utils/formatBlogPost';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // user id
    const posts = await getBlogPosts({ userId: id });
    const formattedPostsWithPreview = posts.map(formatBlogPost);

    return new Response(JSON.stringify(formattedPostsWithPreview), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
