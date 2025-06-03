// src/components/blogPosts/BlogPost.jsx
import { useEffect, useState } from 'react';

export default function BlogPost({ id }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog-posts/get-post-by-id/${id}`);
        if (!res.ok) throw new Error('Failed to fetch post');

        const data = await res.json();

        setPost(data || null); //?? data[0]
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchPost();
  }, [id]);
}
