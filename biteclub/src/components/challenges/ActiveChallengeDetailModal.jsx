import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faClock,
  faGamepad,
  faDrumstickBite,
  faTrashAlt,
  faXmark,
  faPizzaSlice,
  faShrimp,
  faAppleWhole,
  faFishFins,
  faHamburger,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { getDaysRemaining } from './Util';
import { fakeRestaurants, fakeChallenges } from '@/app/data/fakeData';
import { useState, useEffect } from 'react';

// DESCRIPTION: Pop-Up MODAL that appears when an active challenge card is clicked
export default function ActiveChallengeDetailModal({
  onClose,
  selectedActiveChallenge,
  activeChallenges,
  setActiveChallenges,
}) {
  const [challenge, setChallenge] = useState('');
  const [fetchedChallenge, setFetchedChallenge] = useState(false);
  // fetch a challenge by activeChallengeData.challengeId
  useEffect(() => {
    async function fetchChallenge() {
      try {
        const res = await fetch(`api/challenges/all-challenges/get-by-challengeId/${activeChallengeData.challengeId}`);
        const data = await res.json();
        console.log('data', data);
        setChallenge(data);
      } catch (err) {
        console.error('Failed to fetch challenge:', err);
      }

      setFetchedChallenge(true);
    }
    fetchChallenge();
  }, []);
  // get num of completed challenge steps
  const numCompletedSteps = selectedActiveChallenge.challengeSteps.filter(step => step.verificationStatus).length;
  // format string for challenge progress
  const progressVal = numCompletedSteps + '/' + selectedActiveChallenge.challengeSteps.length;

  // challenge stats data: progress, time left, reward
  const stats = [
    {
      s_icon: faGamepad,
      s_label: 'Progress',
      s_value: progressVal,
      s_unit: 'completed',
    },
    {
      s_icon: faClock,
      s_label: 'Time Left',
      s_value: getDaysRemaining(selectedActiveChallenge.endDate),
      s_unit: 'days',
    },
    {
      s_icon: faTrophy,
      s_label: 'Reward',
      s_value: challenge.numberOfPoints,
      s_unit: 'points',
    },
  ];

  // Drop challenge / Remove from activeChallenges list
  function handleDropChallenge() {
    const updated = activeChallenges.filter(challenge => challenge._id !== selectedActiveChallenge._id);
    setActiveChallenges(updated);
    onClose(false);
  }

  return (
    <div className="fixed inset-0  bg-brand-peach/40 flex justify-center items-center  z-[100]  overflow-scroll scrollbar-hide">
      <div className="bg-transparent p-8">
        <div className="w-5xl min-h-120 bg-white shadow-lg rounded-lg pb-3 relative">
          <div className="bg-brand-green-lite flex items-center font-primary font-semibold text-md capitalize py-3 px-3 rounded-t-lg w-full justify-between">
            <div>
              <FontAwesomeIcon icon={faGamepad} className={`text-2xl text-white mr-2`} />
              Update Challenge
            </div>
            <FontAwesomeIcon
              icon={faXmark}
              className={` icon-xl text-brand-navy cursor-pointer`}
              onClick={() => onClose(false)}
            />
          </div>
          <div className="p-6 flex gap-x-8 w-full">
            <div className="w-2/5 flex flex-col gap-y-4">
              {/* TITLE */}
              <h1>{challenge.title}</h1>
              {/* DESC */}
              <p>{challenge.description}</p>
              <div className="bg-brand-yellow-lite rounded-lg p-2 px-3 space-y-1">
                {/*PROGRESS, TIME LEFT, REWARD */}
                {stats.map((stat, i) => (
                  <ChallengeStat
                    key={i}
                    idx={i}
                    s_icon={stat.s_icon}
                    s_label={stat.s_label}
                    s_value={stat.s_value}
                    s_unit={stat.s_unit}
                  />
                ))}
              </div>
            </div>
            {/* CHALLENGE STEPS CONTAINER (for check-in / geolocation) */}
            <ChallengeStepsContainer challengeSteps={selectedActiveChallenge.challengeSteps} />
          </div>
          {/* DROP CHALLENGE btn */}
          <button
            onClick={handleDropChallenge}
            className="absolute left-3 bottom-3 cursor-pointer font-primary font-medium rounded-lg text-sm text-brand-red border border-brand-red py-1 px-3"
          >
            <FontAwesomeIcon icon={faTrashAlt} className={` icon-md text-brand-red mr-1`} />
            Drop Challenge
          </button>
        </div>
      </div>
    </div>
  );
}

