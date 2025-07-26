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
import * as geolib from 'geolib'; // https://www.npmjs.com/package/geolib

// DESCRIPTION: Pop-Up MODAL that appears when an active challenge card is clicked
export default function ActiveChallengeDetailModal({
  onClose,
  selectedActiveChallenge,
  activeChallenges,
  setActiveChallenges,
}) {
  const [challenge, setChallenge] = useState('');
  const [activeChallengeDetail, setActiveChallengeDetail] = useState('');
  const [fetchedChallenge, setFetchedChallenge] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [fetchedRestaurants, setFetchedRestaurants] = useState(false);

  // user geolocation coordinates
  const [userLocation, setUserLocation] = useState(null);
  const [fetchedUserLocation, setFetchedUserLocation] = useState(false);

  // fetch a activeChallengeDetail by activeChallengeData.challengeId
  useEffect(() => {
    // CHALLENGE
    async function fetchChallenge() {
      try {
        const res = await fetch(
          `api/challenges/all-challenges/get-by-challengeId/${selectedActiveChallenge.challengeId}`
        );
        const data = await res.json();
        // console.log('challenge', data);
        setChallenge(data);
      } catch (err) {
        console.error('Failed to fetch challenge:', err);
      }
    }

    // ACTIVE CHALLENGE DETAIL
    async function fetchActiveChallengeDetail() {
      const userId = '6831f193ce0d8ebd1ea4877f'; // TODO: we will need to fetch real user's id once Nicole's PR is merged
      try {
        const res = await fetch(
          `api/challenges/active-challenges/detail/get-by-ids?challengeId=${selectedActiveChallenge.challengeId}&userId=${userId}`
        );
        const data = await res.json();
        // console.log('data', data);

        // accept only if activeChallengeDetail is in progress
        if (data && data.completionStatus === 'in-progress') {
          setActiveChallengeDetail(data);

          // get restaurantIds from activeChallengeDetail
          const restaurantIds = data.challengeSteps?.map(step => step.restaurantId) || [];

          // console.log('Restaurant Ids:', restaurantIds);
          fetchRestaurants(restaurantIds);
        } else {
          console.warn('Challenge is not in progress. Status:', data.completionStatus);
          setActiveChallengeDetail(null);
        }
      } catch (err) {
        console.error('Failed to fetch activeChallengeDetail:', err);
      }
      setFetchedChallenge(true);
    }

    // get restaurants list for the activeChallengeDetail
    async function fetchRestaurants(restaurantIds) {
      try {
        const promises = restaurantIds.map(id => fetch(`/api/restaurants/${id}`).then(res => res.json()));
        const data = await Promise.all(promises);
        // console.log('Fetched restaurants:', data);
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
      setFetchedRestaurants(true);
    }

    // get user's location coordinates and store them
    const requestGeolocation = async () => {
      if (!navigator.geolocation || !navigator.permissions) return;

      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });

        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition(position => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(coords);
            console.log('Location granted:', coords);
          });
        } else if (result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            position => {
              const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              setUserLocation(coords);
              console.log('User allowed location access:', coords);
            },
            error => {
              console.warn('User denied or error in location:', error.message);
            }
          );
        } else if (result.state === 'denied') {
          console.log('Location permission denied previously.');
        }
      } catch (error) {
        console.error('Error checking geolocation permissions:', error);
      }
      setFetchedUserLocation(true);
    };

    fetchActiveChallengeDetail();
    fetchChallenge();
    requestGeolocation(); // request user's location coordinates
  }, []);

  // TODO: drop a challenge

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

  // geolocation confirmation feature
  function handleCheckIn(restaurant, isVerified) {
    if (isVerified) return; // already checked in

    // get restaurants's coordinates
    const restaurantCoords = {
      longitude: restaurant.locationCoords.coordinates[0],
      latitude: restaurant.locationCoords.coordinates[1],
    };

    if (!userLocation) {
      alert('You need to provide a location access in order to check in.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const userCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // compare the coordinates
        const distance = geolib.getDistance(userCoords, {
          latitude: restaurantCoords.latitude,
          longitude: restaurantCoords.longitude,
          // latitude: 43.644291, // used for testing
          // longitude: -79.371753,
        });

        console.log('You are', distance, 'meters away from the restaurant');

        if (distance <= 50) {
          console.log('Close enough to check in');
          // update verification status
          CheckUserIn(restaurant);
        } else {
          alert('You are too far from the restaurant to check in.');
        }
      },
      () => {
        alert('Position could not be determined.');
      }
    );
  }

  // Check user in (geolocation was confirmed)
  async function CheckUserIn(restaurant) {
    // update verification status
    const stepIndex = activeChallengeDetail.challengeSteps.findIndex(step => step.restaurantId === restaurant._id);
    if (stepIndex === -1) {
      console.warn('Step not found for restaurant:', restaurant._id);
      return;
    }
    activeChallengeDetail.challengeSteps[stepIndex].verificationStatus = true;

    // update in the db
    try {
      const res = await fetch('/api/challenges/active-challenges/detail/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activeChallengeDetailId: activeChallengeDetail._id,
          challengeSteps: activeChallengeDetail.challengeSteps,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to update challenge detail:', errorData);
        return;
      }

      const data = await res.json();
      console.log('Update success:', data.message);
      alert('You have been successfully checked in.');
    } catch (err) {
      console.error('Error while updating challenge detail:', err);
    }
  }

  // container displays up to 5 steps/plates/restaurants per challenge
  function ChallengeStepsContainer({ challengeSteps }) {
    const MAX_NUM_STEPS = 5; // max 5 per challenge

    return (
      <div className="w-3/5 flex flex-wrap gap-4 gap-x-10 items-center justify-center font-primary pt-4">
        {challengeSteps.slice(0, MAX_NUM_STEPS).map((step, i) => {
          /* get restaurant data for each challenge step (FAKE restaurant data) */
          const restaurant = restaurants.find(r => r._id === step.restaurantId);
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
          <div
            className="bg-brand-blue-lite p-1 px-3 mt-2 rounded-full uppercase text-brand-navy text-sm font-semibold shadow-md group-hover:bg-brand-aqua-lite group-hover:shadow-none"
            onClick={() => handleCheckIn(restaurant, isVerified)}
          >
            Check-in
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {fetchedChallenge && fetchedRestaurants && (
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
      )}
    </>
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
