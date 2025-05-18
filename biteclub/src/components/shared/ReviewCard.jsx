import StarRating from '@/components/shared/StarRating';
import Image from 'next/image';
import AuthorDateBlurb from './AuthorDateBlurb';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import reviewCardIconArr from '@/app/data/iconData';
import EngagementIconStat from './EngagementIconStat';

export default function ReviewCard({ imageSrc, onClick, isSelected }) {
  console.log('ISSELECTED: ', isSelected);
  return (
    <div
      className={`${
        isSelected ? 'bg-brand-peach-lite' : 'bg-white'
      } border rounded-md border-brand-yellow-lite flex flex-col cursor-pointer hover:bg-brand-peach-lite hover:outline-brand-peach hover:outline-2 ${
        imageSrc?.length > 0 ? 'row-span-2' : 'row-span-1'
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between">
          <StarRating colour={'text-brand-green'} iconSize={'icon-lg'} ratingNum={3} />
          {/* Engagement icons */}
          <div>
            <EngagementIconStat iconArr={reviewCardIconArr} statNumArr={[237, 14]} />
          </div>
        </div>
        <h3>Review Title</h3>
        {/*TO DO: Put word limit in review body preview*/}
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam velit libero, vehicula sed cursus non, blandit
          et neque. Ut interdum tincidunt nibh, et pellentesque ligula tincidunt eget. Maecenas eget pulvinar massa,
          eget interdum nisi...
        </p>
        <AuthorDateBlurb authorPic="/img/profilepic.jpg" authorName="Sally Johnson" date="June 13, 2025" />
      </div>
      {imageSrc?.length > 0 && (
        <div className="flex gap-x-1">
          <div className="relative w-1/2 h-50 overflow-hidden">
            <Image src={imageSrc[0]} alt="profile pic" className="object-cover rounded-bl-md " fill={true} />
          </div>
          <div className="relative w-1/2 h-50 overflow-hidden">
            <Image src={imageSrc[1]} alt="profile pic" className="object-cover rounded-br-md" fill={true} />
          </div>
        </div>
      )}
    </div>
  );
}
