import dbConnect from '@/lib/db/dbConnect';
import { BlogPost } from '@/lib/model/dbSchema';

// GET blog posts by blogblogIds
// Reason of Using POST over GET:
// "When you have large number of uuids, you can reach url length limit"
// See: https://www.reddit.com/r/softwarearchitecture/comments/11kz22e/when_should_we_use_post_over_get_method_to/

export async function POST(req) {
  try {
    const { ids } = await req.json();
    await dbConnect();

    const posts = await BlogPost.find({
      _id: { $in: ids },
    })
      .populate('user_id', 'username userProfilePicture')
      .select('-__v -body -mentions -title -comments -images -Instagram_posts')
      .lean();

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
