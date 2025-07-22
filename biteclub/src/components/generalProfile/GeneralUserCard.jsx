import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/auth/client';
import { useUser } from '@/context/UserContext';
import { getGeneralUserMongoIDbySupabaseId } from '@/lib/db/dbOperations';
import { Button } from '../shared/Button';
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
export default function GeneralUserCard({ generalUserData }) {
  const router = useRouter();
  const { user } = useUser();
  const generalUserUrl = `/generals/${generalUserData._id}`;

  const [showMorePopup, setShowMorePopup] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [popupHovered, setPopupHovered] = useState(false);
  const shouldHighlight = cardHovered && !popupHovered;
  const iconStats = [
    { icon: faUsers, bgColour: 'white', iconColour: 'brand-aqua' },
    { icon: faStarHalfStroke, bgColour: 'white', iconColour: 'brand-yellow' },
    { icon: faFeather, bgColour: 'white', iconColour: 'brand-peach' },
    { icon: faGamepad, bgColour: 'white', iconColour: 'brand-green' },
  ];
  const [openReportForm, setOpenReportForm] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [anotherUserId, setAnotherUserId] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // if (!generalUserData._id) return;

      // const { data, error } = await supabase.auth.getUser();
      // if (error || !data.user) return;
      // const user = data.user;

      if (!generalUserData._id || !user?.id) return;
      try {
        const userMongoId = await getGeneralUserMongoIDbySupabaseId({ supabaseId: user.id });
        console.log(`(generals public profile) current user MONGOID: `, userMongoId);

        console.log(`(generals public profile) mongoId in params: `, generalUserData._id);
        if (userMongoId && userMongoId === generalUserData._id) {
          setIsOwner(true);
        } else {
          setAnotherUserId(generalUserData._id);
        }
      } catch (error) {
        console.error('(GeneralUserCard) Error checking user ownership:', error);
      }
    };

    fetchData();
  }, [generalUserData._id]);

  useEffect(() => {
    if (isOwner) return;

    // If we miss Ids, we cannot perform check.
    if (!anotherUserId) {
      console.log('(isFollowing) anotherUserId: ', anotherUserId);
      console.warn('anotherUserId is missing -- skipping check');
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

  const handleFollowClick = async e => {
    e.stopPropagation();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user?.id || !anotherUserId) return;
    const authUserId = data.user.id;

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
    <div className="w-full" onClick={() => router.push(generalUserUrl)}>
      <div
        className={`w-full aspect-square border border-brand-yellow-lite flex flex-col items-center justify-between gap-4 p-4 rounded-md cursor-pointer transition ${
          shouldHighlight ? 'bg-brand-peach-lite' : 'bg-white'
        }`}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <div className="flex flex-col items-center font-primary text-brand-navy relative w-full">
          <div className="text-xl flex justify-between items-center w-full">
            {generalUserData.username}
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className={`icon-lg text-brand-navy`}
              onClick={e => {
                e.stopPropagation();
                setShowMorePopup(prev => !prev);
              }}
            />
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
            className={`relative aspect-square w-30 rounded-full bg-brand-grey mt-4 border-3 ${
              isFollowing ? 'border-white' : 'border-brand-green'
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
                className="aspect-square w-10 rounded-full bg-brand-green absolute top-0 -right-3 flex justify-center items-center shadow-sm cursor-pointer hover:w-12"
                onClick={e => {
                  e.stopPropagation(); // Prevent redirect
                  handleFollowClick(e);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="text-2xl text-white" />
              </div>
            )}
          </div>
        </div>
        {/* !!! General user stats not included in schema !!! */}
        <div className="flex justify-between space-x-7">
          {iconStats.map((elem, i) => (
            <IconStat key={i} iconStyles={elem} />
          ))}
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

function IconStat({ iconStyles }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`aspect-square w-9 rounded-full bg-${iconStyles.bgColour} border border-transparent flex justify-center items-center `}
      >
        <FontAwesomeIcon icon={iconStyles.icon} className={`icon-xl text-${iconStyles.iconColour}`} />
      </div>
      <h4>1234</h4>
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
