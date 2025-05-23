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

  return (
    <GridCustomCols numOfCols={4} responsiveHeight={instagramHeight / 2}>
      {selectedReview ? (
        <>
          {/* Left two columns: nested grid of reviews */}
          <div className="col-span-3 grid grid-cols-3 gap-3">
            {reviewList.map((review, i) =>
              review.type === 'review' ? (
                <ReviewCard
                  key={i}
                  review={review}
                  photos={review.data.photos}
                  onClick={() => setSelectedReview(review.data)}
                  isSelected={selectedReview?.title === review.data.title} // needs unique id
                />
              ) : (
                <InstagramEmbed
                  key={i}
                  postUrl={review.embedLink}
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
        reviewList.map((review, i) =>
          //<ReviewCard key={i} review={review} photos={review.photos} onClick={() => setSelectedReview(review)} />

          review.type === 'review' ? (
            <ReviewCard key={i} review={review} photos={review.data.photos} onClick={() => setSelectedReview(review)} />
          ) : (
            <InstagramEmbed key={i} postUrl={review.embedLink} onHeightChange={height => setInstagramHeight(height)} />
          )
        )
      )}
    </GridCustomCols>
  );
}
