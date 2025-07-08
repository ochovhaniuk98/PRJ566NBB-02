import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/auth/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faHeart as strokedHeart } from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';
import reviewCardIconArr from '@/app/data/iconData';
import EngagementIconStat from '@/components/shared/EngagementIconStat';
import FormattedDate from './formattedDate';
import AuthorDateBlurb from './AuthorDateBlurb';
import EditModePanel from './EditModePanel';
import { ReportContentLink } from './ReportContentLink';

// Description: BlogPostCard has multiple states: A post can be available to be edited (EditModePanel will appear),
// and it can be selected for editing (text editor will appear with prepopulated data of post)
// PARAMS:
// writtenByOwner: tracks whether post is written by profile owner
// isEditModeOn: tracks whether GENERAL user is managing content on their profile
export default function BlogPostCard({
  blogPostData,
  writtenByOwner = false,
  setShowTextEditor = () => {},
  setEditBlogPost = null,
  isEditModeOn = false,
  isSelected = false,
  onSelect = () => {},
  onDeleteClick, // optional — do NOT provide a default
}) {
  const supabase = createClient();
  const [isHovered, setIsHovered] = useState(false); // tracks when user hovers over heart icon
  const [isFavourited, setIsFavourited] = useState(false); // tracks whether post is favourited
  const blogId = blogPostData._id;

  const [showReportFormLink, setShowReportFormLink] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [popupHovered, setPopupHovered] = useState(false);
  const shouldHighlight = cardHovered && !popupHovered;

  // Check if this restaurant is favourited by current user
  useEffect(() => {
    const checkFavouriteStatus = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user?.id) return;

        const res = await fetch(`/api/blog-posts/is-favourited?authId=${data.user.id}&blogId=${blogId}`);

        const result = await res.json();
        if (res.ok) {
          setIsFavourited(result.isFavourited);
        }
      } catch (err) {
        console.error('Error checking favourite status:', err.message);
      }
    };
    checkFavouriteStatus();
  }, [blogId]);

  const handleFavouriteBlogPostClick = async e => {
    e.stopPropagation();

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user?.id) throw new Error('User not logged in');

      const res = await fetch('/api/blog-posts/save-as-favourite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId,
          supabaseUserId: data.user.id,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to toggle favourite');

      setIsFavourited(result.isFavourited);
    } catch (err) {
      console.error('Error toggling favourite:', err.message);
    }
  };

  return (
    <div
      className={`relative border rounded-md border-brand-yellow-lite flex flex-col cursor-pointer transition
    ${shouldHighlight ? 'bg-brand-peach-lite outline-brand-peach outline-2' : 'bg-white'}
  `}
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
        <div
          onClick={handleFavouriteBlogPostClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FontAwesomeIcon
            icon={isHovered || isFavourited ? solidHeart : strokedHeart}
            className={`icon-xl absolute right-3 hover:text-brand-red ${
              isFavourited ? 'text-brand-red' : 'text-brand-navy'
            }`}
          />
        </div>
        <Link href={`/blog-posts/${blogId}`} className="no-underline text-inherit">
          <h3>{blogPostData.previewTitle}</h3>
          <p>{blogPostData.previewText}</p>
        </Link>
        <div className="flex justify-between items-center mb-4">
          {writtenByOwner ? (
            <FormattedDate yyyymmdd={blogPostData.date_posted} />
          ) : (
            blogPostData?.user_id?.userProfilePicture?.url && (
              <AuthorDateBlurb
                authorPic={blogPostData.user_id?.userProfilePicture.url}
                authorName={blogPostData.user_id?.username}
                date={blogPostData.date_posted}
              />
            )
          )}
          <EngagementIconStat
            iconArr={reviewCardIconArr}
            statNumArr={[blogPostData.likes.count, blogPostData.comments.length]}
          />
        </div>
      </div>
      {blogPostData.previewImage ? (
        <div className="flex flex-col h-full">
          <div className="relative w-full overflow-hidden rounded-b-md aspect-3/2 mt-auto">
            <Image
              src={blogPostData.previewImage}
              alt="Preview image"
              fill={true}
              className="rounded-b-md object-cover w-full"
            />
          </div>
        </div>
      ) : null}
      {/* EditModePanel appears when general user selects to "Manage Content";
      General user can select blog post to delete or edit. Editing opens the text editor. */}
      {isEditModeOn && (
        <EditModePanel
          isSelected={isSelected}
          onSelect={onSelect}
          onEditClick={() => {
            setShowTextEditor(true);
            if (setEditBlogPost) {
              setEditBlogPost(true);
            }
          }}
          onDeleteClick={onDeleteClick} // will be undefined if not passed
        />
      )}

      {/* show link to open report content form */}
      {showReportFormLink && (
        <ReportContentLink setPopupHovered={setPopupHovered} contentTitle={blogPostData.previewTitle} />
      )}
    </div>
  );
}
