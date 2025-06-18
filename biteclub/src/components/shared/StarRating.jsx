import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfStroke as halfStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

// Description:
// Row of 5 star icons that can be customized by colour, size, and rating number;
// If a rating's remainder is 0.3 - 0.7 (e.g. 4.6/5), the half-star icon is displayed.
export default function StarRating({
  colour = 'text-brand-green',
  iconSize = 'icon-lg',
  ratingNum = 0,
  interactive = false,
  onChange = () => {},
  className,
}) {
  const reviewRatingMessages = [
    'I regret everything.',
    'Ehh, at least I tried it.',
    'It was fine, nothing special.',
    'Good, met all my expectations!',
    'Chef’s kiss 👨‍🍳💋',
  ];

  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(ratingNum);

  const activeRating = interactive ? hoverRating || selectedRating : ratingNum;
  const remainder = ratingNum - Math.floor(ratingNum);
  let roundedRemainder = parseFloat(remainder.toFixed(1));
  const [lowMidValue, highMidValue] = [0.3, 0.7]; // range for half-star icon

  const handleClick = index => {
    if (!interactive) return;
    setSelectedRating(index);
    const message = reviewRatingMessages[index - 1];
    onChange(index, message); // pass data to parent
  };

  return (
    <div className="mb-2">
      {[...Array(5)].map((_, i) => {
        const starPosition = i + 1;
        const isFull = starPosition <= Math.floor(activeRating);

        const displayedStar = isFull
          ? solidStar
          : roundedRemainder < lowMidValue
          ? emptyStar
          : roundedRemainder > highMidValue
          ? solidStar
          : halfStar;

        if (displayedStar === halfStar || displayedStar === emptyStar) roundedRemainder = 0;

        return (
          <FontAwesomeIcon
            key={i}
            icon={displayedStar}
            className={`${iconSize} ${colour} ${className} cursor-${interactive ? 'pointer' : 'default'}`}
            onMouseEnter={() => interactive && setHoverRating(starPosition)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => handleClick(starPosition)}
          />
        );
      })}
    </div>
  );
}
