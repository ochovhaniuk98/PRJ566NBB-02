'use client';
import { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import BlogPostCard from '../shared/BlogPostCard';
import { Button } from '../shared/Button';
import { createClient } from '@/lib/auth/client';
import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';

export default function FollowingBlogPosts() {
  const [userMongoId, setUserMongoId] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const scrollPositionRef = useRef(0);

  // for blog posts' Masonry grid
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.getUser();
        if (authError || !data.user) throw new Error('User not authenticated');

        const id = await getGeneralUserMongoIDbySupabaseId({ supabaseId: data.user.id });
        console.log('(userDashboard) MONGOID:', id);
        if (!id) throw new Error('MongoDB ID not found');
        setUserMongoId(id);
      } catch (error) {
        console.error('Failed to fetch user MongoDB id:', error);
      }
    };

    fetchUserId();
  }, []);

  // fetch Exploring blog posts
  const fetchExploringPosts = async (reset = false) => {
    setFetchCompleted(false);

    try {
      const res = await fetch(`/api/blog-posts/get-following-posts?page=${page}&limit=20&userId=${userMongoId}`);
      const data = await res.json();

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

      // if we've fetched everything, stop loading more
      if ((reset ? data?.posts?.length : blogPosts?.length + data?.posts?.length) >= data?.totalCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setFetchCompleted(true);
    } catch (error) {
      setFetchCompleted(true);
      console.error('Failed to fetch exploring blog posts:', error);
    }
  };

  // get user mongoDB id
  //   const fetchUserId = async () => {
  //     try {
  //       const supabase = createClient();

  //       const { data, error: authError } = await supabase.auth.getUser();

  //       if (authError || !data.user) {
  //         throw new Error('User not authenticated');
  //       }

  //       const user = data.user;
  //       const id = await getGeneralUserMongoIDbySupabaseId({ supabaseId: user.id });
  //       console.log(`(userDashboard) MONGOID: `, id);

  //       if (!id) {
  //         throw new Error('MongoDB ID not found');
  //       }

  //       setUserMongoId(id);
  //     } catch (error) {
  //       console.error('Failed to fetch user mongoDb id:', error);
  //     }
  //   };

  // page = 1
  useEffect(() => {
    if (userMongoId) {
      fetchExploringPosts(true);
    }
  }, [userMongoId]);

  // when page > 1
  useEffect(() => {
    if (page > 1 && userMongoId) {
      fetchExploringPosts();
    }
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
    setPage(prev => prev + 1);
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
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button onClick={loadMore}>Load More</Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
