import { useState } from 'react';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faTrashCan, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import {
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
} from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';
import LoginAlertModal from '../shared/LoginAlertModal';
import { useViewer } from '@/hooks/useViewer';

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
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // ---- for preventing unauthorized user from engaging with comments  ----
  const viewerId = isOwner ? restaurantId : currentUser?._id ?? null;
  const { isAuthenticated } = useViewer(); // current authentication state of user/viewer (supabase)

  const requireViewerId = () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return null;
    }
    return viewerId;
  };
  // ----------------------------------------------------------

  const handleSubmit = e => {
    e.preventDefault();
    if (!input.trim()) return;

    const id = requireViewerId();
    if (!id) return;

    onAddComment(
      {
        content: input,
        user_type: isOwner ? 'Restaurant' : 'User', // if owner, user_type is 'Restaurant', otherwise 'User'
        author_id: isOwner ? restaurantId : currentUser?._id,
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
    <div className="w-full mt-4 pt-4 border-t border-brand-peach">
      <h3 className="text-lg font-semibold mb-4 capitalize">Comments ({comments.length})</h3>

      <ul className="space-y-2 border-t-1 border-brand-peach pt-4">
        {comments.map(comment => (
          <Comment
            key={comment._id}
            comment={comment}
            engagementData={commentEngagementData[comment._id]}
            currentUser={currentUser}
            isOwner={isOwner}
            restaurantId={restaurantId}
            isAuthenticated={isAuthenticated} // pass user auth info (ensures no lag)
            onDelete={() => {
              const id = requireViewerId();
              if (!id) return;
              onDeleteComment(comment._id, isOwner ? restaurantId : currentUser?._id);
            }}
            onLike={() => {
              const id = requireViewerId();
              if (!id) return;
              onLike(comment._id, isOwner ? restaurantId : currentUser?._id);
            }}
            onDislike={() => {
              const id = requireViewerId();
              if (!id) return;
              onDislike(comment._id, isOwner ? restaurantId : currentUser?._id);
            }}
          />
        ))}
      </ul>

      {/* Comment input form */}
      {isAuthenticated && (isOwner || isAuthor) ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 mb-0 border-t-1 border-brand-peach w-full">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            type="text"
            placeholder="Write a comment..."
            className="w-full mt-4 min-h-20"
          />
          <Button type="submit" variant="default" className="w-30 mr-auto">
            Post
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-2 text-center bg-brand-blue-lite/30 p-4 py-8 rounded-2xl text-brand-grey font-primary my-4">
          <FontAwesomeIcon icon={faCommentDots} className={`text-3xl text-brand-blue`} />
          You must be the restaurant owner or the author of this review to comment.
        </div>
      )}
      {showLoginAlert && <LoginAlertModal isOpen={showLoginAlert} handleClose={() => setShowLoginAlert(false)} />}
    </div>
  );
}

function Comment({
  comment,
  currentUser,
  isOwner,
  restaurantId,
  engagementData,
  onLike,
  isAuthenticated,
  onDislike,
  onDelete,
}) {
  const { content, author_name, avatarURL, date_posted, likes, dislikes, author_id, user_type } = comment;

  // safe checks for likes/dislikes users presence
  //const hasLiked = engagementData?.userLiked || false;
  //const hasDisliked = engagementData?.userDisliked || false;
  const hasLiked = isAuthenticated && !!engagementData?.userLiked;
  const hasDisliked = isAuthenticated && !!engagementData?.userDisliked;

  return (
    <li className="p-2 text-sm flex gap-x-2 font-primary w-full">
      <div className="relative h-10 aspect-square rounded-full border border-brand-grey-lite bg-white">
        <Image
          src={avatarURL || 'https://freesvg.org/img/chef-restaurant-logo-publicdomainvectors.png'}
          alt={`${author_name}'s avatar`}
          fill
          className="rounded-full object-cover w-full"
        />
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <div className="font-semibold font-primary text-sm">{author_name}</div>
          <div className="text-xs text-brand-grey">{formatTimeAgo(date_posted)}</div>
        </div>

        <p className="mb-2">{content}</p>

        <div className="flex gap-3 text-sm text-brand-grey font-primary mt-4]">
          <button
            onClick={onLike}
            className={`hover:text-brand-navy ${hasLiked ? 'text-gray-500' : ''} mb-1 cursor-pointer text-xs`}
          >
            <FontAwesomeIcon icon={hasLiked ? faThumbsUp : faThumbsUpRegular} className="icon-md text-brand-navy" />{' '}
            {engagementData?.likes?.count || 0}
          </button>

          <button
            onClick={onDislike}
            className={`hover:text-brand-navy ${hasDisliked ? 'text-brand-navy font-semibold' : ''} cursor-pointer`}
          >
            <FontAwesomeIcon
              icon={hasDisliked ? faThumbsDown : faThumbsDownRegular}
              className="icon-md text-brand-navy"
            />{' '}
          </button>

          {isAuthenticated && author_id === (isOwner ? restaurantId : currentUser?._id) ? (
            <button onClick={onDelete} className="cursor-pointer ml-auto">
              <FontAwesomeIcon icon={faTrashCan} className={`icon-md text-brand-red`} />
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
