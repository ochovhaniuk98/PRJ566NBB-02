import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
export default function GeneralUserCard({ generalUserData, isFollowing = false }) {
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

  const generalUserUrl = `/generals/${generalUserData._id}`;

  return (
    <Link href={generalUserUrl} className="w-full">
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
              onClick={() => setShowMorePopup(prev => !prev)}
            />
            {showMorePopup && <MorePopup setPopupHovered={setPopupHovered} isFollowing={isFollowing} />}
          </div>
          <div
            className={`relative aspect-square w-30 rounded-full bg-brand-grey mt-4 border-3 ${
              isFollowing ? 'border-white' : 'border-brand-green'
            }`}
          >
            <Image
              src={generalUserData.userProfilePicture.url}
              alt={generalUserData.userProfilePicture.caption}
              fill={true}
              className="rounded-full object-cover w-full"
            />
            {isFollowing ? (
              ''
            ) : (
              <div className="aspect-square w-10 rounded-full bg-brand-green absolute top-0 -right-3 flex justify-center items-center shadow-sm cursor-pointer hover:w-12">
                <FontAwesomeIcon icon={faPlus} className={`text-2xl text-white`} />
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
    </Link>
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

function MorePopup({ isFollowing = false, setPopupHovered }) {
  return (
    <div className="bg-white border border-brand-yellow-lite rounded-md w-50 shadow-md absolute z-10 right-4 -top-0">
      <ul>
        {isFollowing && (
          <li
            className="hover:bg-brand-peach-lite py-3 px-4"
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
        >
          <FontAwesomeIcon icon={faFlag} className={`icon-md text-brand-navy mr-2`} />
          Report User
        </li>
      </ul>
    </div>
  );
}
