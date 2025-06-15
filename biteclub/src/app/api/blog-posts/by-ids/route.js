import dbConnect from '@/lib/db/dbConnect';
import { BlogPost } from '@/lib/model/dbSchema';
import { formatBlogPost } from '@/lib/utils/formatBlogPost';

// GET blog posts by blogPostIds
// Reason of Using POST over GET:
// "When you have large number of uuids, you can reach url length limit"
// See: https://www.reddit.com/r/softwarearchitecture/comments/11kz22e/when_should_we_use_post_over_get_method_to/

export async function POST(request) {
  try {
    const { ids } = await request.json();
    await dbConnect();

    const posts = await BlogPost.find({ _id: { $in: ids } });
    const formatted = posts.map(formatBlogPost);

    return new Response(JSON.stringify({ posts: formatted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
