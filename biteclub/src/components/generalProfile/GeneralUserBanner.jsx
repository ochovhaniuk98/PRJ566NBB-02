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
    { label: 'Followers', icon: faUsers, bgColour: 'white', iconColour: 'brand-aqua' },
    { label: 'Reviews', icon: faStarHalfStroke, bgColour: 'white', iconColour: 'brand-yellow' },
    { label: 'Blog Posts', icon: faFeather, bgColour: 'white', iconColour: 'brand-peach' },
    { label: 'Challenges', icon: faGamepad, bgColour: 'white', iconColour: 'brand-green' },
  ];

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
          {/* !!! join date missing in schema !!! */}
          <h5>Joined Since: June 16, 2025</h5>
          {/* Follow button */}
          <Button type="submit" className="w-40" variant="default">
            <FontAwesomeIcon icon={faPlus} className={`text-3xl text-navy`} />
            Follow
          </Button>
        </div>
        {/*user stats*/} {/* !!! user stats missing in schema !!! */}
        <div className="transparent">
          {iconStats.map((stat, i) => {
            return <ProfileStat key={i} statNum={123} stat={stat} />;
          })}
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
