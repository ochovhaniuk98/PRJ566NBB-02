import { useState } from 'react';
import Image from 'next/image';
import EngagementIconStat from '../shared/EngagementIconStat';
import StarRating from '../shared/StarRating';
import AuthorDateBlurb from '../shared/AuthorDateBlurb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFlag, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import reviewCardIconArr from '@/app/data/iconData';
import FormattedDate from '../shared/formattedDate';

export default function ReviewCardExpanded({ selectedReview, onClose, isOwner = false }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleNext = () => {
    setPhotoIndex(prev => (prev + 1) % selectedReview.photos.length);
  };

  const handlePrev = () => {
    setPhotoIndex(prev => (prev === 0 ? selectedReview.photos.length - 1 : prev - 1));
  };

  return (
    <div className="w-1/3 hidden lg:block">
      <div className="sticky top-14 h-[calc(100vh-4.5rem)] overflow-auto scrollbar-none bg-white border border-brand-peach rounded-md shadow-md">
        <div className="p-4 bg-white w-full flex justify-between">
          {isOwner ? (
            <FormattedDate yyyymmdd={selectedReview.date_posted} />
          ) : (
            <AuthorDateBlurb
              authorPic={selectedReview.user_pic?.url}
              authorName={selectedReview.user_id}
              date={selectedReview.date_posted}
            />
          )}
          <div className="text-right">
            <FontAwesomeIcon icon={faFlag} className={`icon-md text-brand-navy mr-3`} />
            <FontAwesomeIcon icon={faXmark} className={`icon-md text-brand-navy`} onClick={onClose} />
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
              className="absolute left-2/5 bottom-0 -translate-y-1/2 bg-white  border border-brand-navy rounded-full p-1 w-8 aspect-square shadow-lg flex items-center justify-center cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowLeft} className={`icon-lg text-brand-navy`} />
            </button>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="absolute right-2/5 bottom-0 -translate-y-1/2 bg-white  border border-brand-navy rounded-full p-1 w-8 aspect-square shadow-lg flex items-center justify-center cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowRight} className={`icon-lg text-brand-navy`} />
            </button>
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between">
            <StarRating colour={'text-brand-green'} iconSize={'icon-lg'} ratingNum={selectedReview.rating} />
            <div>
              <EngagementIconStat
                iconArr={reviewCardIconArr}
                statNumArr={[selectedReview.likes?.count, selectedReview.comments?.length]}
              />
            </div>
          </div>
          <h3>{selectedReview.title}</h3>
          <p>{selectedReview.body}</p>
        </div>
      </div>
    </div>
  );
}
