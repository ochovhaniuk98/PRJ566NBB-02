// api/blog-posts/get-posts/[id]/route.js

import { getBlogPosts } from '@/lib/db/dbOperations';

// extract body for preview
function extractPreviewText(body) {
  if (!body || !body.content) return '';

  const firstParagraph = body.content.find(block => block.type === 'paragraph');

  if (!firstParagraph || !firstParagraph.content) return '';

  return firstParagraph.content.map(segment => segment.text || '').join('');
}

// extract one image for preview
function extractPreviewImage(body) {
  if (!body || !body.content) return null;

  const imageBlock = body.content.find(block => block.type === 'image');
  return imageBlock?.attrs?.src || null;
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const posts = await getBlogPosts({ userId: id });

    // add previewText to each post
    const postsWithPreview = posts.map(post => ({
      ...post.toObject(), // convert mongoose doc to plain object
      previewText: extractPreviewText(post.body),
      previewImage: extractPreviewImage(post.body),
    }));

    return new Response(JSON.stringify(postsWithPreview), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
