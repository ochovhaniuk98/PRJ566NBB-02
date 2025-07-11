'use client';
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { fakeUser } from '@/app/data/fakeData';
import { createClient } from '@/lib/auth/client';
import { getGeneralUserMongoIDbySupabaseId, getGeneralUserProfileByMongoId } from '@/lib/db/dbOperations';

//////////////// COMMENT THREAD FOR *** BLOG POST *** ONLY! ///////////////

// *** Entire comment thread / container ***
export default function CommentThread({ post }) {
  const [blogPost, setBlogPost] = useState(null);
  const [user, setUser] = useState(null);
  const [currentComments, setCurrentComments] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [fetchedComments, setFetchedComments] = useState(false);

  // set current blog post and user
  useEffect(() => {
    if (!post) return;

    // set blog post
    setBlogPost(post);
    console.log('Blog Post in Comments Thread component is: ', post);

    // set user
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!data?.user) throw new Error('No Supabase user');
        const supabaseId = data.user.id;

        const res = await fetch(`/api/users/get-general-user?id=${supabaseId}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const userData = await res.json();

        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user MongoDB id:', error);
      }
    };

    fetchUser();
  }, [post]);

  // all comments (first comment is fake by default)
  const [comments, setComments] = useState([]);

  // get all comments for current blog posts
  useEffect(() => {
    if (!blogPost) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/blog-posts/comments/get-comments-by-post-id?postId=${blogPost._id}`);
        if (!res.ok) throw new Error('Failed to fetch comments');

        const data = await res.json();

        setComments(data);
        setCommentsCount(data.length);
        setFetchedComments(true);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [blogPost, comments]);

  // TODO: add new comments
  // TODO: add new replies

  // add a single comment to all comments array
  const [newComment, setNewComment] = useState('');
  const addComment = async () => {
    if (newComment.trim()) {
      // TODO: add new comment
      try {
        if (!blogPost || !user) return;

        // post request to create a new comment
        const res = await fetch('/api/blog-posts/comments/add-comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blogPostId: blogPost._id,
            parent_id: null,
            avatarURL: user.userProfilePicture.url,
            content: newComment,
            author: user.username,
            date_posted: new Date().toISOString(),
            user: user._id,
          }),
        });

        if (!res.ok) throw new Error(`Could not create new comment ${res.status}`);
        const data = await res.json();
        const comment = data.comment;

        setComments(prev => [...prev, comment]);
        setCommentsCount(prev => [prev + 1]);

        console.log('Posted comment:', data);
      } catch (err) {
        console.error('Error posting comment:', err);
      }

      setNewComment('');
    }
  };

  // add reply from profile owner to a comment
  const addReply = (parentId, replyText) => {
    const insertReply = items =>
      items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [
              ...item.replies,
              {
                id: Date.now(),
                author: 'ProfileOwnerName',
                avatarURL: 'https://i.pravatar.cc/150?img=10',
                content: replyText,
                timestamp: new Date(),
                replies: [],
              },
            ],
          };
        } else if (item.replies?.length > 0) {
          return { ...item, replies: insertReply(item.replies) };
        }
        return item;
      });

    setComments(insertReply(comments));
  };

  return (
    <div className="fixed top-20 right-0 w-4/12 h-10/12 p-4 border border-brand-peach bg-white flex flex-col shadow-lg rounded-tl-lg rounded-bl-lg font-primary">
      <h3 className="text-lg font-bold mb-4">Comments ({commentsCount})</h3>

      {/* scrollable comments area */}
      <div className="flex-1 overflow-y-auto pr-1 pb-28 scrollbar-hide">
        {fetchedComments && comments.map(comment => <Comment key={comment._id} comment={comment} onReply={addReply} />)}
      </div>

      {/* main textarea input + "post" button */}
      <div className="absolute bottom-4 left-0 right-0 bg-white pt-2 px-4 border-t-1 border-brand-peach">
        <textarea
          rows={3}
          placeholder="Write a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="w-full border rounded-md p-2 mb-2"
        />
        <Button type="submit" variant="default" className="block min-w-30" onClick={addComment}>
          Post
        </Button>
      </div>
    </div>
  );
}

// *** single comment with engagement icons + input field for replying ***
const Comment = ({ comment, onReply }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyInput(false);
    }
  };

  return (
    <div className="flex mb-6">
      <div className="relative w-10 h-10 rounded-full mr-3">
        <Image src={comment.avatarURL} alt={comment.author} fill={true} className="rounded-full object-cover w-full" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">
          {comment.author} <span className="text-gray-500 text-xs">{formatTimeAgo(comment.date_posted)}</span>
        </div>
        <div className="mt-1 mb-2">{comment.content}</div>

        {/* like, dislike, reply */}
        <div className="flex gap-4 text-gray-500 text-sm">
          <button onClick={() => setLikes(likes + 1)} className="hover:text-brand-navy cursor-pointer">
            <FontAwesomeIcon icon={faThumbsUp} className={`icon-md text-brand-navy`} /> {likes}
          </button>
          <button onClick={() => setDislikes(dislikes + 1)} className="hover:text-brand-navy cursor-pointer">
            <FontAwesomeIcon icon={faThumbsDown} className={`icon-md text-brand-navy`} />
          </button>
          <button onClick={() => setShowReplyInput(!showReplyInput)} className="hover:text-black cursor-pointer">
            <FontAwesomeIcon icon={faComment} className={`icon-md text-brand-navy`} /> Reply
          </button>
        </div>

        {/* reply input field + button */}
        {showReplyInput && (
          <div className="mt-2">
            <textarea
              rows={2}
              placeholder="Write a reply..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              className="w-full p-2"
            />
            <Button type="submit" variant="secondary" className="w-20 ml-auto" onClick={handleReply}>
              Reply
            </Button>
          </div>
        )}

        {/* vertical trail of replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-brand-peach">
            {comment.replies.map(reply => (
              <Comment key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// *** get amount of time since a comment was posted ***
function formatTimeAgo(datePosted) {
  const date = new Date(datePosted);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
