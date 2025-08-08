'use client';
import { useState, useEffect } from 'react';
import MainBaseContainer from '../shared/MainBaseContainer';
import ActiveChallengeDetailModal from './ActiveChallengeDetailModal';
import Leaderboard from './Leaderboard';
import AllActiveChallenges from './AllActiveChallenges';
import { fakeChallenges, fakeActivatedChallengeDetail } from '@/app/data/fakeData';
import { useUserData } from '@/context/UserDataContext';
import ChallengeCompletedModal from './ChallengeCompletedModal';

export default function ChallengesPage() {
  const USER_ID = '664abc1234567890fedcba98'; // Porfile Owner's ID
  const MAX_ACTIVE = 3; // users can only have MAX 3 active challenges
  const [showChallengeDetailModal, setShowChallengeDetailModal] = useState(false); // opens/closes modal showing selected challenge details
  const [selectedChallenge, setSelectedChallenge] = useState(null); // ensures modal opens with correct challenge details

  const [activeChallenges, setActiveChallenges] = useState([]); // list of user's active challenges
  const [fetchedActivatedChallenges, setFetchedActivatedChallenges] = useState(false);

  const { userData } = useUserData(); // Current logged-in user's MongoDB data

  // Creates "active" challenge data and adds it to user's active challenges array (created for DEMO purposes)
  function handleActivateChallenge(challenge) {
    if (activeChallenges.length >= MAX_ACTIVE) return alert('You can only have 3 active challenges.');
    // create active challenge data and add to array
    const newActivated = createActivatedChallengeDetail(challenge, USER_ID);
    setActiveChallenges(prev => [...prev, newActivated]);
  }

  useEffect(() => {
    // get user's activated challenges
    async function fetchActivatedChallenges() {
      if (!userData) return;
      try {
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

  // Challenge Completed Modal State
  const [showChallengeCompletedModal, setShowChallengeCompletedModal] = useState(false);

  return (
    <>
      {userData && (
        <MainBaseContainer>
          <div className="main-side-padding w-full flex flex-col items-center m-16">
            {/* PLACEHOLDER for main progress bar and general user header */}
            <div className="w-full bg-gray-100 p-3 text-center flex flex-col gap-y-2">
              <h2>Placeholder for main progress bar and general user header</h2>
              <a href="/challenges/redeem">Redeem</a>
              {/* button placed here for DEMO PURPOSES ONLY */}
              <button
                className="bg-brand-blue w-fit p-1 px-4 rounded-full shadow-md mx-auto cursor-pointer"
                onClick={() => setShowChallengeCompletedModal(true)}
              >
                Open challengeCompletedModal (demo)
              </button>
              {/* Challenge Completed Modal */}
              {showChallengeCompletedModal && (
                <ChallengeCompletedModal
                  numPointsWon={123}
                  setShowChallengeCompletedModal={setShowChallengeCompletedModal}
                />
              )}
            </div>
            <div className="flex flex-col md:flex-row w-full min-h-96 my-4 gap-x-4 md:gap-y-0 gap-y-8">
              {/* Active Challenges */}
              {fetchedActivatedChallenges && (
                <AllActiveChallenges
                  setShowChallengeDetailModal={setShowChallengeDetailModal}
                  setSelectedChallenge={setSelectedChallenge}
                  activeChallenges={activeChallenges}
                />
              )}

              {/* Leaderboard */}
              <Leaderboard />
            </div>
            {/* PLACEHOLDER for AI-generated challenges */}
            <div className="w-full bg-gray-100 p-3 text-center">
              <h2 className="uppercase">Placeholder for AI-generated challenges</h2>
              {/* DEMO for adding/activating challenges */}
              <DemoAddingChallenge onActivate={handleActivateChallenge} />
            </div>

            {/* When active challenge card is clicked, show MODAL */}
            {showChallengeDetailModal && (
              <ActiveChallengeDetailModal
                onClose={setShowChallengeDetailModal}
                selectedActiveChallenge={selectedChallenge}
                setActiveChallenges={setActiveChallenges}
                activeChallenges={activeChallenges}
              />
            )}
          </div>
        </MainBaseContainer>
      )}
    </>
  );
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
