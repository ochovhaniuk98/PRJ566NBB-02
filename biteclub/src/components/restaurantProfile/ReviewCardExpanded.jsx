import { useEffect, useState } from 'react';
// import { createClient } from '@/lib/auth/client';
import Image from 'next/image';
import EngagementIconStat from '../shared/EngagementIconStat';
import StarRating from '../shared/StarRating';
import AuthorDateBlurb from '../shared/AuthorDateBlurb';
import ReportForm from '../shared/ReportForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faFlag,
  faArrowLeft,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import reviewCardIconArr from '@/app/data/iconData';
import FormattedDate from '../shared/formattedDate';
import { ChevronLeft } from 'lucide-react';
import CommentSection from '../shared/CommentSection';
import { fakeUser, fakeComment } from '@/app/data/fakeData';

export default function ReviewCardExpanded({ selectedReview, onClose, isOwner = false }) {
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
  const comments = [];
  const [openReportForm, setOpenReportForm] = useState(false);

  const handleNext = () => {
    setPhotoIndex(prev => (prev + 1) % selectedReview.photos.length);
  };
  const handlePrev = () => {
    setPhotoIndex(prev => (prev === 0 ? selectedReview.photos.length - 1 : prev - 1));
  };

  return (
    <div className="w-1/3 hidden lg:block">
      <div className="sticky top-14 h-[calc(100vh-4.5rem)] overflow-auto scrollbar-none bg-white border-2 border-brand-peach rounded-md shadow-md">
        <div className="p-4  bg-white w-full flex justify-between">
          {isOwner ? (
            <FormattedDate yyyymmdd={selectedReview.date_posted} />
          ) : (
            <AuthorDateBlurb
              authorPic={selectedReview.user_id?.userProfilePicture?.url}
              authorName={selectedReview.user_id?.username}
              date={selectedReview.date_posted}
            />
          )}
          <div className="text-right">
            <FontAwesomeIcon
              icon={faFlag}
              className={`icon-md text-brand-navy mr-3 cursor-pointer`}
              onClick={() => setOpenReportForm(true)}
            />
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
                statNumArr={[selectedReview?.likes?.count, selectedReview?.comments?.length]}
              />
            </div>
          </div>
          <h3>{selectedReview.title}</h3>
          <p>{selectedReview.body}</p>
          <div>
            <CommentSection currentUser={fakeUser} comments={[fakeComment]} />
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
