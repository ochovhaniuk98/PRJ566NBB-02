import Masonry from 'react-masonry-css';
import ReviewCard from '../shared/ReviewCard';
import { useMemo } from 'react';
import InstagramEmbed from './InstagramEmbed';
import ReviewCardExpanded from './ReviewCardExpanded';

export default function MasonryReviewGrid({ selectedReview, setSelectedReview, reviewList }) {
  // breakpoints for when an internal review is selected and the expanded panel appears
  const breakpointColumnsObj = useMemo(() => {
    const isInternal = selectedReview?.photos?.length > 0;
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
    const all = [...reviewList.internalReviews, ...reviewList.externalReviews];
    return all.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
  }, [reviewList]);

  return (
    <div className="flex gap-2">
      {/* Masonry columns */}
      <div className="flex-1">
        <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2" columnClassName="space-y-2">
          {combinedList.map(review =>
            review.photos?.length > 0 ? (
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
      {selectedReview?.photos?.length > 0 && (
        <ReviewCardExpanded selectedReview={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </div>
  );
}
