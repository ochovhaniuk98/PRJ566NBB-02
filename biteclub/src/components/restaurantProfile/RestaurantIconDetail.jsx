import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Description:
// Icon image + detail text on the restaurant profile's info banner
export default function RestaurantIconDetail({ icon, detailText }) {
  return (
    <div className="flex gap-x-2 items-center mb-1">
      <FontAwesomeIcon icon={icon} className="icon-lg text-brand-green" />
      <h4 className="text-md">{detailText}</h4>
    </div>
  );
}
