import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUsers, faStarHalfStroke, faFeather, faGamepad } from '@fortawesome/free-solid-svg-icons';

// isFollowing: tracks whether or not the owner is following the user displayed on this card
export default function GeneralUserCard({ generalUserData, isFollowing = false }) {
  const iconStats = [
    { icon: faUsers, bgColour: 'white', iconColour: 'brand-aqua' },
    { icon: faStarHalfStroke, bgColour: 'white', iconColour: 'brand-yellow' },
    { icon: faFeather, bgColour: 'white', iconColour: 'brand-peach' },
    { icon: faGamepad, bgColour: 'white', iconColour: 'brand-green' },
  ];

  return (
    <div className="w-full aspect-square border border-brand-yellow-lite flex flex-col items-center justify-between gap-4 p-4 rounded-md cursor-pointer hover:bg-brand-peach-lite">
      <div className="flex flex-col items-center font-secondary text-brand-navy text-2xl relative">
        {generalUserData.username}
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
        </div>
        {isFollowing ? (
          ''
        ) : (
          <div className="aspect-square w-10 rounded-full bg-brand-green absolute top-12 right-0 flex justify-center items-center shadow-sm cursor-pointer hover:w-12">
            <FontAwesomeIcon icon={faPlus} className={`text-2xl text-white`} />
          </div>
        )}
      </div>
      {/* !!! General user stats not included in schema !!! */}
      <div className="flex justify-between space-x-7">
        {iconStats.map((elem, i) => (
          <IconStat key={i} iconStyles={elem} />
        ))}
      </div>
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
