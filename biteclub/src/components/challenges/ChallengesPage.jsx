'use client';
import { useState, useEffect } from 'react';
import MainBaseContainer from '../shared/MainBaseContainer';
import ActiveChallengeDetailModal from './ActiveChallengeDetailModal';
import Leaderboard from './Leaderboard';
import AllActiveChallenges from './AllActiveChallenges';
import { fakeChallenges } from '@/app/data/fakeData';
import { useUserData } from '@/context/UserDataContext';
import { faArrowRight, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import ChallengeCompletedModal from './ChallengeCompletedModal';

const MAX_POINTS = 2750;
const MAX_ACTIVE = 3;
const BAR_INCOMPLETE_COLOR = '#F8DDC1';
const BAR_COMPLETE_COLOR = '#8CBF38';

export default function ChallengesPage() {
  const { userData, loadingData, refreshUserData } = useUserData();

  const [showChallengeDetailModal, setShowChallengeDetailModal] = useState(false); // opens/closes modal showing selected challenge details
  const [points, setPoints] = useState(0); // points added after challenge completion
  const [selectedChallenge, setSelectedChallenge] = useState(null); // ensures modal opens with correct challenge details
  const [percentComplete, setPercentComplete] = useState(0);
  const [level, setLevel] = useState(0);
  const [activeChallenges, setActiveChallenges] = useState([]); // list of user's active challenges
  const [numCompletedChallenges, setNumCompletedChallenges] = useState(0);
  const [numTotalPoints, setNumTotalPoints] = useState(0);
  const [fetchedActivatedChallenges, setFetchedActivatedChallenges] = useState(false);

  const [leaderboardRefreshTrigger, refreshLeaderboard] = useState(false); // used to refresh leaderboard data

  // Creates "active" challenge data and adds it to user's active challenges array (created for DEMO purposes)
  function handleActivateChallenge(challenge) {
    if (activeChallenges.length >= MAX_ACTIVE) return alert('You can only have 3 active challenges.');
    // create active challenge data and add to array
    console.log('User data:', userData);
    fetch('api/challenges/activateChallenge', {
      method: 'POST',
      body: JSON.stringify({ userId: userData._id, challenge }),
    }).then(() => {
      (async () => {
        const res = await fetch(`api/challenges/active-challenges/get-by-userId/${userData._id}`);
        const data = await res.json();

        const inProgressChallenges = data.filter(challenge => challenge.completionStatus === 'in-progress');

        setActiveChallenges(inProgressChallenges);
      })();
    });

    // setActiveChallenges(prev => [...prev, newActivated]);
  }

  useEffect(() => {
    if (!userData || loadingData) return;
    // get user's activated challenges
    async function fetchActivatedChallenges() {
      if (!userData) return;
      try {
        const cappedPoints = Math.min(userData.numOfPoints, MAX_POINTS);
        const calculatedPercent = ((cappedPoints - 1000) / (MAX_POINTS - 1000)) * 100;
        setPercentComplete(Math.max(0, Math.round(calculatedPercent)));

        if (userData.numOfPoints >= 2750) {
          setLevel(5);
        } else if (userData.numOfPoints >= 2500) {
          setLevel(4);
        } else if (userData.numOfPoints >= 2000) {
          setLevel(3);
        } else if (userData.numOfPoints >= 1500) {
          setLevel(2);
        } else if (userData.numOfPoints >= 1000) {
          setLevel(1);
        } else {
          setLevel(0);
        }

        const res = await fetch(`api/challenges/active-challenges/get-by-userId/${userData._id}`);
        const data = await res.json();

        const inProgressChallenges = data.filter(challenge => challenge.completionStatus === 'in-progress');
        const completedChallenges = data.filter(challenge => challenge.completionStatus === 'completed');

        setActiveChallenges(inProgressChallenges);
        setNumCompletedChallenges(completedChallenges.length);
        setNumTotalPoints(userData.numOfPoints);

        setFetchedActivatedChallenges(true);
      } catch (err) {
        console.error('Failed to load activated challenges:', err);
      }
    }
    fetchActivatedChallenges();
  }, [userData, loadingData]);

  useEffect(() => {
    refreshUserData();
  }, [points, refreshUserData]);

  // remove active challenge from the board if user completes the challenge
  useEffect(() => {
    const filtered = activeChallenges.filter(challenge => challenge.completionStatus !== 'completed');
    if (filtered.length !== activeChallenges.length) {
      setActiveChallenges(filtered);
    }
  }, [activeChallenges]);

  useEffect(() => {
    // Refresh leaderboard, whenever points are updated
    refreshLeaderboard(prev => !prev);
  }, [points]);

  // Challenge Completed Modal State
  const [showChallengeCompletedModal, setShowChallengeCompletedModal] = useState(false);

  return (
    <>
      {userData && (
        <MainBaseContainer>
          <div className="main-side-padding w-full flex flex-col items-center mt-16 mb-16">
            <div className="flex flex-row w-full items-center justify-center">
              {/* Profile Pic */}
              <div className="size-24 bg-brand-green rounded-full mr-2 relative border border-brand-grey-lite">
                <Image
                  src={userData?.userProfilePicture?.url || '/img/placeholderImg.jpg'}
                  alt={'profile pic'}
                  className={`object-cover rounded-full`}
                  fill={true}
                />
              </div>
              <div className="flex flex-col">
                {/* Num of Points */}
                <div className="inline-flex items-baseline justify-center font-primary">
                  <span className="text-9xl font-secondary font-normal text-brand-green">
                    {numTotalPoints || '000'}
                  </span>
                  <span className="text-lg font-medium">pts</span>
                </div>
                {/* Num of Challenges Completed */}
                <p>
                  <span className="font-semibold">{numCompletedChallenges || 0}</span> Challenges Completed
                </p>
              </div>
            </div>
            {/* Redeem Points Link */}
            {/* Challenge Completed Modal */}
            {showChallengeCompletedModal && (
              <ChallengeCompletedModal
                numPointsWon={points}
                setShowChallengeCompletedModal={setShowChallengeCompletedModal}
              />
            )}
            <div className="flex items-center gap-2 ml-auto mr-0 md:mt-0 mt-4 md:mb-0 mb-4 font-primary text-lg font-semibold text-brand-navy cursor-pointer border-b-2 border-brand-navy transform transition-transform duration-200 hover:scale-110">
              <a href="/challenges/redeem" className="text-lg">
                Redeem Points
              </a>
              <FontAwesomeIcon icon={faArrowRight} className="text-2xl text-brand-navy"></FontAwesomeIcon>
            </div>
            {/* main progress bar */}
            <div className="md:w-[70%] w-[99%] flex flex-row items-center relative mb-2">
              <div className="absolute bg-brand-peach w-[100%] md:h-[16px] h-[12px] rounded-full"></div>
              <div
                className={`absolute w-[6983%] h-[16px] z-[1] rounded-full`}
                style={{ width: `${percentComplete}%`, backgroundColor: BAR_COMPLETE_COLOR }}
              ></div>
              <div className="flex flex-row justify-between w-full md:h-40 h-30">
                <Milestone level={level} levelRequired={1} className="z-[2]" pointsNeeded={1000} reward={5} />
                <Milestone level={level} levelRequired={2} className="z-[2]" pointsNeeded={1500} reward={10} />
                <Milestone level={level} levelRequired={3} className="z-[2]" pointsNeeded={2000} reward={15} />
                <Milestone level={level} levelRequired={4} className="z-[2]" pointsNeeded={2500} reward={20} />
                <Milestone level={level} levelRequired={5} className="z-[2]" pointsNeeded={2750} reward={25} />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row w-full lg:h-124 my-4 gap-x-4 md:gap-y-0 gap-y-8">
              {/* Active Challenges */}
              {fetchedActivatedChallenges && (
                <AllActiveChallenges
                  setShowChallengeDetailModal={setShowChallengeDetailModal}
                  setSelectedChallenge={setSelectedChallenge}
                  activeChallenges={activeChallenges}
                />
              )}

              {/* Leaderboard */}
              <Leaderboard refreshTrigger={leaderboardRefreshTrigger} />
            </div>
            {/* AI-generated challenges -- HIDDEN for demo due to AI fees*/}
            <div className="w-full p-3 text-left hidden">
              <h2 className="uppercase">Add challenges</h2>
              {/* DEMO for adding/activating challenges */}
              <ChallengeList onActivate={handleActivateChallenge} />
            </div>

            {/* When active challenge card is clicked, show MODAL */}
            {showChallengeDetailModal && (
              <ActiveChallengeDetailModal
                onClose={setShowChallengeDetailModal}
                selectedActiveChallenge={selectedChallenge}
                setActiveChallenges={setActiveChallenges}
                activeChallenges={activeChallenges}
                setPoints={setPoints}
                setShowChallengeCompletedModal={setShowChallengeCompletedModal}
              />
            )}
          </div>
        </MainBaseContainer>
      )}
    </>
  );
}

/*
  level: Current level of points that the player has reached
  levelRequired: Required level of points for this milestone
  pointsNeeded: Number of points needed to redeem this reward
  reward: Value of the reward in dollars
*/
export const Milestone = ({
  level,
  levelRequired,
  pointsNeeded,
  reward,
  className,
  largeSize = false,
  onRedeem = () => {},
}) => {
  const levelImagesArr = [
    {
      img: '/img/lemon.png',
      caption: 'lemon',
      scaleSize: 'md:scale-120 scale-85',
      disabledImg: '/img/lemon-disabled.png',
    },
    {
      img: '/img/hotdog.png',
      caption: 'hotdog',
      scaleSize: 'md:scale-120 scale-85',
      disabledImg: '/img/hotdog-disabled.png',
    },
    {
      img: '/img/pita.png',
      caption: 'pita',
      scaleSize: 'md:scale-100 scale-75',
      disabledImg: '/img/pita-disabled.png',
    },
    {
      img: '/img/noodle.png',
      caption: 'noodle',
      scaleSize: 'md:scale-120 scale-85',
      disabledImg: '/img/noodle-disabled.png',
    },
    {
      img: '/img/cake.png',
      caption: 'cake',
      scaleSize: 'md:scale-110 scale-85',
      disabledImg: '/img/cake-disabled.png',
    },
  ];

  const levelImage =
    levelImagesArr.length > 0 ? levelImagesArr[levelRequired - 1]?.img || levelImagesArr[0]?.img : undefined;

  const disabledLevelImage =
    levelImagesArr.length > 0
      ? levelImagesArr[levelRequired - 1]?.disabledImg || levelImagesArr[0]?.disabledImg
      : undefined;

  const scaleSize =
    levelImagesArr.length > 0
      ? levelImagesArr[levelRequired - 1]?.scaleSize || levelImagesArr[0]?.scaleSize
      : undefined;

  if (levelRequired == 0) {
    return <div />;
  }

  const enabled = level >= levelRequired;
  //const color = enabled ? BAR_COMPLETE_COLOR : BAR_INCOMPLETE_COLOR;

  return (
    <>
      <div className="flex flex-col justify-center items-center w-fit relative md:h-[100px] h-[60px]  font-primary my-8">
        <span
          className={`absolute font-semibold ${largeSize ? 'md:text-2xl md:mb-30 mb-20' : 'mb-20'} ${
            !enabled && 'text-brand-grey'
          }`}
        >
          ${reward}
        </span>
        <div
          className={`${largeSize ? 'md:h-[60px] md:w-[60px] h-[40px] w-[40px]' : 'h-[40px] w-[40px]'} ${className}`}
          style={{ backgroundColor: 'transparent' }}
        />
        {enabled ? (
          <Image src={levelImage} alt={'level image'} className={`object-contain z-20 ${scaleSize}`} fill={true} />
        ) : (
          <Image
            src={disabledLevelImage}
            alt={'disabled level image'}
            className={`object-contain z-20 ${scaleSize}`}
            fill={true}
          />
        )}

        <span
          className={`absolute text-center ${
            largeSize ? 'md:w-[80px] md:text-lg md:mt-26 w-[60px] text-xs mt-20' : 'w-[60px] text-xs mt-20'
          }`}
        >
          {pointsNeeded}
          pts
        </span>
        {largeSize && enabled && (
          <button
            className="md:hidden absolute mt-48 bg-brand-blue text-brand-navy font-medium py-2 px-6 rounded-full shadow cursor-pointer"
            onClick={onRedeem}
          >
            Redeem
          </button>
        )}
      </div>
    </>
  );
};

const Challenge = ({ challenge }) => {
  const { title, description, reward, totalSteps, currentStep, totalDays, dateAccepted, infiniteTime } = challenge;
  const timeLeft =
    totalDays - Math.floor(infiniteTime ? 'Unlimited' : (new Date() - dateAccepted) / (60 * 60 * 24 * 1000));

  return (
    <div>
      {title} {description} {reward}
      <div>
        <span>Time left: {timeLeft}</span>
      </div>
    </div>
  );
};

// Below are functions to DEMO UI for adding challenges ~ feel FREE TO DELETE /////////////////////////////////////////////////////////////////////////////////////////////
// for UI DEMO (remove at any time)
function createActivatedChallengeDetail(challenge, userId) {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + challenge.duration);

  return {
    _id: `activation-${challenge._id}`,
    userId,
    challengeId: challenge._id,
    challengeSteps: challenge.restaurants.map(restoId => ({
      restaurantId: restoId,
      verificationStatus: false,
    })),
    completionStatus: 'in-progress',
    startDate: today,
    endDate,
  };
}

