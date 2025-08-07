'use client';
import { useState, useEffect } from 'react';
import MainBaseContainer from '../shared/MainBaseContainer';
import ActiveChallengeDetailModal from './ActiveChallengeDetailModal';
import Leaderboard from './Leaderboard';
import AllActiveChallenges from './AllActiveChallenges';
import { fakeChallenges, fakeActivatedChallengeDetail } from '@/app/data/fakeData';
import { useUserData } from '@/context/UserDataContext';
import ChallengeCompletedModal from './ChallengeCompletedModal';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MAX_POINTS = 2750;
const BAR_INCOMPLETE_COLOR = "#F8DDC1";
const BAR_COMPLETE_COLOR = "#8CBF38";


export default function ChallengesPage() {
  const USER_ID = '664abc1234567890fedcba98'; // Porfile Owner's ID
  const MAX_ACTIVE = 3; // users can only have MAX 3 active challenges
  const [showChallengeDetailModal, setShowChallengeDetailModal] = useState(false); // opens/closes modal showing selected challenge details
  const [points, setPoints] = useState(0); // points added after challenge completion
  const [selectedChallenge, setSelectedChallenge] = useState(null); // ensures modal opens with correct challenge details
  const [percentComplete, setPercentComplete] = useState(0);
  const [level, setLevel] = useState(0);
  const [activeChallenges, setActiveChallenges] = useState([]); // list of user's active challenges
  const [fetchedActivatedChallenges, setFetchedActivatedChallenges] = useState(false);

  const [leaderboardRefreshTrigger, refreshLeaderboard] = useState(false); // used to refresh leaderboard data

  const { userData } = useUserData(); // Current logged-in user's MongoDB data
  // Creates "active" challenge data and adds it to user's active challenges array (created for DEMO purposes)
  function handleActivateChallenge(challenge) {
    if (activeChallenges.length >= MAX_ACTIVE) return alert('You can only have 3 active challenges.');
    // create active challenge data and add to array
    console.log("User data:", userData);
    fetch('api/challenges/activateChallenge', {
      "method": "POST",
      "body": JSON.stringify({userId: userData._id,challenge})
    })
    // setActiveChallenges(prev => [...prev, newActivated]);
  }

  useEffect(() => {
    // get user's activated challenges
    async function fetchActivatedChallenges() {
      if (!userData) return;
      try {
        setPoints(userData.numOfPoints);
        setPercentComplete(parseInt(((userData.numOfPoints - 1000) / (MAX_POINTS - 1000)) * 100));
        console.log()
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
        // console.log('Activated inProgressChallenges:', inProgressChallenges[0]);
        setActiveChallenges(inProgressChallenges);

        // console.log('Active challenges: ', activeChallenges);
      } catch (err) {
        console.error('Failed to load activated challenges:', err);
      }
      setFetchedActivatedChallenges(true);
    }
    fetchActivatedChallenges();
  }, [userData]);

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
          <div className="main-side-padding w-full flex flex-col items-center m-16">
            {/* PLACEHOLDER for main progress bar and general user header */}
            <div className="flex flex-row w-full justify-between">
              <div></div>
              <div className="inline">
                <span className="text-4xl">{points}</span><span> Points</span>
              </div>
              <div className="flex flex-row justify-between w-[75px] items-center">
                <a href="/challenges/redeem" className="underline">Redeem</a>
                <FontAwesomeIcon icon={faArrowRight} className="text-[#213398]"></FontAwesomeIcon>
              </div>
            </div>
            <div className="w-[80%] flex flex-row items-center relative mb-2">
              <div className="absolute bg-[#F8DDC1] w-[100%] h-[10px]"></div>
              <div className={`absolute w-[6983%] h-[11px] z-[1]`} style={{ width: `${percentComplete}%`, backgroundColor: BAR_COMPLETE_COLOR }}></div>
              <div className="flex flex-row justify-between w-full">
                <Milestone level={level} levelRequired={1} className="z-[2]" pointsNeeded={1000} reward={5} />
                <Milestone level={level} levelRequired={2} className="z-[2]" pointsNeeded={1500} reward={10} />
                <Milestone level={level} levelRequired={3} className="z-[2]" pointsNeeded={2000} reward={15} />
                <Milestone level={level} levelRequired={4} className="z-[2]" pointsNeeded={2500} reward={20} />
                <Milestone level={level} levelRequired={5} className="z-[2]" pointsNeeded={2750} reward={25} />
              </div>
            </div>

            <div className="w-full bg-gray-100 p-3 text-center flex flex-col gap-y-2">
              <button
                className="bg-brand-blue w-fit p-1 px-4 rounded-full shadow-md mx-auto cursor-pointer"
                onClick={() => setShowChallengeCompletedModal(true)}
              >
                Open challengeCompletedModal (demo)
              </button>
              {/* Challenge Completed Modal */}
              {showChallengeCompletedModal && (
                <ChallengeCompletedModal
                  numPointsWon={points}
                  setShowChallengeCompletedModal={setShowChallengeCompletedModal}
                />
              )}
            </div>
            <div className="flex w-full min-h-96 my-4 gap-x-4">
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
            {/* PLACEHOLDER for AI-generated challenges */}
            <div className="w-full bg-gray-100 p-3 text-center">
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
const Milestone = ({ level, levelRequired, pointsNeeded, reward, className }) => {
  if (levelRequired == 0) {
    return <div />;
  }

  const enabled = level >= levelRequired;

  const color = enabled ? BAR_COMPLETE_COLOR : BAR_INCOMPLETE_COLOR
  return <div className="flex flex-col justify-center items-center w-fit relative h-[100px]">
    <span className="absolute mb-16 font-bold">${reward}</span>
    <div className={`h-[40px] w-[40px] rounded-3xl ${className}`} style={{ backgroundColor: color }} />
    <span className="absolute w-[45px] text-center mt-20 text-xs">{pointsNeeded} points</span>
  </div>
}

const Challenge = ({ challenge }) => {
  const { title, description, reward, totalSteps, currentStep, totalDays, dateAccepted, infiniteTime } = challenge;
  const timeLeft = totalDays - Math.floor(infiniteTime ? "Unlimited" : (new Date() - dateAccepted) / (60 * 60 * 24 * 1000))

  return <div>
    {title} {description} {reward}

    <div><span>Time left: {timeLeft}</span></div>
  </div>
}

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
  const [challenges, setChallenges] = useState([])
  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_RECOMMENDER_URL}/challenges/recommend`, {
        "method": "POST"
      })
      const recommendations = await res.json();
      let challenges = [];
      for (const cuisine in recommendations) {
        challenges.push({
          title: `${cuisine} journey`,
          description: `Try a cuisine from 5 different ${cuisine} restaurants!`,
          numberOfPoints: 300,
          thumbnailImage: '/img/placeholderImg.jpg',
          restaurants: recommendations[cuisine].map(res => res["$oid"]),
          duration: 30
        })
      }
      console.log("Challenges: ", challenges);
      setChallenges(challenges);
    })()
  }, [])

  return challenges.length > 0 && (
    <>
      <h3>Select your challenge!</h3>
      <ul className="cursor-pointer text-blue-800 underline space-y-1">
        {/* FAKE challenges to add */}
        {challenges.map((challenge, i) => {
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
