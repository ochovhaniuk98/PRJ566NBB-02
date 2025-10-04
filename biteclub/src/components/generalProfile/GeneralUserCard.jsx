import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import ReportForm from '../shared/ReportForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faUsers,
  faStarHalfStroke,
  faFeather,
  faGamepad,
  faEllipsisVertical,
  faCircleXmark,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';

// isFollowing: tracks whether or not the owner is following the user displayed on this card
export default function GeneralUserCard({ generalUserData, onFollowingToggle = () => {} }) {
  const router = useRouter();
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info

  const { userData, loadingData, refreshUserData } = useUserData();
  const generalUserUrl = `/generals/${generalUserData._id}`;
  const [reviewCount, setReviewCount] = useState(0);
  const [loadingReviewCount, setLoadingReviewCount] = useState(true);

  const [showMorePopup, setShowMorePopup] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [popupHovered, setPopupHovered] = useState(false);
  const shouldHighlight = cardHovered && !popupHovered;

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
      statNum: reviewCount || 0, // uses reviewCount like original
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
      statNum: generalUserData?.challenges?.length || 0,
    },
  ];

  const [openReportForm, setOpenReportForm] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!userData || !generalUserData._id) {
      setIsOwner(false);
      return;
    }
    setIsOwner(userData._id === generalUserData._id);
  }, [userData, generalUserData._id]);

  const anotherUserId = !isOwner ? generalUserData._id : null;

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const res = await fetch(`/api/generals/${generalUserData._id}/get-review-count`);
        const data = await res.json();
        setReviewCount(data.total || 0);
      } catch (error) {
        console.error('Error fetching review count:', error);
      }
      setLoadingReviewCount(false);
    };

    if (generalUserData._id) fetchReviewCount();
  }, [generalUserData._id]);

  const isFollowing = useMemo(() => {
    if (loadingData || isOwner) return true;
    return userData?.followings?.includes(generalUserData._id) || false;
  }, [userData, generalUserData._id, isOwner, loadingData]);

  if (loadingData || loadingReviewCount) {
    return <div className="my-12" />;
  }

  const handleFollowClick = async e => {
    e.stopPropagation();

    if (!user?.id || !anotherUserId) return;
    try {
      const res = await fetch('/api/generals/follow-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseUserId: user.id, anotherUserId }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to follow / unfollow user');

      await refreshUserData();
      onFollowingToggle(result.isFollowing, anotherUserId);
    } catch (err) {
      console.error('Error toggling follow:', err.message);
    }
  };

  return (
    <div className="w-full" onClick={() => router.push(generalUserUrl)}>
      <div
        className={`w-full max-h-64 aspect-square border border-brand-yellow-lite flex flex-col items-center justify-between gap-4 p-4 rounded-md cursor-pointer transition ${
          shouldHighlight ? 'bg-brand-peach-lite' : 'bg-white'
        }`}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <div className="flex flex-col items-center font-primary text-brand-navy relative w-full">
          <div className="text-xl flex justify-between items-center w-full">
            <span className="text-xl truncate">{generalUserData.username}</span>
            {/* wrapped ... icon in invisible div so it's easier to click */}
            <div
              className="pt-1 pl-4 pr-2 pb-2 absolute -right-2 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                setShowMorePopup(prev => !prev);
              }}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} className={`icon-lg text-brand-navy`} />
            </div>
            {showMorePopup && (
              <MorePopup
                setPopupHovered={setPopupHovered}
                isFollowing={isFollowing}
                handleFollowClick={handleFollowClick}
                setOpenReportForm={setOpenReportForm}
              />
            )}
          </div>

          <div
            className={`relative aspect-square w-30 rounded-full bg-brand-grey my-2 border-3 ${
              isFollowing ? 'border-white' : 'border-brand-aqua'
            }`}
          >
            <Image
              src={generalUserData.userProfilePicture?.url || ''}
              alt={generalUserData.userProfilePicture?.caption || ''}
              fill={true}
              className="rounded-full object-cover w-full"
            />
            {!isOwner && !isFollowing && (
              <div
                className="aspect-square w-10 rounded-full bg-brand-aqua absolute top-0 -right-3 flex justify-center items-center shadow-sm cursor-pointer hover:w-12"
                onClick={e => {
                  e.stopPropagation(); // Prevent redirect
                  handleFollowClick(e);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="text-2xl text-white" />
              </div>
            )}
          </div>
          {/* !!! General user stats not included in schema !!! */}
          <div className="flex justify-between space-x-7">
            {iconStats.map((stat, idx) => (
              <IconStat key={idx} iconStyles={stat} idx={idx} statNum={stat.statNum} />
            ))}
          </div>
        </div>
      </div>
      {/* </Link> */}
      {/* Report User Form */}
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

function IconStat({ iconStyles, idx, statNum }) {
  const statColours = ['#56e4be', '#ffb300', '#ffdcbe', '#80c001'];
  return (
    <div className="flex flex-col items-center">
      <div
        className={`aspect-square w-9 rounded-full bg-${iconStyles.bgColour} border border-transparent flex justify-center items-center`}
      >
        <FontAwesomeIcon icon={iconStyles.icon} className="icon-xl" style={{ color: statColours[idx] }} />
      </div>
      <h4>{statNum ?? 0}</h4>
    </div>
  );
}

function MorePopup({ isFollowing = false, setPopupHovered, handleFollowClick, setOpenReportForm }) {
  return (
    <div
      className="bg-white border border-brand-yellow-lite rounded-md w-50 shadow-md absolute z-10 right-4 -top-0"
      onClick={e => e.stopPropagation()}
    >
      <ul>
        {isFollowing && (
          <li
            className="hover:bg-brand-peach-lite py-3 px-4"
            onClick={handleFollowClick}
            onMouseEnter={() => setPopupHovered(true)}
            onMouseLeave={() => setPopupHovered(false)}
          >
            <FontAwesomeIcon icon={faCircleXmark} className={`icon-md text-brand-navy mr-2`} />
            Unfollow
          </li>
        )}

        <li
          className="hover:bg-brand-peach-lite py-3 px-4"
          onMouseEnter={() => setPopupHovered(true)}
          onMouseLeave={() => setPopupHovered(false)}
          onClick={() => setOpenReportForm(true)}
        >
          <FontAwesomeIcon icon={faFlag} className={`icon-md text-brand-navy mr-2`} />
          Report User
        </li>
      </ul>
    </div>
  );
}
