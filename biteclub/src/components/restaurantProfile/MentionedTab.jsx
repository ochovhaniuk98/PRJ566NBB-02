import { getBlogsMentioningRestaurant } from '@/lib/db/dbOperations';
import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import BlogPostCard from '../shared/BlogPostCard';

export default function MentionedTab({ restaurantId }) {
  const [blogPosts, setBlogPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        const blogPost = await getBlogsMentioningRestaurant(restaurantId.toString());
        setBlogPosts(blogPost);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
        setBlogPosts(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [restaurantId]);

  if (loading)
    return (
      <div className="mb-8 p-16">
        <p>Loading...</p>
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!blogPosts || blogPosts.length === 0) return <div>No mentions found.</div>;

  // for blog posts' Masonry grid
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2" columnClassName="space-y-2">
      {blogPosts.map(post => (
        <BlogPostCard key={post._id} blogPostData={post} />
      ))}
    </Masonry>
  );
}
