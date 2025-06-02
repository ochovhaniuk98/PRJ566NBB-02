import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Description:
// Icon image + detail text tab. Appears on the restaurant profile's info banner and onboarding questionnaire pages.
export default function SingleTabWithIcon({ icon, detailText, onClick, className }) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex gap-x-2 items-center mb-2 ml-2 py-2 px-3 bg-brand-yellow-lite rounded-full cursor-pointer border border-brand-yellow-lite hover:border-brand-yellow ${className}`}
    >
      <FontAwesomeIcon icon={icon} className="icon-lg text-brand-navy" />
      <h4 className="text-md text-brand-navy">{detailText}</h4>
    </div>
  );
}
