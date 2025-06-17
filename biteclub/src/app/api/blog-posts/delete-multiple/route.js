import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { User, BlogPost } from '@/lib/model/dbSchema';

// Reason to use POST (instead of DELETE):
// If you're sending a body with an array of IDs, POST is actually more compatible and safer in practice:
// DELETE requests should not technically have a body according to the HTTP spec.
// Some clients, proxies, or servers might drop or ignore the body of a DELETE request entirely.
// With POST, you avoid this risk and can freely pass structured JSON like { ids: [...] }.
export async function POST(req) {
  try {
    const body = await req.json();
    const { ids, userId } = body;

    if (!Array.isArray(ids) || ids.length === 0 || !userId) {
      return NextResponse.json({ error: 'Missing blog post IDs or user ID' }, { status: 400 });
    }

    await dbConnect();

    // Delete blog posts
    await BlogPost.deleteMany({ _id: { $in: ids }, user_id: userId });

    // Pull the blog post references from user's `myBlogPosts` array
    await User.findByIdAndUpdate(userId, {
      $pull: { myBlogPosts: { $in: ids } },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Error deleting blog posts:', err);
    return NextResponse.json({ error: 'Failed to delete posts' }, { status: 500 });
  }
}