import { createClient } from '@/lib/auth/client';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinus,
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
import { faPen } from '@fortawesome/free-solid-svg-icons';
import GridCustomCols from '@/components/shared/GridCustomCols';
import { Button } from '@/components/shared/Button';
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
  handleDeleteSelectedBlogPosts,
  handleDeleteAllBlogPosts,
  handleDeleteSelectedReviews,
  handleDeleteAllReviews,
  blogPostsCount,
  setShowModal,
  setDeleteAllTarget,
}) {
  const [reviewCount, setReviewCount] = useState(0);
  const [openReportForm, setOpenReportForm] = useState(false); // for reporting user

  useEffect(() => {
    const fetchReviewCount = async () => {
      const res = await fetch(`/api/generals/${generalUserData._id}/get-review-count`);
      const data = await res.json();
      setReviewCount(data.total || 0);
    };

    if (generalUserData._id) fetchReviewCount();
  }, [generalUserData._id]);

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
      statNum: generalUserData?.challenges?.length || 0, // !!! TODO: (commented in sprint 2) should we have Challenges in db USER schema
    },
  ];

  // if the authenticated user is the owner of this profile, we set the generalUserData._id to this user. If not, fetch from DB.
  const [isFollowing, setIsFollowing] = useState(false);
  const [authUserId, setAuthUserId] = useState(null);
  const anotherUserId = !isOwner ? generalUserData._id : null;

  useEffect(() => {
    if (isOwner) return;

    // If we miss Ids, we cannot perform check.
    if (!anotherUserId) {
      console.log('(isFollowing) anotherUserId: ', anotherUserId);
      console.error('anotherUserId is missing -- skipping check');
      return;
    }

    const checkFollowingStatus = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user?.id) return;

        const res = await fetch(`/api/generals/is-following?authId=${data.user.id}&fId=${anotherUserId}`);
        const result = await res.json();
        if (res.ok) setIsFollowing(result.isFollowing);
      } catch (err) {
        console.error('Error checking favourite status:', err.message);
      }
    };

    checkFollowingStatus();
  }, [anotherUserId, isOwner]);

  const handleFollowClick = async () => {
    // Since we are not the owner of this profile:
    // - The "Follow" button is shown
    // - We need to fetch authUser's Supabase ID to send to the API route
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (!error) setAuthUserId(data.user.id);

    if (!anotherUserId || !authUserId) return;

    try {
      const res = await fetch('/api/generals/follow-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseUserId: authUserId, anotherUserId }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to follow / unfollow user');

      setIsFollowing(result.isFollowing); // Update state
    } catch (err) {
      console.error('Error toggling follow:', err.message);
    }
  };

  return (
    <div className="main-side-padding w-full flex flex-col items-center bg-brand-yellow-extralite relative">
      <GridCustomCols numOfCols={3} className="pt-14 px-60 pb-8 ">
        {/*profile pic*/}
        <div className=" flex justify-end">
          <div className="relative max-h-60 aspect-square rounded-full border border-white bg-white mx-4">
            <Image
              src={generalUserData.userProfilePicture.url}
              alt={generalUserData.userProfilePicture.caption}
              fill={true}
              className="rounded-full object-cover w-full"
            />
          </div>
        </div>
        {/*user name, bio, join date, follow btn*/}
        <div className="flex flex-col gap-2">
          <h1>{generalUserData.username}</h1>
          <div className="min-h-28 py-4">
            <p>{generalUserData.userBio}</p>
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
              <FontAwesomeIcon icon={isFollowing ? faMinus : faPlus} className="text-3xl text-navy" />
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
        <div className="transparent">
          {iconStats.map((stat, i) => (
            <ProfileStat key={i} statNum={stat.statNum} stat={stat} />
          ))}
        </div>
      </GridCustomCols>
      {/*'Write a blog post' button*/}
      {/*only shown when not editing and not writing */}
      {!showTextEditor && isOwner && (
        <div className="flex gap-0 absolute bottom-0 right-20">
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
                detailText="DELETE ALL"
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
        <ReportForm reportType="user" onClose={() => setOpenReportForm(false)} reportedUser={generalUserData} />
      )}
    </div>
  );
}

function ProfileStat({ statNum, stat }) {
  return (
    <div className="flex items-center gap-3 pt-1 pb-2">
      <div>
        {/* Note: having issues displaying custom yellow colour on border. Ignore temporary fix below. */}
        <div
          className={`rounded-full bg-white border ${
            stat.iconColour != 'brand-yellow' ? 'border-' + stat.iconColour : 'border-yellow-500'
          } w-12 h-12  flex justify-center items-center`}
        >
          <FontAwesomeIcon icon={stat.icon} className={`text-3xl ${'text-' + stat.iconColour}`} />
        </div>
      </div>
      <div>
        <span className="font-secondary text-3xl">{statNum}</span>
        <p className="leading-none text-sm">{stat.label}</p>
      </div>
    </div>
  );
}
