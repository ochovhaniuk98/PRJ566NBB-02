// src/components/blogPosts/BlogPost.jsx
import { useEffect, useState } from 'react';
// import { createClient } from '@/lib/auth/client';
import { useUser } from '@/context/UserContext';
import ReadOnlyEditor from '../tiptap-rich-text-editor/ReadOnlyEditor';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faFlag } from '@fortawesome/free-solid-svg-icons';
import ReportForm from '../shared/ReportForm';
import CommentThread from '../shared/CommentThread';

export default function BlogPost({ id }) {
  const [blogPost, setBlogPost] = useState(null);
  const [postContent, setPostContent] = useState(null);
  const [postTitle, setPostTitle] = useState(null);
  const [numOfFavourites, setNumOfFavourites] = useState(0);

  // for reporting a post
  const [openReportForm, setOpenReportForm] = useState(false);
  const [reportedUser, setReportedUser] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      try {
        const [postRes, favouritesRes] = await Promise.all([
          fetch(`/api/blog-posts/get-post-by-id/${id}`),
          fetch(`/api/blog-posts/num-of-favourites/${id}`),
        ]);

        if (!postRes.ok || !favouritesRes.ok) {
          throw new Error('Fetch failed');
        }

        const postData = await postRes.json();
        const favouritesData = await favouritesRes.json();

        setPostContent(postData?.body || null);
        setPostTitle(postData?.title || null);
        setNumOfFavourites(favouritesData.numOfFavourites);
        setBlogPost(postData);

        // for reporting a post
        fetchReportedUser(postData.user_id);
      } catch (error) {
        console.error('Error fetching blog post or favourites:', error);
      }
    };

    fetchAll();
  }, [id]);

  // When user save blog-post as favourite
  const handleFavouriteBlogPostClick = async () => {
    try {
      // const supabase = createClient();

      // const { data, error } = await supabase.auth.getUser();
      // if (error || !data?.user?.id) throw new Error('User not logged in');
      if (!user?.id) return; // Wait until user is available

      const res = await fetch('/api/blog-posts/save-as-favourite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: id,
          // supabaseUserId: data.user.id,
          supabaseUserId: user.id,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to toggle favourite');

      // Re-fetch the updated Favourite count immediately from backend
      const countRes = await fetch(`/api/blog-posts/num-of-favourites/${id}`);
      if (!countRes.ok) {
        throw new Error('Failed to fetch updated favourite count');
      }

      const countData = await countRes.json();
      setNumOfFavourites(countData.numOfFavourites);
    } catch (err) {
      console.error('Error toggling favourite:', err.message);
    }
  };

  // for reporting a post
  // get reported user object
  const fetchReportedUser = async id => {
    try {
      if (id) {
        const res = await fetch(`/api/users/get-general-user-by-MgId?id=${id}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const reportedUser = await res.json();

        setReportedUser(reportedUser);
        console.log('reportedUser', reportedUser);
      }
    } catch (error) {
      console.error('Failed to fetch reported User:', error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex-[3] mt-20">
        <div className="flex flex-row gap-x-4">
          <SingleTabWithIcon icon={faHeart} detailText={numOfFavourites ?? 0} onClick={handleFavouriteBlogPostClick} />

          {/* show Report form when flag icon is clicked */}
          <div
            className="font-primary font-semibold text-brand-navy flex items-center gap-x-2 cursor-pointer"
            onClick={e => {
              setOpenReportForm(prev => !prev);
            }}
          >
            <FontAwesomeIcon icon={faFlag} className={`icon-lg text-brand-navy`} />
            Report Content
          </div>
        </div>
        {postTitle && <h2 className="simple-editor-content ml-[200px]">{postTitle}</h2>}
        {postContent && <ReadOnlyEditor content={postContent} />}
        {/* Report Content Form */}
        {openReportForm && (
          <ReportForm
            onClose={() => setOpenReportForm(false)}
            contentTitle={postTitle}
            contentType="BlogPost"
            contentId={blogPost._id}
            reportedUser={reportedUser}
          />
        )}
      </div>
      {/* comments thread for blog post */}
      <div className="flex-[1]">
        <CommentThread post={blogPost} />
      </div>
    </div>
  );
}
