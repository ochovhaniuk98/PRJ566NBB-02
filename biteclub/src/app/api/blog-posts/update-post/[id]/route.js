// update-post

import dbConnect from '@/lib/db/dbConnect';
import { BlogPost } from '@/lib/model/dbSchema';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, content } = await request.json();

    if (!id || !title || !content) {
      return new Response(JSON.stringify({ error: 'Missing ID, title or content' }), { status: 400 });
    }

    await dbConnect();

    const blocks = content?.content;

    // Build previewText (first paragraph)
    let previewText = '';
    if (Array.isArray(blocks)) {
      const firstParagraph = blocks.find(block => block.type === 'paragraph');
      if (firstParagraph?.content) {
        const text = firstParagraph.content.map(segment => segment.text || '').join('');
        previewText = text.length > 160 ? text.slice(0, 157) + '...' : text;
      }
    }

    // Build previewImage (first image block)
    let previewImage = null;
    if (Array.isArray(blocks)) {
      const imageBlock = blocks.find(block => block.type === 'image');
      previewImage = imageBlock?.attrs?.src || null;
    }

    const previewTitle = title.length > 50 ? title.slice(0, 33) + '...' : title;

    const updated = await BlogPost.findByIdAndUpdate(
      id,
      {
        title,
        body: content,
        previewTitle,
        previewText,
        previewImage,
      },
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ error: 'Blog post not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Blog post updated', blogPost: updated }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Server error' }), { status: 500 });
  }
}
