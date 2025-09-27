import { useEffect, useState } from 'react';
import Image from 'next/image';
import EngagementIconStat from '../shared/EngagementIconStat';
import StarRating from '../shared/StarRating';
import AuthorDateBlurb from '../shared/AuthorDateBlurb';
import ReportForm from '../shared/ReportForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFlag, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import reviewCardIconArr from '@/app/data/iconData';
import CommentSection from '../shared/CommentSection';
import { addCommentToReview, deleteCommentFromReview, updateReviewCommentEngagement } from '@/lib/db/dbOperations';

export default function ReviewCardExpanded({
  currentUser,
  restaurantId,
  restaurantName,
  selectedReview,
  reviewEngagementStats,
  onLike,
  onDislike,
  updateCommentCount = () => {},
  onClose,
  isOwner = false,
}) {
  const [authorProfile, setAuthorProfile] = useState(null);
  const authorId = selectedReview.user_id?._id;

  // Fetch review author
  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        if (!authorId) return;
        const authorRes = await fetch(`/api/generals/get-profile-by-dbId?dbId=${authorId}`);
        if (!authorRes.ok) {
          console.error('Failed to fetch author profile:', authorRes.status);
          return;
        }
        const { profile } = await authorRes.json(); // { profile } matching what the API call returned
        setAuthorProfile(profile);
      } catch (err) {
        console.error('Error in fetchAuthorProfile:', err);
      }
    };
    fetchAuthorProfile();
  }, [authorId]);

  const [photoIndex, setPhotoIndex] = useState(0);
  // for comments in expanded review
  // currentUser, comments, onAddComment, onLike, onDislike
  const [openReportForm, setOpenReportForm] = useState(false);

  const handleNext = () => {
    setPhotoIndex(prev => (prev + 1) % selectedReview.photos.length);
  };
  const handlePrev = () => {
    setPhotoIndex(prev => (prev === 0 ? selectedReview.photos.length - 1 : prev - 1));
  };

  const [comments, setComments] = useState(selectedReview.comments || []);
  const [commentEngagementData, setCommentEngagementData] = useState({});

  useEffect(() => {
    if (selectedReview) {
      setComments(selectedReview.comments || []);

      setCommentEngagementData(
        (selectedReview.comments || []).reduce((acc, comment) => {
          acc[comment._id] = {
            likes: { count: comment.likes?.count || 0, users: comment.likes?.users || [] },
            dislikes: { count: comment.dislikes?.count || 0, users: comment.dislikes?.users || [] },
            userLiked: isOwner
              ? comment.likes?.users?.includes(restaurantId) || false
              : comment.likes?.users?.includes(currentUser._id) || false,
            userDisliked: isOwner
              ? comment.dislikes?.users?.includes(restaurantId) || false
              : comment.dislikes?.users?.includes(currentUser._id) || false,
          };
          return acc;
        }, {})
      );
    } else {
      setComments([]);
      setCommentEngagementData({});
    }
  }, [selectedReview, currentUser?._id, isOwner, restaurantId]);

  const handleAddComment = async (commentData, userId) => {
    try {
      console.log('Adding comment:', selectedReview._id, commentData, userId);
      const { comment: newComment, updatedCount } = await addCommentToReview(selectedReview._id, commentData, userId);
      console.log('New comment added:', newComment);
      updateCommentCount(selectedReview._id, updatedCount);
      setComments(prev => [...prev, newComment]);
      setCommentEngagementData(prev => ({
        ...prev,
        [newComment._id]: {
          likes: { count: 0, users: [] },
          dislikes: { count: 0, users: [] },
          userLiked: false,
          userDisliked: false,
        },
      }));
      return newComment;
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId, userId) => {
    try {
      const { success, deletedCommentId, updatedCount } = await deleteCommentFromReview(
        selectedReview._id,
        commentId,
        userId
      );
      if (success) {
        updateCommentCount(selectedReview._id, updatedCount);
        setComments(prev => prev.filter(comment => comment._id !== deletedCommentId));
        setCommentEngagementData(prev => {
          const newData = { ...prev };
          delete newData[deletedCommentId];
          return newData;
        });
        console.log('Comment deleted:', deletedCommentId);
        return { success, deletedCommentId };
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleCommentLike = async (commentId, userId) => {
    try {
      console.log('Liking comment:', selectedReview._id, commentId, userId);
      const resData = await updateReviewCommentEngagement(selectedReview._id, userId, true, false, commentId);
      setCommentEngagementData(prev => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          likes: { count: resData.likes.count, users: resData.likes.users },
          dislikes: { count: resData.dislikes.count, users: resData.dislikes.users },
          userLiked: resData.likes.users.includes(userId),
          userDisliked: resData.dislikes.users.includes(userId),
        },
      }));
      console.log('Comment liked:', resData);
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleCommentDislike = async (commentId, userId) => {
    try {
      console.log('Disliking comment:', selectedReview._id, commentId, userId);
      const resData = await updateReviewCommentEngagement(selectedReview._id, userId, false, true, commentId);
      setCommentEngagementData(prev => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          likes: { count: resData.likes.count, users: resData.likes.users },
          dislikes: { count: resData.dislikes.count, users: resData.dislikes.users },
          userLiked: resData.likes.users.includes(userId),
          userDisliked: resData.dislikes.users.includes(userId),
        },
      }));
      console.log('Comment disliked:', resData);
    } catch (error) {
      console.error('Failed to dislike comment:', error);
    }
  };

  return (
    <div className="xl:w-1/3 lg:w-2/3 w-full fixed left-0 right-0 bottom-0 top-16 md:static md:z-20 z-100 h-screen md:pb-0 pb-16">
      <div className="sticky top-14 h-full overflow-auto scrollbar-none bg-white md:border-2 border-t-2 border-brand-peach rounded-md shadow-lg">
        <div className="p-4 bg-white w-full flex justify-between">
          <AuthorDateBlurb
            authorPic={selectedReview.user_id?.userProfilePicture?.url}
            authorName={selectedReview.user_id?.username}
            date={selectedReview.date_posted}
          />
          <div className="text-right">
            <FontAwesomeIcon
              icon={faFlag}
              className={`icon-md text-brand-navy mr-3 cursor-pointer`}
              onClick={() => setOpenReportForm(true)}
            />
            <FontAwesomeIcon icon={faXmark} className={`icon-lg text-brand-navy cursor-pointer`} onClick={onClose} />
          </div>
        </div>
        {selectedReview?.photos?.length > 0 && (
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            {/* Image */}
            <Image
              src={selectedReview.photos[photoIndex].url}
              alt={selectedReview.photos[photoIndex].caption}
              fill
              className="object-cover transition-opacity duration-300 border-t border-b border-brand-grey-lite"
              sizes="(max-width: 768px) 100vw, 33vw"
            />

            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 bottom-3/7 -translate-y-1/2 bg-white/60  border border-white/60 rounded-full p-1 w-6 aspect-square shadow-lg flex items-center justify-center cursor-pointer"
            >
              <FontAwesomeIcon icon={faChevronLeft} className={`icon-sm text-brand-grey`} />
            </button>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 bottom-3/7 -translate-y-1/2 bg-white  border border-brand-navy rounded-full p-1 w-6 aspect-square shadow-lg flex items-center justify-center cursor-pointer"
            >
              <FontAwesomeIcon icon={faChevronRight} className={`icon-sm text-brand-grey`} />
            </button>
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between">
            <StarRating colour={'text-brand-green'} iconSize={'icon-lg'} ratingNum={selectedReview.rating} />
            <div>
              <EngagementIconStat
                iconArr={reviewCardIconArr}
                statNumArr={[reviewEngagementStats?.likes || 0, reviewEngagementStats?.comments || 0]}
                handlers={[onLike, () => {}, onDislike]}
                states={[reviewEngagementStats?.userLiked, false, reviewEngagementStats?.userDisliked]}
              />
            </div>
          </div>
          <h3>{selectedReview.title}</h3>
          <p>{selectedReview.body}</p>
          <div>
            <CommentSection
              currentUser={currentUser}
              restaurantId={restaurantId}
              restaurantName={restaurantName}
              isOwner={isOwner}
              isAuthor={authorId === (isOwner ? restaurantId : currentUser?._id)}
              comments={comments}
              commentEngagementData={commentEngagementData}
              setCommentEngagementData={setCommentEngagementData}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onLike={handleCommentLike}
              onDislike={handleCommentDislike}
            />
          </div>
        </div>
      </div>
      {/* Report form */}
      {openReportForm && (
        <ReportForm
          onClose={() => setOpenReportForm(false)}
          reportType="Content"
          contentTitle={selectedReview.title}
          contentType="InternalReview"
          contentId={selectedReview._id}
          reportedUser={authorProfile}
        />
      )}
    </div>
  );
}
