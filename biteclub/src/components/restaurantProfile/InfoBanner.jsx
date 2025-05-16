import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import RestaurantIconDetail from "@/components/restaurantProfile/RestaurantIconDetail";
import StarRating from "../general/StarRating";

export default function InfoBanner({ name, avgRating, numReviews, cuisine }) {
  return (
    // bg-brand-yellow-extralite
    <div className="bg-white main-side-margins py-8">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="flex items-center gap-x-2">
          <p className="text-2xl font-semibold">{avgRating}</p>
          <StarRating
            colour={"text-brand-green"}
            iconSize={"icon-xl"}
            ratingNum={1.3}
          />
          <p className="text-xl font-light">{numReviews}</p>
        </div>
        <RestaurantIconDetail icon={faLocationDot} detailText={cuisine} />
        <RestaurantIconDetail icon={faLocationDot} detailText={cuisine} />
      </div>
    </div>
  );
}
