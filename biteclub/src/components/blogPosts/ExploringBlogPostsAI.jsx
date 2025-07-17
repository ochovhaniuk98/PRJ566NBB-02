'use client';
import { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import BlogPostCard from '../shared/BlogPostCard';

export default function ExploringBlogPostsAI() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const scrollPositionRef = useRef(0);

  // for blog posts' Masonry grid
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  // fetch Exploring blog posts
  const fetchExploringPosts = async (reset = false) => {
    setFetchCompleted(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_RECOMMENDER_URL}/blogposts/posts?limit=10&offset=${(page-1)*20}`);
      const data = await res.json();
      console.log(data)

      if (reset) {
        setPage(1);
        setBlogPosts(data.posts);
      } else {
        // append data to existing list
        setBlogPosts(prev => {
          const ids = new Set(prev.map(post => post._id));
          const newOnes = data.posts.filter(post => !ids.has(post._id)); // avoid duplicates
          return [...prev, ...newOnes];
        });
      }

      setFetchCompleted(true);
    } catch (error) {
      setFetchCompleted(true);
      console.error('Failed to fetch exploring blog posts:', error);
    }
  };

  // page = 1
  useEffect(() => {
    fetchExploringPosts(true); // reset = true
  }, []);

  // when page > 1
  useEffect(() => {
    fetchExploringPosts();
  }, [page]);

  useEffect(() => {
    if (page > 1 && fetchCompleted) {
      // restore exact user's scroll position
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
    }
  }, [blogPosts]);

  const loadMore = () => {
    // save current vertical scroll position before state update
    scrollPositionRef.current = window.scrollY;
    setPage(prev => prev+1);
  };

  return (
    <>
      {fetchCompleted && (
        <>
          <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2 mt-4" columnClassName="space-y-2">
            {blogPosts.map((post, i) => (
              <BlogPostCard key={post._id || i} blogPostData={post} />
            ))}
          </Masonry>
        </>
      )}
    </>
  );
}