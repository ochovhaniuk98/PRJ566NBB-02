// main/blog-posts/[id]/page.js
'use client';
import { useParams } from 'next/navigation';
import BlogPost from '@/components/blogPosts/BlogPost';

export default function BlogPostPage() {
  const { id } = useParams();

  return <BlogPost id={id} />;
}
