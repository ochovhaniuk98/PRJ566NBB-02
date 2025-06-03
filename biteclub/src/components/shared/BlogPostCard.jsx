import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as strokedHeart } from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';
import reviewCardIconArr from '@/app/data/iconData';
import EngagementIconStat from '@/components/shared/EngagementIconStat';
import FormattedDate from './formattedDate';
import AuthorDateBlurb from './AuthorDateBlurb';
import Link from 'next/link';
import EditModePanel from './EditModePanel';

// Description: BlogPostCard has multiple states: A post can be available to be edited (EditModePanel will appear),
// and it can be selected for editing (text editor will appear with prepopulated data of post)
// PARAMS:
// writtenByOwner: tracks whether post is written by profile owner
// isFavourited: tracks whether post is favourited
// isEditModeOn: tracks whether GENERAL user is managing content on their profile
export default function BlogPostCard({
  blogPostData,
  writtenByOwner = false,
  isFavourited = false,
  isEditModeOn = false,
  setShowTextEditor = () => {},
  setEditBlogPost = () => {},
}) {
  const [isHovered, setIsHovered] = useState(false); // tracks when user hovers over heart icon

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
        <Link href={`/blog-posts/${blogPostData._id}`} className="no-underline text-inherit">
          <h3>{blogPostData.previewTitle}</h3>
          <p>{blogPostData.previewText}</p>
        </Link>
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
        <div className="relative w-full overflow-hidden rounded-b-md">
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
      {/* EditModePanel appears when general user selects to "Manage Content";
      General user can select blog post to delete or edit. Editing opens the text editor. */}
      {isEditModeOn && (
        <EditModePanel
          onEditClick={() => {
            setShowTextEditor(true);
            setEditBlogPost(true);
          }}
        />
      )}
    </div>
  );
}
