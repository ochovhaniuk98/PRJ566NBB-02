import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Description:
// Icon image + detail text on the restaurant profile's info banner
export default function RestaurantIconDetail({ icon, detailText }) {
  return (
    <div className="flex gap-x-2 items-center">
      <FontAwesomeIcon icon={icon} className="icon-md text-brand-green" />
      <p className="text-sm">{detailText}</p>
    </div>
  );
}
