'use client';
import Masonry from 'react-masonry-css';
import { useEffect } from 'react';
import ReviewCard from '../shared/ReviewCard';

export default function InstagramGrid({ reviewList }) {
  const postUrls = [
    'https://www.instagram.com/p/DKNfC14vUbj/',
    'https://www.instagram.com/p/CIuTl-CBE1z/',
    'https://www.instagram.com/p/Cqyd4k5OLIY/?img_index=1',
    'https://www.instagram.com/p/CokYC2Jr20p/?img_index=2',
    'https://www.instagram.com/p/DKNfC14vUbj/',
    'https://www.instagram.com/p/DKNfC14vUbj/',
  ];

  useEffect(() => {
    const scriptId = 'instagram-embed-script';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.instgrm?.Embeds?.process) {
          window.instgrm.Embeds.process();
        }
      };
    } else {
      window.instgrm?.Embeds?.process?.();
    }
  }, []);

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  if (!reviewList || (!reviewList?.internalReviews?.length && !reviewList?.externalReviews?.length)) {
    return <div className="col-span-3 text-center text-gray-500">No reviews available</div>;
  }

  const combinedList = [...reviewList?.internalReviews, ...reviewList?.externalReviews];
  const randomizedReviewList = combinedList.sort(() => Math.random() - 0.5);

  return (
    <div className="p-0">
      <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2" columnClassName="space-y-2">
        {randomizedReviewList.map((review, i) =>
          review.photos ? (
            <ReviewCard key={i} review={review} photos={review.photos} />
          ) : (
            <div key={i} className="border rounded-md border-brand-grey">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={review.content?.embedLink}
                data-instgrm-version="14"
                data-instgrm-captioned
                style={{ width: '100%' }}
              ></blockquote>
            </div>
          )
        )}
      </Masonry>
    </div>
  );
}
