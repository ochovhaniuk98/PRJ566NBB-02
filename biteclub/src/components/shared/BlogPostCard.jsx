import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as strokedHeart } from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';
import reviewCardIconArr from '@/app/data/iconData';
import EngagementIconStat from '@/components/shared/EngagementIconStat';
import FormattedDate from './formattedDate';
import AuthorDateBlurb from './AuthorDateBlurb';

// writtenByOwner: tracks whether post is written by profile owner
// isFavourited: tracks whether post is favourited
export default function BlogPostCard({ blogPostData, writtenByOwner = false, isFavourited = false }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="relative border rounded-md border-brand-yellow-lite flex flex-col cursor-pointer hover:bg-brand-peach-lite hover:outline-brand-peach hover:outline-2 row-span-2">
      <div className="px-4 pt-4">
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <FontAwesomeIcon
            icon={isHovered || isFavourited ? solidHeart : strokedHeart}
            className={`icon-xl absolute right-3 hover:text-brand-red ${
              isFavourited ? 'text-brand-red' : 'text-brand-navy'
            }`}
          />
        </div>
        <h3>{blogPostData.title}</h3>
        <p>{blogPostData.previewText}</p>
        <div className="flex justify-between items-center mb-4">
          {writtenByOwner ? (
            <FormattedDate yyyymmdd={blogPostData.date_posted} />
          ) : (
            <AuthorDateBlurb
              authorPic={'/img/placeholderImg.jpg'}
              authorName={'Sarah'}
              date={blogPostData.date_posted}
            />
          )}
          {/* ^^^ AUTHORDATEBLURB DATA NOT DYNAMIC ^^^ */}
          <EngagementIconStat
            iconArr={reviewCardIconArr}
            statNumArr={[blogPostData.likes.count, blogPostData.comments.length]}
          />
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="relative w-full overflow-hidden bg-brand-green rounded-b-md">
          {blogPostData.previewImage ? (
            <Image
              src={blogPostData.previewImage}
              alt="Preview image"
              fill={true}
              className="rounded-b-md object-cover w-full"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
