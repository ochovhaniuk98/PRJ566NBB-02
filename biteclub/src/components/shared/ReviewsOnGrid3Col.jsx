import GridCustomCols from '@/components/shared/GridCustomCols';
import ReviewCard from '@/components/shared/ReviewCard';
import ExpandedReviewCard from '@/components/shared/ExpandedReviewCard';

/* Description: Series of reviews that appear inside 3-column grid (GridCustomCols componenent).
If a review, is clicked, show 2 columns of reviews and the clicked expanded review on the third column. */
export default function ReviewsOnGrid3Col({ selectedReview, setSelectedReview, reviewList }) {
  return (
    <GridCustomCols numOfCols={3}>
      {selectedReview ? (
        <>
          {/* Left two columns: nested grid of reviews */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            {reviewList.map(review => (
              <ReviewCard
                key={review.id}
                imageSrc={review.photos}
                onClick={() => setSelectedReview(review)}
                isSelected={selectedReview?.id === review.id}
              />
            ))}
          </div>
          {/* Third column: expanded review */}
          <ExpandedReviewCard review={selectedReview} onClose={() => setSelectedReview(null)} />
        </>
      ) : (
        // Default 3-column review grid
        reviewList.map((review, i) => (
          <ReviewCard key={i} review={review} photos={review.photos} onClick={() => setSelectedReview(review)} />
        ))
      )}
    </GridCustomCols>
  );
}
