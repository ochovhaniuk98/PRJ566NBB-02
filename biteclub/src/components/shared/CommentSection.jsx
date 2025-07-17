import { useState } from 'react';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import {
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
} from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';

export default function CommentSection({
  currentUser,
  restaurantId,
  restaurantName,
  isOwner = false,
  isAuthor = false,
  comments,
  commentEngagementData,
  onAddComment = () => {},
  onDeleteComment = () => {},
  onLike = () => {},
  onDislike = () => {},
}) {
  const [input, setInput] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!input.trim()) return;

    onAddComment(
      {
        content: input,
        user_type: isOwner ? 'Restaurant' : 'User', // if owner, user_type is 'Restaurant', otherwise 'User'
        author_id: isOwner ? restaurantId : currentUser._id,
        author_name: isOwner ? restaurantName : currentUser.username,
        avatarURL: isOwner
          ? 'https://freesvg.org/img/chef-restaurant-logo-publicdomainvectors.png'
          : currentUser.userProfilePicture?.url || null,
      },
      isOwner ? restaurantId : currentUser._id
    );

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
            engagementData={commentEngagementData[comment._id]}
            currentUser={currentUser}
            isOwner={isOwner}
            restaurantId={restaurantId}
            onDelete={() => onDeleteComment(comment._id, isOwner ? restaurantId : currentUser._id)}
            onLike={() => onLike(comment._id, isOwner ? restaurantId : currentUser._id)}
            onDislike={() => onDislike(comment._id, isOwner ? restaurantId : currentUser._id)}
          />
        ))}
      </ul>

      {/* Comment input form */}
      {isOwner || isAuthor ? (
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
      ) : (
        <p className="text-sm text-brand-grey">
          You must be the restaurant owner or the author of this review to comment.
        </p>
      )}
    </div>
  );
}

function Comment({ comment, currentUser, isOwner, restaurantId, engagementData, onLike, onDislike, onDelete }) {
  const { content, author_name, avatarURL, date_posted, likes, dislikes, author_id, user_type } = comment;

  // safe checks for likes/dislikes users presence
  const hasLiked = engagementData?.userLiked || false;
  const hasDisliked = engagementData?.userDisliked || false;

  return (
    <li className="p-2 text-sm flex gap-x-2 font-primary">
      <div className="relative h-10 aspect-square rounded-full border border-brand-grey-lite bg-white">
        <Image
          src={avatarURL || 'https://freesvg.org/img/chef-restaurant-logo-publicdomainvectors.png'}
          alt={`${author_name}'s avatar`}
          fill
          className="rounded-full object-cover w-full"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="font-semibold font-primary text-sm">{author_name}</div>
          <div className="text-xs text-brand-grey">{formatTimeAgo(date_posted)}</div>
        </div>

        <p className="mb-2">{content}</p>

        <div className="flex gap-4 text-xs text-black font-primary mt-4">
          <button
            onClick={onLike}
            className={`hover:text-green-600 ${hasLiked ? 'text-green-600 font-semibold' : ''} mb-1`}
          >
            <FontAwesomeIcon icon={hasLiked ? faThumbsUp : faThumbsUpRegular} className="icon-md text-brand-navy" />{' '}
            {engagementData?.likes?.count || 0}
          </button>

          <button
            onClick={onDislike}
            className={`hover:text-red-500 ${hasDisliked ? 'text-red-500 font-semibold' : ''}`}
          >
            <FontAwesomeIcon
              icon={hasDisliked ? faThumbsDown : faThumbsDownRegular}
              className="icon-md text-brand-navy"
            />{' '}
          </button>

          {author_id === (isOwner ? restaurantId : currentUser._id) ? (
            <button onClick={onDelete} className="text-xs text-red-600">
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function formatTimeAgo(datePosted) {
  const date = new Date(datePosted);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
