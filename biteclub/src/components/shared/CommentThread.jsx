'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useViewer } from '@/hooks/useViewer';
import { Button } from './Button';
import ReportForm from '../shared/ReportForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
} from '@fortawesome/free-regular-svg-icons';
import {
  faThumbsUp as faThumbsUpSolid,
  faThumbsDown as faThumbsDownSolid,
  faTrashCan,
  faFlag,
  faXmark,
  faReply,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import LoginAlertModal from './LoginAlertModal';

//////////////// COMMENT THREAD FOR *** BLOG POST *** ONLY! ///////////////

// *** Entire comment thread / container ***
export default function CommentThread({ post, setShowComments }) {
  // post and user
  const [blogPost, setBlogPost] = useState(null);
  const [user, setUser] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false); // shows custom alert for non-logged-in users
  const { isAuthenticated, userData } = useViewer(); // info on current authentication states of user/viewer (mongo + supabase)

  // comments
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [fetchedComments, setFetchedComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // set current blog post and user
  useEffect(() => {
    if (!post) return;

    // set blog post
    setBlogPost(post);
    console.log('Blog Post in Comments Thread component is: ', post);

    // set user
    const fetchUser = async () => {
      if (!userData?._id) return;
      try {
        setUser(userData);
        console.log('userData: ', userData);
        //setFetchedPostUser(true);
      } catch (error) {
        console.error('Failed to fetch user MongoDB id:', error);
      }
    };

    fetchUser();
  }, [post, userData?._id]);

  // nest replies within parent comments (parent comment -> [reply 1, reply 2 ...])
  function nestComments(comments) {
    const commentMap = {};
    const nestedComments = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment._id] = comment;
    });

    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap[comment.parent_id];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        nestedComments.push(comment);
      }
    });

    console.log('nestedComments: ', nestedComments);

    return nestedComments;
  }

  // get all comments for a current blog posts
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blog-posts/comments/get-comments-by-post-id?postId=${blogPost._id}`);
      if (!res.ok) throw new Error('Failed to fetch comments');

      const data = await res.json();

      setComments(nestComments(data));
      setCommentsCount(data.length);

      setFetchedComments(true);

      console.log('Comments length: ', data.length);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    if (!blogPost) return;

    fetchComments();
  }, [blogPost]);

  // add new comment
  const addComment = async () => {
    // show alert if viewer not logged-in
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    if (newComment.trim()) {
      // add new comment
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
        setCommentsCount(prev => prev + 1);

        console.log('Posted comment:', data);
      } catch (err) {
        console.error('Error posting comment:', err);
      }

      setNewComment('');
    }
  };

  // add reply from profile owner to a comment
  const addReply = async (parentId, replyContent, setReplyContent) => {
    // add new reply

    if (replyContent.trim()) {
      // add new reply
      try {
        if (!blogPost || !user) return;

        // show alert if viewer not logged-in
        if (!isAuthenticated) {
          alert('Please log in to comment.');
          return;
        }

        // post request to create a new comment
        const res = await fetch('/api/blog-posts/comments/add-comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blogPostId: blogPost._id,
            parent_id: parentId,
            avatarURL: user.userProfilePicture.url,
            content: replyContent,
            author: user.username,
            date_posted: new Date().toISOString(),
            user: user._id,
          }),
        });

        if (!res.ok) throw new Error(`Could not create new reply ${res.status}`);
        const data = await res.json();
        const comment = data.comment;

        fetchComments(); // update the list of comments/replies
        setReplyContent('');

        console.log('Posted reply:', data);
      } catch (err) {
        console.error('Error posting reply:', err);
      }
    }
  };

  // replaces comment anywhere in the comment tree
  function replaceInTree(list, updated) {
    return list.map(c => {
      if (c._id === updated._id) {
        const replies = c.replies ?? [];
        return { ...c, ...updated, replies };
      }
      if (c.replies?.length) {
        return { ...c, replies: replaceInTree(c.replies, updated) };
      }
      return c;
    });
  }

  // handle likes
  // // only one like allowed
  const onLike = async (setLikes, comment) => {
    // show alert if viewer not logged-in
    if (!isAuthenticated) {
      alert('Please log in to comment.');
      return;
    }

    const res = await fetch('/api/blog-posts/comments/add-like-dislike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: comment._id,
        like: true,
        dislike: false,
        userId: user._id,
      }),
    });
    if (!res.ok) throw new Error(`Could not add like to a comment ${res.status}`);
    const data = await res.json();
    setLikes(data.comment.likes.count);

    // replace the *whole* comment with the server-updated one to update UI
    setComments(prev => replaceInTree(prev, data.comment));
  };

  // handle dislikes
  // // only one dislike allowed
  const onDislike = async (setDislikes, comment, setLikes) => {
    // show alert if viewer not logged-in
    if (!isAuthenticated) {
      alert('Please log in to comment.');
      return;
    }

    const res = await fetch('/api/blog-posts/comments/add-like-dislike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: comment._id,
        like: false,
        dislike: true,
        userId: user._id,
      }),
    });
    if (!res.ok) throw new Error(`Could not add dislike to a comment ${res.status}`);

    const data = await res.json();

    setLikes(data.comment.likes.count);
    setDislikes(data.comment.dislikes.count);

    // replace comment with update to change UI
    setComments(prev => replaceInTree(prev, data.comment));
  };

  // handle delete
  const onDelete = async comment => {
    const res = await fetch(`/api/blog-posts/comments/delete-comment?commentId=${comment._id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      console.error('Failed to delete comment');
      return;
    }
    // update the list of comments/replies
    await fetchComments();
  };

  return (
    <div className="fixed xl:top-20 right-0  bottom-0 md:w-md w-full h-2/3 xl:h-10/12 p-4 xl:mb-8 border bg-white border-brand-peach flex flex-col shadow-lg rounded-tl-lg rounded-bl-lg font-primary z-[999] overflow-y-scroll scrollbar-hide">
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-lg font-bold">Comments ({commentsCount})</h3>
        <div className="xl:hidden">
          <FontAwesomeIcon
            icon={faXmark}
            className={`icon-lg text-brand-navy cursor-pointer`}
            onClick={() => setShowComments(false)}
          />
        </div>
      </div>

      {/* scrollable comments area */}
      {commentsCount <= 0 ? (
        <div className="flex flex-col gap-2 text-center bg-brand-blue-lite/30 p-4 py-8 rounded-2xl text-brand-grey">
          <FontAwesomeIcon icon={faCommentDots} className={`text-3xl text-brand-blue`} />
          No comments yet.
          <br />
          Be the first!
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 xl:pb-28 pb-8 scrollbar-hide border-t-1 border-brand-peach pt-4">
          {fetchedComments &&
            comments.map(comment => (
              <Comment
                key={comment._id}
                comment={comment}
                userId={user?._id}
                isAuthenticated={isAuthenticated}
                onReply={addReply}
                onLike={onLike}
                onDislike={onDislike}
                onDelete={onDelete}
                reportedUser={user}
              />
            ))}
        </div>
      )}

      {/* main textarea input + "post" button */}
      <div className="xl:absolute xl:bottom-4 xl:left-0 xl:right-0 bg-white pt-2 px-4 border-t-1 border-brand-peach">
        <textarea
          rows={3}
          placeholder="Write a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="w-full border-2 rounded-md p-2 mb-2"
        />
        <Button type="submit" variant="default" className="block min-w-30" onClick={addComment}>
          Post
        </Button>
      </div>
      {showLoginAlert && <LoginAlertModal isOpen={showLoginAlert} handleClose={() => setShowLoginAlert(false)} />}
    </div>
  );
}

