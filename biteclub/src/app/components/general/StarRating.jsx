import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfStroke as halfStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";

// Description:
// Row of 5 star icons that can be customized by colour, size, and rating number;
// If a rating's remainder is 0.3 - 0.7 (e.g. 4.6/5), the half-star icon is displayed.
export default function StarRating({ colour, iconSize, ratingNum }) {
  const remainder = ratingNum - Math.floor(ratingNum);
  let roundedRemainder = parseFloat(remainder.toFixed(1));
  const [lowMidValue, highMidValue] = [0.3, 0.7]; // range for half-star icon

  return (
    <div className="my-2">
      {[...Array(5)].map((_, i) => {
        const starPosition = i + 1;
        const isFull = starPosition <= Math.floor(ratingNum);

        const displayedStar = isFull
          ? solidStar
          : roundedRemainder < lowMidValue
          ? emptyStar
          : roundedRemainder > highMidValue
          ? solidStar
          : halfStar;

        if (displayedStar === halfStar || displayedStar === emptyStar)
          roundedRemainder = 0;

        return (
          <FontAwesomeIcon
            key={i}
            icon={displayedStar}
            className={`${iconSize} ${colour}`}
          />
        );
      })}
    </div>
  );
}
