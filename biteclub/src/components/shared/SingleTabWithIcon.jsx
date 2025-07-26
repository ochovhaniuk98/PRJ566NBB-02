import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Description:
// Icon image + detail text tab. Appears on the restaurant profile's info banner and onboarding questionnaire pages.
export default function SingleTabWithIcon({
  icon,
  detailText,
  onClick,
  className,
  bgColour = 'bg-brand-yellow-lite',
  textColour = 'text-brand-navy',
  borderColour = 'border-brand-yellow-lite',
}) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex gap-x-2 items-center mb-2 ml-2 py-2 px-3 rounded-full cursor-pointer border ${borderColour} hover:border-brand-green ${className} ${bgColour}`}
    >
      <FontAwesomeIcon icon={icon} className={`icon-lg ${textColour}`} />
      <h4 className={`text-md ${textColour}`}>{detailText}</h4>
    </div>
  );
}