// container displays up to 5 steps/plates/restaurants per challenge
function ChallengeStepsContainer({ challengeSteps }) {
  const MAX_NUM_STEPS = 5; // max 5 per challenge

  return (
    <div className="w-3/5 flex flex-wrap gap-4 gap-x-10 items-center justify-center font-primary pt-4">
      {challengeSteps.slice(0, MAX_NUM_STEPS).map((step, i) => {
        /* get restaurant data for each challenge step (FAKE restaurant data) */
        const restaurant = fakeRestaurants.find(r => r._id === step.restaurantId);
        return <ChallengeStep key={i} idx={i} restaurant={restaurant} isVerified={step.verificationStatus} />;
      })}
    </div>
  );
}

// Challenge step: displays restaurant, icon on "plate", and Check-in btn
function ChallengeStep({ idx, restaurant, isVerified }) {
  // up to 5 unique icons and colours for each step
  const stepIcons = [faAppleWhole, faDrumstickBite, faPizzaSlice, faShrimp, faFishFins];
  const iconColours = ['#FFDCBE', '#FFF5D8', '#DFF2FB', '#C7E58B', '#BBF4E5'];

  // fallback icon/colour
  const icon = stepIcons[idx] || faHamburger;
  const colour = iconColours[idx] || '#C7E58B';

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`min-h-44 w-36 flex flex-col items-center ${!isVerified && 'group cursor-pointer'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* white plate */}
      <div
        className={`rounded-full w-full aspect-square bg-white border border-brand-grey-lite flex flex-col items-center justify-center p-2 text-center relative ${
          !isVerified && 'shadow-md'
        }`}
      >
        <div className="absolute h-24 w-24 rounded-full bg-brand-grey-lite/10 shadow-inner flex flex-col items-center justify-center">
          {/* empty plate if verified*/}
          {!isVerified && !isHovered && (
            <FontAwesomeIcon icon={icon} className={`text-7xl`} style={{ color: `${colour}` }} />
          )}
        </div>
        {/* show address on hover and if NOT verified */}
        {isHovered && !isVerified ? (
          <h5 className="flex flex-col items-center">
            <FontAwesomeIcon icon={faLocationDot} className={`text-lg text-brand-green mb-1`} />
            {restaurant.location}
          </h5>
        ) : (
          <h3 className={`z-10 font-semibold ${isVerified && 'text-brand-grey/80'}`}>{restaurant.name}</h3>
        )}
      </div>
      {/* if verified, show "visited"; Else show checkin btn*/}
      {isVerified ? (
        <h6 className="mt-2 text-brand-grey">Visited</h6>
      ) : (
        /* CHECK-IN btn */
        <div className="bg-brand-blue-lite p-1 px-3 mt-2 rounded-full uppercase text-brand-navy text-sm font-semibold shadow-md group-hover:bg-brand-aqua-lite group-hover:shadow-none">
          Check-in
        </div>
      )}
    </div>
  );
}

function ChallengeStat({ idx, s_label, s_value, s_unit, s_icon }) {
  const iconColours = ['#80c001', '#56e4be', '#ffb300'];
  return (
    <ul>
      <li className="flex justify-between">
        <div className="flex items-center">
          <div className="bg-white rounded-full w-6 h-6 text-center flex flex-col items-center justify-center mr-1">
            <FontAwesomeIcon icon={s_icon} className={`icon-md`} style={{ color: iconColours[idx] }} />
          </div>
          <h3 className="uppercase">{s_label}</h3>
        </div>
        <h3 className="font-bold">
          {s_value} <span className="font-medium">{s_unit}</span>
        </h3>
      </li>
    </ul>
  );
}
