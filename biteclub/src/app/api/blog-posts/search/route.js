// app/api/blog-posts/search/route.js

import { searchBlogPostsByQuery } from '@/lib/db/dbOperations';

// extract body for preview
function extractPreviewText(body) {
  if (!body || !body.content) return '';

  const firstParagraph = body.content.find(block => block.type === 'paragraph');

  if (!firstParagraph || !firstParagraph.content) return '';

  const text = firstParagraph.content.map(segment => segment.text || '').join('');

  return text.length > 160 ? text.slice(0, 157) + '...' : text; // return only 160 chars
}

// extract one image for preview
function extractPreviewImage(body) {
  if (!body || !body.content) return null;

  const imageBlock = body.content.find(block => block.type === 'image');
  return imageBlock?.attrs?.src || null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const { posts, totalCount } = await searchBlogPostsByQuery(query, { page, limit });

    // add previewText to each post
    const postsWithPreview = posts.map(post => ({
      ...post.toObject(), // convert mongoose doc to plain object
      previewTitle: post.title.length > 50 ? post.title.slice(0, 33) + '...' : post.title, // allow only 50 chars for title preview
      previewText: extractPreviewText(post.body),
      previewImage: extractPreviewImage(post.body),
    }));

    return new Response(JSON.stringify({ postsWithPreview, totalCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to search posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