// *** single comment with engagement icons + input field for replying ***
const Comment = ({ comment, userId, onReply, onLike, onDislike, onDelete, isAuthenticated }) => {
  const [showLoginAlert, setShowLoginAlert] = useState(false); // shows custom alert for non-logged-in users

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplyBtn, setShowReplyBtn] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  // track if User thumbsUped or Down (like/dislike)
  //const [hasLiked, setHasLiked] = useState(false);
  //const [hasDisliked, setHasDisliked] = useState(false);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const [isOwner, setIsOwner] = useState(false);

  // for reporting a post
  const [openReportForm, setOpenReportForm] = useState(false);
  const [reportedUser, setReportedUser] = useState(null);
  // const [reporter, setReporter] = useState(null);

  // keep counts in sync if comment updates from server
  useEffect(() => {
    setLikes(comment?.likes?.count || 0);
    setDislikes(comment?.dislikes?.count || 0);
  }, [comment?.likes?.count, comment?.dislikes?.count]);

  // allow only one level nested comments
  useEffect(() => {
    if (comment?.parent_id === null) {
      setShowReplyBtn(true);
    } else {
      setShowReplyBtn(false);
    }
    setLikes(comment?.likes?.count || 0);
    setDislikes(comment?.dislikes?.count || 0);

    console.log('Comment: ', comment);

    // set isOwner
    if (comment.user == userId) {
      setIsOwner(true);
    }

    // console.log('Reporting user id: ', userId);
    // for reporting a comment
    fetchReportedUser(comment.user);
  }, []);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent, setReplyContent);
    }
  };

  // for reporting a post
  // get reported user object
  const fetchReportedUser = async id => {
    try {
      if (id) {
        const res = await fetch(`/api/users/get-general-user-by-MgId?id=${id}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const reportedUser = await res.json();

        setReportedUser(reportedUser);
        // console.log('reportedUser', reportedUser);
      }
    } catch (error) {
      console.error('Failed to fetch reported User:', error);
    }
  };

  // derive filled state — instantly clears when logged out
  const liked = isAuthenticated && !!comment?.likes?.users?.includes?.(userId);
  const disliked = isAuthenticated && !!comment?.dislikes?.users?.includes?.(userId);

  // handle LIKE or DISLIKE (change icons if liked by USER)
  const handleLike = () => {
    if (!isAuthenticated) {
      return;
    }
    onLike(setLikes, comment);
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      return;
    }
    onDislike(setDislikes, comment, setLikes);
  };

  return (
    <>
      <div className="flex mb-4">
        <div className="relative w-10 h-10 rounded-full mr-3">
          <Image
            src={comment.avatarURL}
            alt={comment.author}
            fill={true}
            className="rounded-full object-cover w-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-sm font-semibold">
            {comment.author}{' '}
            <span className="text-gray-500 text-xs font-normal">{formatTimeAgo(comment.date_posted)}</span>
          </div>
          <div className="mt-1 mb-2">{comment.content}</div>

          {/* like, dislike, reply */}
          <div className="flex gap-4 text-gray-500 text-xs">
            <button
              onClick={isAuthenticated ? handleLike : () => setShowLoginAlert(true)}
              className="hover:text-brand-navy cursor-pointer"
            >
              <FontAwesomeIcon
                icon={liked ? faThumbsUpSolid : faThumbsUpRegular}
                className={`icon-md text-brand-navy`}
              />{' '}
              {likes}
            </button>
            <button
              onClick={isAuthenticated ? handleDislike : () => setShowLoginAlert(true)}
              className="hover:text-brand-navy cursor-pointer"
            >
              <FontAwesomeIcon
                icon={disliked ? faThumbsDownSolid : faThumbsDownRegular}
                className={`icon-md text-brand-navy`}
              />
            </button>

            {/* show Report form when flag icon is clicked */}
            <div
              className="text-brand-navy flex items-center gap-x-2 cursor-pointer"
              onClick={isAuthenticated ? () => setOpenReportForm(prev => !prev) : () => setShowLoginAlert(true)}
            >
              <FontAwesomeIcon icon={faFlag} className={`icon-md text-brand-navy cursor-pointer`} />
            </div>

            {showReplyBtn && (
              <button
                onClick={isAuthenticated ? () => setShowReplyInput(!showReplyInput) : () => setShowLoginAlert(true)}
                className="hover:text-brand-navy text-xs cursor-pointer flex justify-center items-center"
              >
                <FontAwesomeIcon icon={faReply} className={`icon-md text-brand-navy mr-1`} /> Reply
              </button>
            )}
            {isOwner && (
              <button onClick={() => onDelete(comment)} className="cursor-pointer ml-auto">
                <FontAwesomeIcon icon={faTrashCan} className={`icon-md text-brand-red`} />
              </button>
            )}
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
          <div className="mt-4 pl-4 border-l-2 border-brand-peach">
            {comment?.replies &&
              comment.replies.map(reply => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  userId={userId}
                  onReply={onReply}
                  onLike={onLike}
                  onDislike={onDislike}
                  onDelete={onDelete}
                  isAuthenticated={isAuthenticated}
                />
              ))}
          </div>
        </div>
      </div>
      {openReportForm && (
        <ReportForm
          onClose={() => setOpenReportForm(false)}
          contentTitle={comment.content}
          contentType="CommentPost"
          contentId={comment._id}
          reportedUser={reportedUser}
          // reporter={reporter}
        />
      )}

      {showLoginAlert && <LoginAlertModal isOpen={showLoginAlert} handleClose={() => setShowLoginAlert(false)} />}
    </>
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
