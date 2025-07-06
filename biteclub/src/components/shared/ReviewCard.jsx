import { useState } from 'react';
import StarRating from '@/components/shared/StarRating';
import Image from 'next/image';
import AuthorDateBlurb from './AuthorDateBlurb';
import reviewCardIconArr from '@/app/data/iconData';
import EngagementIconStat from './EngagementIconStat';
import FormattedDate from './formattedDate';
import EditModePanel from './EditModePanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faFlag } from '@fortawesome/free-solid-svg-icons';
import { ReportContentLink } from './ReportContentLink';
// faEllipsisVertical

/* "AddReviewForm" has two modes: Adding NEW reviews, and EDITING existing reviews.
    The parameter "editReviewMode" is false by default, but TRUE when user wants to edit review.*/
export default function ReviewCard({
  review,
  photos,
  onClick,
  isSelected,
  isOwner = false,
  isEditModeOn = false,
  setEditReviewForm = () => {},
}) {
  const [showReportFormLink, setShowReportFormLink] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [popupHovered, setPopupHovered] = useState(false);
  const shouldHighlight = cardHovered && !popupHovered;

  return (
    <div
      className={`relative border rounded-md border-brand-yellow-lite flex flex-col cursor-pointer transition 
    ${shouldHighlight ? 'bg-brand-peach-lite outline-brand-peach outline-2' : 'bg-white'}`}
      onClick={onClick}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      <div className="p-4 pt-2">
        {/* show link to open Report form when ... icon is clicked */}
        <FontAwesomeIcon
          icon={faEllipsis}
          className={`icon-lg text-brand-navy`}
          onClick={e => {
            e.stopPropagation();
            setShowReportFormLink(prev => !prev);
          }}
        />
        <div className="flex justify-between">
          <StarRating colour={'text-brand-green'} iconSize={'icon-lg'} ratingNum={review.rating} />
          <div>
            <EngagementIconStat
              iconArr={reviewCardIconArr}
              statNumArr={[review.likes?.count, review.comments?.length]}
            />
          </div>
        </div>
        <h3>{review.title}</h3>
        {/*TO DO for Cesca: Put word limit in review body preview.
        MISSING DYNAMIC VALUES: author name + pic*/}
        <p>{review.body.length > 600 ? review.body.slice(0, 600) + '…' : review.body}</p>
        {isOwner ? (
          <FormattedDate yyyymmdd={review.date_posted} />
        ) : (
          <AuthorDateBlurb authorPic={review.user_pic?.url} authorName={review.user_id} date={review.date_posted} />
        )}
      </div>

      {photos?.length > 0 && (
        <div className="flex-1 flex">
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={photos[0].url}
              alt={photos[0].caption}
              fill
              className="object-cover rounded-b-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
      )}
      {/* panel appears when general user selects to "Manage Content";
       General user can select review to delete or edit. Editing opens "Add Review" form but enabled for editing.  */}
      {isEditModeOn && <EditModePanel onEditClick={() => setEditReviewForm(true)} />}

      {/* show link to open report form */}
      {showReportFormLink && <ReportContentLink setPopupHovered={setPopupHovered} />}
    </div>
  );
}
