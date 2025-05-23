import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Description:
// Icon image + number of engagements (e.g. num of favourites, thumbs-up, etc.)
// Appears on reviews mostly.
export default function EngagementIconStat({ iconArr, statNumArr }) {
  return (
    <div className="flex gap-x-2 items-center">
      {iconArr.map((_, i) => (
        <span key={i} className="flex items-center">
          <FontAwesomeIcon icon={iconArr[i]} className="icon-md text-brand-navy" />
          <h4 className={` ${statNumArr[i] && 'ml-1 mr-2'}`}>{statNumArr[i] >= 0 ? statNumArr[i] : ''}</h4>
        </span>
      ))}
    </div>
  );
}
