import StarRating from '@/components/shared/StarRating';
import Image from 'next/image';
import AuthorDateBlurb from './AuthorDateBlurb';
import reviewCardIconArr from '@/app/data/iconData';
import EngagementIconStat from './EngagementIconStat';

export default function ReviewCard({ review, photos, onClick, isSelected }) {
  //console.log('IMAGESRC: ', review.data);
  return (
    <div
      className={`${
        isSelected ? 'bg-brand-peach-lite' : 'bg-white'
      } border rounded-md border-brand-yellow-lite flex flex-col cursor-pointer hover:bg-brand-peach-lite hover:outline-brand-peach hover:outline-2 ${
        photos?.length > 0 ? 'row-span-2' : 'row-span-1'
      }`}
      onClick={onClick}
    >
      <div className="p-4">
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
        <p>{review.body}</p>
        <AuthorDateBlurb authorPic={review.user_pic?.url} authorName={review.user_id} date={review.date_posted} />
      </div>

      {photos?.length > 0 && (
        <div className="flex-1 flex">
          <div className="relative w-full overflow-hidden">
            <Image src={photos[0].url} alt={photos[0].caption} className="object-cover rounded-b-md" fill={true} />
          </div>
        </div>
      )}
    </div>
  );
}
/*
${
        photos?.length > 0 ? 'row-span-2' : 'row-span-1'
      } */
/*
 {photos[1] && (
            <div className="relative w-1/2 h-50 overflow-hidden">
              <Image src={photos[1].url} alt={photos[1].caption} className="object-cover rounded-br-md" fill={true} />
            </div>
          )} */
