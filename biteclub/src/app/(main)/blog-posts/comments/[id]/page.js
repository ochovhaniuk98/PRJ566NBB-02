// src/app/(main)/blog-posts/comments/[id]/page.js
'use client';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

export default function BlogPostCommentPage() {
  const { id } = useParams();
  const [comment, setComment] = useState(null);
  const [likes, setLikes] = useState(0);
  const [fetchedComments, setFetchedComments] = useState(false);

  useEffect(() => {
    // get all comments for a current blog posts
    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/blog-posts/comments/get-comment-by-id?commentId=${id}`);
        if (!res.ok) throw new Error('Failed to fetch comment');

        const data = await res.json();
        console.log('Comment: ', data);

        setComment(data);
        setLikes(data.likes.count);

        setFetchedComments(true);
      } catch (err) {
        console.error('Error fetching comment:', err);
      }
    };
    fetchComment();
  }, []);

  return (
    fetchedComments && (
      <div className="flex w-full">
        <div className="flex-[3] mt-20 ml-15">
          <div className="flex flex-row gap-x-4">
            <div className="relative w-10 h-10 rounded-full mr-3">
              <Image
                src={comment.avatarURL}
                alt={comment.author}
                fill={true}
                className="rounded-full object-cover w-full"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">
                {comment.author} <span className="text-gray-500 text-xs">{formatTimeAgo(comment.date_posted)}</span>
              </div>
              <div className="mt-1 mb-2">{comment.content}</div>

              {/* like, dislike, reply */}
              <div className="flex gap-4 text-gray-500 text-sm">
                <button className="hover:text-brand-navy cursor-pointer">
                  <FontAwesomeIcon icon={faThumbsUp} className={`icon-md text-brand-navy`} /> {likes}
                </button>
                <button
                  onClick={() => onDislike(setDislikes, comment, setLikes)}
                  className="hover:text-brand-navy cursor-pointer"
                >
                  <FontAwesomeIcon icon={faThumbsDown} className={`icon-md text-brand-navy`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

// *** get amount of time since a comment was posted ***
function formatTimeAgo(datePosted) {
  const date = new Date(datePosted);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
