import { useEffect, useMemo, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useUserData } from '@/context/UserDataContext';
import { updateReviewEngagement } from '@/lib/db/dbOperations';
import Spinner from '@/components/shared/Spinner';
import ReviewCard from '../shared/ReviewCard';
import InstagramEmbed from './InstagramEmbed';
import ReviewCardExpanded from './ReviewCardExpanded';
import NoContentPlaceholder from '../shared/NoContentPlaceholder';

export default function MasonryReviewGrid({
  selectedReview,
  setSelectedReview,
  reviewList,
  restaurantId,
  isOwner,
  restaurantName,
}) {
  // const { user } = useUser(); // Current logged-in user's Supabase info
  const { userData, loadingData, refreshUserData } = useUserData(); // Current logged-in user's MongoDB data (User / BusinessUser Object)
  const [reportedReviewIds, setReportedReviewIds] = useState([]);
  const [engagementData, setEngagementData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingData) return; // omitted " || !userData" from clause to allow unauthorized users to view profiles (public access)
    setLoading(false);
  }, [loadingData]);

  useEffect(() => {
    const fetchReportedReviews = async () => {
      const res = await fetch('/api/reports');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const json = await res.json();

      const reportedReviews = [];

      for (const report of json.reports || []) {
        // Only include reports that are pending and are of review types
        if (
          report.status === 'Pending' &&
          (report.contentType === 'InternalReview' || report.contentType === 'ExternalReview')
        ) {
          if (report.contentId && report.contentId._id) {
            reportedReviews.push(report.contentId._id);
          } else {
            console.warn('Report missing contentId._id', report);
          }
        }
      }

      setReportedReviewIds(reportedReviews);
    };
    fetchReportedReviews();
  }, []);

  // Combine and sort by date posted (memoized to prevent re-rendering)
  const combinedList = useMemo(() => {
    const internals = reviewList.internalReviews ?? [];
    const externals = reviewList.externalReviews ?? [];

    const engagementScores = internals.map(r => {
      const likes = r.likes?.count ?? 0;
      const dislikes = r.dislikes?.count ?? 0;
      return likes - dislikes;
    });

    const recencyScores = internals.map(r => new Date(r.date_posted).getTime());

    const normalize = arr => {
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      if (min === max) return arr.map(() => 0.5);
      return arr.map(x => (x - min) / (max - min));
    };

    const normEngagement = normalize(engagementScores);
    const normRecency = normalize(recencyScores);

    const scoredInternals = internals
      .map((review, i) => ({
        review,
        score: 0.45 * normEngagement[i] + 0.55 * normRecency[i],
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ review }) => review);

    const sortedExternals = [...externals].sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));

    const combined = [...scoredInternals];
    sortedExternals.forEach(ext => {
      const insertAt = Math.floor(Math.random() * (combined.length + 1));
      combined.splice(insertAt, 0, ext);
    });

    return combined;
  }, [reviewList]);

  const filteredCombinedList = useMemo(() => {
    if (!combinedList) return [];
    return combinedList.filter(review => !reportedReviewIds.includes(review._id || review.id));
  }, [combinedList, reportedReviewIds]);

  useEffect(() => {
    if (!userData || !filteredCombinedList.length) return;

    const newEngagementData = filteredCombinedList.reduce((acc, review) => {
      acc[review._id] = {
        likes: review.likes?.count || 0,
        dislikes: review.dislikes?.count || 0,
        comments: review.comments?.length || 0,
        userLiked: review.likes?.users?.includes(userData?._id) || false,
        userDisliked: review.dislikes?.users?.includes(userData?._id) || false,
      };
      return acc;
    }, {});
    setEngagementData(newEngagementData);
  }, [userData, filteredCombinedList]);

  // breakpoints for when an internal review is selected and the expanded panel appears
  const breakpointColumnsObj = useMemo(() => {
    const isInternal = selectedReview && !selectedReview?.content?.embedLink;
    return isInternal
      ? { default: 2, 1280: 1, 640: 1 } // 2 column + expanded panel view
      : { default: 3, 1280: 2, 640: 1 }; // 3 column default view
  }, [selectedReview]);

  // Exit early if no reviews
  if (!reviewList || (!reviewList?.internalReviews?.length && !reviewList?.externalReviews?.length)) {
    return <NoContentPlaceholder contentType="reviews" iconImgNum={1} />;
  }

  if (loadingData || loading) return <Spinner />;

  // ===================
  // HANDLES & FUNCTIONS
  // ===================
  const updateEngagementState = (reviewId, resData) => {
    setEngagementData(prev => ({
      ...prev,
      [reviewId]: {
        ...prev[reviewId],
        likes: resData.likes.count,
        dislikes: resData.dislikes.count,
        userLiked: resData.likes.users.includes(userData._id),
        userDisliked: resData.dislikes.users.includes(userData._id),
        comments: resData.comments.length,
      },
    }));
  };

  const handleLike = reviewId => {
    return async () => {
      try {
        const resData = await updateReviewEngagement(reviewId, userData._id, true, false);
        updateEngagementState(reviewId, resData);
      } catch (error) {
        console.error('Failed to update like engagement:', error);
      }
    };
  };

  const handleDislike = reviewId => {
    return async () => {
      try {
        const resData = await updateReviewEngagement(reviewId, userData._id, false, true);
        updateEngagementState(reviewId, resData);
      } catch (error) {
        console.error('Failed to update dislike engagement:', error);
      }
    };
  };

  const updateCommentCount = (reviewId, newCount) => {
    setEngagementData(prev => ({
      ...prev,
      [reviewId]: {
        ...prev[reviewId],
        comments: newCount,
      },
    }));
  };

  return (
    <div className="flex gap-2 w-full">
      {/* Masonry columns */}
      <div className="flex-1">
        <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2" columnClassName="space-y-2">
          {filteredCombinedList.map(review =>
            !review.content?.embedLink ? (
              /* internal reviews */
              <ReviewCard
                key={review._id}
                review={review}
                reviewEngagementStats={engagementData[review._id]}
                onLike={handleLike(review._id)}
                onDislike={handleDislike(review._id)}
                photos={review.photos}
                onClick={() => setSelectedReview(review)}
                isSelected={selectedReview?._id === review._id}
              />
            ) : (
              /* external reviews */
              <InstagramEmbed
                key={review._id}
                contentId={review?._id}
                author={review?.user_id} // This gives the whole user object not just user_id
                url={review.content?.embedLink}
              />
            )
          )}
        </Masonry>
      </div>

      {/* Expanded side panel (visible when internal review is selected) */}
      {selectedReview && !selectedReview?.content?.embedLink && (
        <ReviewCardExpanded
          currentUser={userData}
          restaurantId={restaurantId}
          restaurantName={restaurantName}
          isOwner={isOwner}
          selectedReview={selectedReview}
          reviewEngagementStats={engagementData[selectedReview._id]}
          onLike={handleLike(selectedReview._id)}
          onDislike={handleDislike(selectedReview._id)}
          onClose={() => setSelectedReview(null)}
          updateCommentCount={updateCommentCount}
        />
      )}
    </div>
  );
}
