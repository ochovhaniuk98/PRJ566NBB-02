import { createClient } from '@/lib/auth/client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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
} from '@fortawesome/free-solid-svg-icons';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import GridCustomCols from '@/components/shared/GridCustomCols';
import { Button } from '@/components/shared/Button';

/* Description: Shows general user info and allows OWNER to write blog post or manage content by clicking corresponding buttons in component.
    showTextEditor: shows/hides text editor
    editMode: tracks whether owner is editing/managing CONTENT IN GENERAL (NOT a specific post/review)*/
export default function GeneralUserBanner({
  showTextEditor,
  setShowTextEditor,
  editMode = false,
  setEditMode,
  generalUserData,
  isOwner = false,
}) {
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
      statNum: generalUserData?.myReviews?.length || 0,
    },
    {
      label: 'Blog Posts',
      icon: faFeather,
      bgColour: 'white',
      iconColour: 'brand-peach',
      statNum: generalUserData?.myBlogPosts?.length || 0,
    },
    {
      label: 'Challenges',
      icon: faGamepad,
      bgColour: 'white',
      iconColour: 'brand-green',
      statNum: generalUserData?.challenges?.length || 0, // !!! TODO: (commented in sprint 2) should we have Challenges in db USER schema
    },
  ];

  // If the current user is the owner, we can use generalUserData directly as userId.
  const [currentUserId, setCurrentUserId] = useState(isOwner ? generalUserData._id : null);
  const [anotherUserId, setAnotherUserId]= useState(!isOwner ? generalUserData._id : null);

  const getSupabaseUserId = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user?.id) {
        console.error('Supabase user not logged in:', error?.message);
        return null;
      }

      return data.user.id;
    } catch (err) {
      console.error('Error retrieving Supabase user ID:', err.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchMongoUserId = async () => {
      const supabaseUserId = await getSupabaseUserId();
      if (!supabaseUserId) return;

      try {
        const mongoUserId = await getGeneralUserMongoIDbySupabaseId({ supabaseId: supabaseUserId });

        if (!mongoUserId) {
          console.error(`MongoDB User ID not found for Supabase ID: ${supabaseUserId}`);
          return;
        }

        setCurrentUserId(mongoUserId);
      } catch (err) {
        console.error('Error fetching MongoDB user ID:', err.message);
      }
    };

    // Only fetch user ID if not the owner and userId is not already set
    if (!isOwner && !currentUserId) {
      fetchMongoUserId();
    }
  }, [isOwner, currentUserId]); // Only re-run this effect when isOwner or userId changes

  // If (isOwner == true), generalUserData = CURRENT userData. Else (i.e. !isOwner), generalUserData = ANOTHER userData
  // If (!isOwner), fetch current user data (e.g. my own data).
  // If follow, add THEIR id to my "follower" array, and add MY id to their "followings" array
  // If unfollow, remove THEIR id from my "follower" array, and remove MY id from their "followings" array
  const handleFollowClick = () => {
    // POST call: similar to save-as-favourite
    // GET call: similar to isFollowing
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
            <Button type="submit" className="w-40" variant="default" onClick={handleFollowClick}>
              <FontAwesomeIcon icon={faPlus} className={`text-3xl text-navy`} />
              Follow
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
              />
              {/* delete All */}
              <SingleTabWithIcon
                icon={faTrashCan}
                detailText="DELETE ALL"
                bgColour="bg-brand-red"
                textColour="text-white"
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
