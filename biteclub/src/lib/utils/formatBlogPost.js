// extract body for preview
export function extractPreviewText(body) {
  if (!body || !body.content) return '';
  const firstParagraph = body.content.find(block => block.type === 'paragraph');
  if (!firstParagraph || !firstParagraph.content) return '';
  const text = firstParagraph.content.map(segment => segment.text || '').join('');
  return text.length > 160 ? text.slice(0, 157) + '...' : text; // return only 160 chars
}

// extract one image for preview
export function extractPreviewImage(body) {
  if (!body || !body.content) return null;
  const imageBlock = body.content.find(block => block.type === 'image');
  return imageBlock?.attrs?.src || null;
}

export function formatBlogPost(post) {
  const plain = post.toObject?.() ?? post; // convert mongoose doc to plain object
  return {
    ...plain,
    previewTitle: plain.title?.length > 50 ? plain.title.slice(0, 33) + '...' : plain.title, // allow only 50 chars for title preview
    previewText: extractPreviewText(plain.body),
    previewImage: extractPreviewImage(plain.body),
  };
}
