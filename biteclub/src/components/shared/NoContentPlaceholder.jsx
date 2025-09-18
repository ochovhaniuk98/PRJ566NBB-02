import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip, faHeart, faUsers, faImage, faFaceFrown } from '@fortawesome/free-solid-svg-icons';

export default function NoContentPlaceholder({ contentType = 'content', iconImgNum = 1, forSearchResults = false }) {
  let icon;

  switch (iconImgNum) {
    case 1:
      icon = faPenClip;
      break;
    case 2:
      icon = faHeart;
      break;
    case 3:
      icon = faUsers;
      break;
    case 4:
      icon = faImage;
      break;
    case 5:
      icon = faFaceFrown;
      break;
    default:
      icon = faPenClip;
  }
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-sm border-2 border-white py-16 px-8 m-auto rounded-2xl text-brand-grey bg-brand-blue-lite/30 text-center min-h-60">
      <FontAwesomeIcon icon={icon} className={`text-4xl text-brand-blue`} />
      <h2 className="normal-case">
        {forSearchResults ? (
          <>
            No results found for <span className="italic text-2xl">{contentType}</span>
          </>
        ) : (
          <>No {contentType.toLowerCase().trim()} yet</>
        )}
      </h2>
    </div>
  );
}
