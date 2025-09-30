import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Description:
// Icon image + number of engagements (e.g. num of favourites, thumbs-up, etc.)
// Appears on reviews mostly.
export default function EngagementIconStat({
  iconArr,
  statNumArr,
  handlers = [],
  states = [],
  forBlogPostCard = false,
}) {
  return (
    <div className="flex items-center">
      {iconArr.map((_, i) => (
        <span
          key={i}
          className={`flex items-center ${i != statNumArr.length - 1 && 'hover:text-brand-navy cursor-pointer'} ${
            i === 0 && 'mr-2'
          }`}
          onClick={e => {
            e.stopPropagation();
            handlers[i]?.();
          }}
        >
          <FontAwesomeIcon
            icon={states[i] || false ? iconArr[i]?.filled || iconArr[i]?.outlined : iconArr[i]?.outlined}
            className={`icon-md ${
              forBlogPostCard
                ? 'text-brand-grey cursor-auto'
                : iconArr[i].filled === faCommentDots
                ? 'text-brand-grey cursor-auto'
                : 'text-brand-navy'
            }`}
          />
          <h4
            className={`min-w-[8px] ${
              statNumArr[i] >= 0 && 'ml-1 mr-1 font-primary font-medium text-brand-grey text-xs'
            } ${i != statNumArr.length - 1 && !forBlogPostCard && 'hover:text-brand-navy'}`}
          >
            {statNumArr[i] && statNumArr[i] >= 0 && statNumArr[i]}
          </h4>
        </span>
      ))}
    </div>
  );
}

//  { /*onClick={handlers[i] ? handlers[i] : () => {}}*/}