// for UI DEMO (remove at any time)
function DemoAddingChallenge({ onActivate }) {
  return (
    <>
      <h3>Click below to ADD Available challenges (using FAKE DATA)</h3>
      <ul className="cursor-pointer text-blue-800 underline space-y-1">
        {/* FAKE challenges to add */}
        {fakeChallenges.map((challenge, i) => {
          return (
            i > 0 && (
              <li key={i} onClick={() => onActivate(challenge)}>
                {challenge.title}
              </li>
            )
          );
        })}
      </ul>
    </>
  );
}

function ChallengeList({ onActivate }) {
  const [challenges, setChallenges] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_RECOMMENDER_URL}/challenges/recommend`, {
        method: 'POST',
      });
      const recommendations = await res.json();
      let challenges = [];
      for (const cuisine in recommendations) {
        challenges.push({
          title: `${cuisine} journey`,
          description: `Try a cuisine from 5 different ${cuisine} restaurants!`,
          numberOfPoints: 300,
          thumbnailImage: '/img/placeholderImg.jpg',
          restaurants: recommendations[cuisine].map(res => res['$oid']),
          duration: 30,
        });
      }
      console.log('Challenges: ', challenges);
      setChallenges(challenges);
    })();
  }, []);

  return (
    challenges.length > 0 && (
      <>
        <h3>Select your challenge!</h3>
        <div className="flex flex-row justify-around cursor-pointer space-y-1">
          {/* FAKE challenges to add */}
          {challenges.map((challenge, i) => {
            return (
              i > 0 && (
                <div
                  className="font-primary border-2 w-[300px] h-[100px] border-red-100 border-dashed font-medium"
                  key={i}
                  onClick={() => onActivate(challenge)}
                >
                  <h3 className="text-2xl">{challenge.title}</h3>
                  <FontAwesomeIcon icon={faClock} className="fa-solid text-yellow-300 inline" />
                  <span> &nbsp;{challenge.duration} Days</span>
                  <span className="block">{challenge.numberOfPoints} Points</span>
                </div>
              )
            );
          })}
        </div>
      </>
    )
  );
}
