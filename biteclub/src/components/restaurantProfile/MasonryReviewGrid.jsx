import Masonry from 'react-masonry-css';
import ReviewCard from '../shared/ReviewCard';
import { useMemo } from 'react';
import InstagramEmbed from './InstagramEmbed';
import ReviewCardExpanded from './ReviewCardExpanded';

export default function MasonryReviewGrid({ selectedReview, setSelectedReview, reviewList }) {
  // breakpoints for when an internal review is selected and the expanded panel appears
  const breakpointColumnsObj = useMemo(() => {
    const isInternal = selectedReview && !selectedReview?.content?.embedLink;
    return isInternal
      ? { default: 2, 1024: 2, 640: 1 } // 2 column + expanded panel view
      : { default: 3, 1024: 2, 640: 1 }; // 3 column default view
  }, [selectedReview]);

  // Exit early if no reviews
  if (!reviewList || (!reviewList?.internalReviews?.length && !reviewList?.externalReviews?.length)) {
    return <div className="col-span-3 text-center text-gray-500">No reviews available</div>;
  }

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

  return (
    <div className="flex gap-2">
      {/* Masonry columns */}
      <div className="flex-1">
        <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2" columnClassName="space-y-2">
          {combinedList.map(review =>
            !review.content?.embedLink ? (
              /* internal reviews */
              <ReviewCard
                key={review._id}
                review={review}
                photos={review.photos}
                onClick={() => setSelectedReview(review)}
                isSelected={selectedReview?._id === review._id}
              />
            ) : (
              /* external reviews */
              <InstagramEmbed key={review._id} url={review.content?.embedLink} />
            )
          )}
        </Masonry>
      </div>

      {/* Expanded side panel (visible when internal review is selected) */}
      {selectedReview && !selectedReview?.content?.embedLink && (
        <ReviewCardExpanded selectedReview={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </div>
  );
}
