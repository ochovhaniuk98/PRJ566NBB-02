import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Description:
// Icon image + number of engagements (e.g. num of favourites, thumbs-up, etc.)
// Appears on reviews mostly.
export default function EngagementIconStat({ iconArr, statNumArr, handlers = [], states = [] }) {
  return (
    <div className="flex gap-x-2 items-center">
      {iconArr.map((_, i) => (
        <span key={i} className="flex items-center">
          <FontAwesomeIcon
            icon={states[i] || false ? iconArr[i]?.filled || iconArr[i]?.outlined : iconArr[i]?.outlined}
            className="icon-md text-brand-navy"
            onClick={handlers[i] ? handlers[i] : () => {}}
          />
          <h4 className={` ${statNumArr[i] && 'ml-1 mr-2'}`}>{statNumArr[i] >= 0 ? statNumArr[i] : ''}</h4>
        </span>
      ))}
    </div>
  );
}
