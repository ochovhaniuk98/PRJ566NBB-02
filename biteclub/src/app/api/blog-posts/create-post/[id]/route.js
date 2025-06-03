// api/blog-posts/create-post/[id]/route.js
// id - is the user Mongodb ID

// get title and content, create a blog post, and set the user reference
// add the blog post's ID to the user's "myBlogPosts" array

import { createBlogPost } from '@/lib/db/dbOperations';

export async function POST(request, { params }) {
  try {
    const { id } = await params; // extract userId from URL param
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Missing title or content' }), { status: 400 });
    }

    const result = await createBlogPost({ title, content, userId: id });

    if (!result) {
      return new Response(JSON.stringify({ error: 'Failed to create blog post or user not found' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Blog Post successfully created', blogPost: result }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
