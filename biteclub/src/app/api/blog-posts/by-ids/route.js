import dbConnect from '@/lib/db/dbConnect';
import { BlogPost } from '@/lib/model/dbSchema';

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

export async function POST(request, { params }) {
  try {
    const { ids } = await request.json();
    await dbConnect();

    const posts = await BlogPost.find({
      _id: { $in: ids },
    });

    // add previewText to each post
    const postsWithPreview = posts.map(post => ({
      ...post.toObject(), // convert mongoose doc to plain object
      previewTitle: post.title.length > 50 ? post.title.slice(0, 33) + '...' : post.title, // allow only 50 chars for title preview
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



