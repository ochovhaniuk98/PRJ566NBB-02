import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import Image from 'next/image';
import { Button } from '@/components/shared/Button';
import { faPen, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faUsers,
  faStarHalfStroke,
  faFeather,
  faGamepad,
  faGear,
  faXmark,
  faTrashCan,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';
import GridCustomCols from '@/components/shared/GridCustomCols';
import ReportForm from '../shared/ReportForm';

/* Description: Shows general user info and allows OWNER to write blog post or manage content by clicking corresponding buttons in component.
    showTextEditor: shows/hides text editor
    editMode: tracks whether owner is editing/managing CONTENT IN GENERAL (NOT a specific post/review)*/
export default function GeneralUserBanner({
  showTextEditor,
  setShowTextEditor,
  editMode = false,
  setEditMode,
  selectedTab,
  generalUserData,
  isOwner = false,
  blogPostsCount,
  handleDeleteSelectedBlogPosts,
  handleDeleteSelectedReviews,
  setDeleteAllTarget,
  setShowModal,
}) {
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info

  const { userData, loadingData, refreshUserData } = useUserData();
  const [reviewCount, setReviewCount] = useState(0);
  const [loadingReviewCount, setLoadingReviewCount] = useState(true);
  const [openReportForm, setOpenReportForm] = useState(false); // for reporting user

  // if the authenticated user is the owner of this profile, we set the generalUserData._id to this user. If not, fetch from DB.
  const anotherUserId = !isOwner ? generalUserData._id : null;

  const iconStats = [
    {
      label: 'Followers',
      icon: faUsers,
      bgColour: 'white',
      iconColour: 'brand-aqua',
      statNum: generalUserData?.followers?.length || 0,
    },
    {
      label: 'Reviews',
      icon: faStarHalfStroke,
      bgColour: 'white',
      iconColour: 'brand-yellow',
      // statNum: generalUserData?.myReviews?.length || 0,
      statNum: reviewCount || 0,
    },
    {
      label: 'Blog Posts',
      icon: faFeather,
      bgColour: 'white',
      iconColour: 'brand-peach',
      statNum: blogPostsCount || 0,
    },
    {
      label: 'Challenges',
      icon: faGamepad,
      bgColour: 'white',
      iconColour: 'brand-green',
      statNum: generalUserData?.challenges?.length || 0,
    },
  ];

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const res = await fetch(`/api/generals/${generalUserData._id}/get-review-count`);
        const data = await res.json();
        setReviewCount(data.total || 0);
      } catch (err) {
        console.error('Failed to fetch review count:', err);
      } finally {
        setLoadingReviewCount(false);
      }
    };

    if (generalUserData._id) {
      setLoadingReviewCount(true);
      fetchReviewCount();
    }
  }, [generalUserData._id]);

  const isFollowing = useMemo(() => {
    if (isOwner || !userData?._id) return true;
    return userData.followings?.includes(generalUserData._id) || false;
  }, [userData, generalUserData._id, isOwner, loadingData]);

  if (loadingData || loadingReviewCount) return <div className="my-12" />;

  // ========
  // HANDLERS
  // ========
  const handleFollowClick = async () => {
    // Since we are not the owner of this profile:
    // - The "Follow" button is shown
    // - We need to fetch authUser's Supabase ID to send to the API route
    if (!anotherUserId || !user.id) return;

    try {
      const res = await fetch('/api/generals/follow-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseUserId: user.id, anotherUserId }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to follow / unfollow user');

      await refreshUserData();
    } catch (err) {
      console.error('Error toggling follow:', err.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-brand-yellow-extralite relative pb-4">
      <div className="pt-14 flex xl:flex-row flex-col">
        {/*profile pic*/}
        <div className=" flex md:flex-row flex-col justify-center md:items-start items-center">
          <div className="relative lg:size-50 size-40 rounded-full border border-white bg-brand-green mx-4">
            {generalUserData.userProfilePicture && (
              <Image
                src={generalUserData.userProfilePicture.url}
                alt={generalUserData.userProfilePicture.caption}
                fill={true}
                className="rounded-full object-cover w-full"
              />
            )}
          </div>
        </div>
        {/*user name, bio, join date, follow btn*/}
        <div className="flex flex-col xl:items-start items-center gap-4 md:mr-4 mr-0 md:pt-4 pt-0">
          <span className="text-4xl font-bold font-primary mb-1">{generalUserData.username}</span>
          <div className="min-h-24 py-4 px-4 mb-4 rounded-xl bg-brand-yellow-lite/40 w-xs">
            <p className="text-left">{generalUserData.userBio}</p>
          </div>
          {/* JOIN DATE DISPLAY IF AVAILABLE */}
          {generalUserData?.joinedSince && (
            <h5>
              Joined Since:{' '}
              {new Date(generalUserData.joinedSince).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h5>
          )}

          {/* Follow button -- only show if you're not the owner of the dashboard (you cannot follow yourself) */}
          {!isOwner && (
            <Button
              type="submit"
              className="w-40"
              variant={isFollowing ? 'secondary' : 'default'}
              onClick={handleFollowClick}
            >
              <FontAwesomeIcon icon={isFollowing ? faUserMinus : faPlus} className="text-3xl text-navy" />
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
        {/* profile stats */}
        <div className=" flex xl:flex-col flex-wrap xl:justify-normal lg:gap-x-0 gap-x-4 justify-center">
          {iconStats.map((stat, i) => (
            <ProfileStat key={i} statNum={stat.statNum} stat={stat} idx={i} />
          ))}
        </div>
      </div>
      {/*'Write a blog post' button*/}
      {/*only shown when not editing and not writing */}
      {!showTextEditor && isOwner && (
        <div className="flex  gap-0 xl:absolute xl:bottom-0 xl:right-20 xl:mt-0 mt-4">
          {!editMode && (
            <SingleTabWithIcon
              className=""
              icon={faPen}
              detailText="Write a Blog Post"
              onClick={() => setShowTextEditor(true)}
            />
          )}

          {/* Progile management buttons */}
          {/* If Owner clicks "Manage Content", show delete and cancel buttons */}
          {!editMode ? (
            <SingleTabWithIcon icon={faGear} detailText="Manage Content" onClick={() => setEditMode(true)} />
          ) : (
            <>
              {/* only delete SELECTED */}
              <SingleTabWithIcon
                icon={faTrashCan}
                detailText="Delete Selected"
                bgColour="bg-white"
                textColour="text-brand-red"
                borderColour="border-brand-red"
                // onClick={handleDeleteSelectedBlogPosts}
                onClick={() => {
                  if (selectedTab === 'Reviews') {
                    handleDeleteSelectedReviews?.();
                  } else if (selectedTab === 'Blog Posts') {
                    handleDeleteSelectedBlogPosts?.();
                  }
                }}
              />
              {/* delete All */}
              <SingleTabWithIcon
                icon={faTrashCan}
                detailText="Delete All"
                bgColour="bg-brand-red"
                textColour="text-white"
                onClick={() => {
                  if (selectedTab === 'Reviews') {
                    setDeleteAllTarget('reviews');
                    setShowModal(true); // confirmation modal
                  } else if (selectedTab === 'Blog Posts') {
                    setDeleteAllTarget('blogPosts');
                    setShowModal(true); // confirmation modal
                  }
                }}
              />
              {/* cancel content management */}
              <SingleTabWithIcon
                icon={faXmark}
                detailText="Cancel"
                onClick={() => setEditMode(false)}
                bgColour="bg-brand-peach"
              />
            </>
          )}
        </div>
      )}

      {/* Icon to open Report User Form */}
      {!isOwner && (
        <div
          className="absolute bottom-3 right-6 flex items-center font-primary text-brand-navy cursor-pointer"
          onClick={() => setOpenReportForm(true)}
        >
          <FontAwesomeIcon icon={faFlag} className={`icon-sm text-brand-navy mr-2`} />
          <h5>Report User</h5>
        </div>
      )}
      {openReportForm && (
        <ReportForm
          reportType="user"
          onClose={() => setOpenReportForm(false)}
          contentType="User"
          reportedUser={generalUserData}
        />
      )}
    </div>
  );
}

function ProfileStat({ statNum, stat, idx }) {
  const statColours = ['#56e4be', '#ffb300', '#ffdcbe', '#80c001'];
  return (
    <div className="flex items-center gap-3 pt-1 pb-2 min-w-36">
      <div>
        {/* Note: having issues displaying custom yellow colour on border. Ignore temporary fix below. */}
        <div
          className={`rounded-full bg-white border ${
            stat.iconColour != 'brand-yellow' ? 'border-' + stat.iconColour : 'border-yellow-500'
          } w-12 h-12  flex justify-center items-center`}
        >
          <FontAwesomeIcon icon={stat.icon} className={`text-3xl`} style={{ color: statColours[idx] }} />
        </div>
      </div>
      <div>
        <span className="font-secondary text-3xl">{statNum}</span>
        <p className="leading-none text-sm">{stat.label}</p>
      </div>
    </div>
  );
}
