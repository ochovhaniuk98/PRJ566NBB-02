// src/components/blogPosts/BlogPost.jsx
import { useEffect, useState } from 'react';
import ReadOnlyEditor from '../tiptap-rich-text-editor/ReadOnlyEditor';

export default function BlogPost({ id }) {
  const [postContent, setPostContent] = useState(null);
  const [postTitle, setPostTitle] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog-posts/get-post-by-id/${id}`);
        if (!res.ok) throw new Error('Failed to fetch post');

        const data = await res.json();

        setPostContent(data?.body || null);
        setPostTitle(data?.title || null);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div className="mt-20">
      {postTitle && <h2 className="simple-editor-content ml-[200px]">{postTitle}</h2>}
      {postContent && <ReadOnlyEditor content={postContent} />}
    </div>
  );
}
