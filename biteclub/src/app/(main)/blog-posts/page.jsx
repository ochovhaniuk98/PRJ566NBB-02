import { Suspense } from 'react';
import BlogPostsList from '@/components/blogPosts/BlogPostsList';

export default function BlogPostsResults() {
  return (
    <Suspense fallback={<div>Loading Blog Posts results…</div>}>
      <BlogPostsList />
    </Suspense>
  );
}
