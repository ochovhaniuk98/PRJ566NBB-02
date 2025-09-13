'use client';
import { useState } from 'react';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import BlogPostListTabs from './BlogPostListTabs';
import ExploringBlogPosts from './ExploringBlogPosts';
import FollowingBlogPosts from './FollowingBlogPosts';

// check if blog posts are in exploring or following section
export default function BlogPostsList() {
  const [selectedTab, setSelectedTab] = useState('EXPLORE');

  return (
    <div className="md:pl-12">
      <div className="mb-16 w-full flex flex-col items-center py-18">
        <div className={'w-full h-full'}>
          <div className="flex md:flex-row flex-col justify-between">
            <h2>Trending + Recently Posted</h2>
            {/* tabs for selecting blog posts: Explore vs Following */}
            <BlogPostListTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          </div>
          {/* Pass Blog Posts for Exploring */}
          {selectedTab === 'EXPLORE' && <ExploringBlogPosts />}
          {/* Pass Blog Posts of Followed Users */}
          {selectedTab === 'FOLLOWING' && <FollowingBlogPosts />}
        </div>
      </div>
    </div>
  );
}
