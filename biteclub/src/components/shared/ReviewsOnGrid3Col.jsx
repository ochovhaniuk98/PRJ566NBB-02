'use client';
import { useState } from 'react';
import GridCustomCols from '@/components/shared/GridCustomCols';
import ReviewCard from '@/components/shared/ReviewCard';
import ExpandedReviewCard from '@/components/shared/ExpandedReviewCard';
import InstagramEmbed from '../restaurantProfile/InstagramEmbed';

/* Description: Series of reviews that appear inside 3-column grid (GridCustomCols componenent).
If a review, is clicked, show 2 columns of reviews and the clicked expanded review on the third column. */
export default function ReviewsOnGrid3Col({ selectedReview, setSelectedReview, reviewList }) {
  const [instagramHeight, setInstagramHeight] = useState(0);
  // dynamically store insta post container's height so that the 3-col grid's rows can resize accordingly

  if (!reviewList || (!reviewList?.internalReviews?.length && !reviewList?.externalReviews?.length)) {
    return <div className="col-span-3 text-center text-gray-500">No reviews available</div>;
  }

  const combinedList = [...reviewList?.internalReviews, ...reviewList?.externalReviews];
  const randomizedReviewList = combinedList.sort(() => Math.random() - 0.5);

  return (
    <GridCustomCols numOfCols={4} responsiveHeight={instagramHeight / 2}>
      {selectedReview ? (
        <>
          {/* Left two columns: nested grid of reviews */}
          <div className="col-span-3 grid grid-cols-3 gap-3">
            {randomizedReviewList.map((review, i) =>
              review.photos ? (
                <ReviewCard
                  key={i}
                  review={review}
                  photos={review.photos}
                  onClick={() => setSelectedReview(review)}
                  isSelected={selectedReview?._id === review._id} // highlight selected review
                />
              ) : (
                <InstagramEmbed
                  key={i}
                  postUrl={review.content?.embedLink}
                  onHeightChange={height => setInstagramHeight(height)}
                />
              )
            )}
          </div>
          {/* Third column: expanded review */}
          <ExpandedReviewCard review={selectedReview} onClose={() => setSelectedReview(null)} />
        </>
      ) : (
        // Default 3-column review grid
        randomizedReviewList.map((review, i) =>
          review.photos ? (
            <ReviewCard key={i} review={review} photos={review.photos} onClick={() => setSelectedReview(review)} />
          ) : (
            <InstagramEmbed
              key={i}
              postUrl={review.content?.embedLink}
              onHeightChange={height => setInstagramHeight(height)}
            />
          )
        )
      )}
    </GridCustomCols>
  );
}
