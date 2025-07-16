import { useState } from 'react';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

// NOT COMPLETED. DO NOT ADD BACKEND YET!!!!
export default function CommentSection({
  currentUser,
  comments,
  onAddComment = () => {},
  onLike = () => {},
  onDislike = () => {},
}) {
  const [input, setInput] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!input.trim()) return;

    onAddComment({
      body: input,
      author: currentUser._id,
      date_posted: new Date(),
      likes: { count: 0, users: [] },
      dislikes: { count: 0, users: [] },
    });

    setInput('');
  };

  return (
    <div className="w-full mt-4 py-4 border-t border-brand-peach">
      <h3 className="text-lg font-semibold mb-4 uppercase">Comments ({comments.length})</h3>

      <ul className="space-y-2">
        {comments.map(comment => (
          <Comment
            key={comment._id}
            comment={comment}
            currentUser={currentUser}
            onLike={onLike}
            onDislike={onDislike}
          />
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 mb-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          type="text"
          placeholder="Write a comment..."
          className="w-full mt-4"
        />
        <Button type="submit" variant="secondary" className="w-30 ml-auto">
          Post
        </Button>
      </form>
    </div>
  );
}

function Comment({ comment, currentUser, onLike, onDislike }) {
  const { body, author, date_posted, likes, dislikes } = comment;

  const hasLiked = likes.users.includes(currentUser._id);
  const hasDisliked = dislikes.users.includes(currentUser._id);

  return (
    <li className="p-2 text-sm flex gap-x-2 font-primary">
      <div className="relative h-10 aspect-square rounded-full border border-brand-grey-lite bg-white">
        <Image
          src={comment.author[0]?.userProfilePicture.url}
          alt={comment.author[0]?.userProfilePicture.caption}
          fill={true}
          className="rounded-full object-cover w-full"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="font-semibold font-primary text-sm">{comment.author[0]?.username}</div>
          <div className="text-xs text-brand-grey">{formatTimeAgo(new Date(date_posted).toLocaleString())}</div>
        </div>
        <p className="mb-2">{body}</p>
        <div className="flex gap-4 text-xs text-black font-primary mt-4">
          <button
            onClick={() => onLike(comment._id)}
            className={`hover:text-green-600 ${hasLiked ? 'text-green-600 font-semibold' : ''} mb-1`}
          >
            <FontAwesomeIcon icon={faThumbsUp} className={`icon-md text-brand-navy`} /> {likes.count}
          </button>
          <button
            onClick={() => onDislike(comment._id)}
            className={`hover:text-red-500 ${hasDisliked ? 'text-red-500 font-semibold' : ''}`}
          >
            <FontAwesomeIcon icon={faThumbsDown} className={`icon-md text-brand-navy`} />
          </button>
        </div>
      </div>
    </li>
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
