// src/components/blogPosts/BlogPost.jsx
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';
import ReadOnlyEditor from '../tiptap-rich-text-editor/ReadOnlyEditor';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function BlogPost({ id }) {
  const [postContent, setPostContent] = useState(null);
  const [postTitle, setPostTitle] = useState(null);
  const [numOfFavourites, setNumOfFavourites] = useState(0);

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
      } catch (error) {
        console.error('Error fetching blog post or favourites:', error);
      }
    };

    fetchAll();
  }, [id]);


  // When user save blog-post as favourite
  const handleFavouriteBlogPostClick = async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user?.id) throw new Error('User not logged in');

      const res = await fetch('/api/blog-posts/save-as-favourite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: id,
          supabaseUserId: data.user.id,
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

  return (
    <div className="mt-20">
      <SingleTabWithIcon icon={faHeart} detailText={numOfFavourites ?? 0} onClick={handleFavouriteBlogPostClick} />
      {postTitle && <h2 className="simple-editor-content ml-[200px]">{postTitle}</h2>}
      {postContent && <ReadOnlyEditor content={postContent} />}
    </div>
  );
}
