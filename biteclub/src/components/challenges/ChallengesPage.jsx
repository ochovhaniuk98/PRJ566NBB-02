'use client';
import { useState } from 'react';
import MainBaseContainer from '../shared/MainBaseContainer';
import ActiveChallengeDetailModal from './ActiveChallengeDetailModal';
import Leaderboard from './Leaderboard';
import AllActiveChallenges from './AllActiveChallenges';
import { fakeChallenges, fakeActivatedChallengeDetail } from '@/app/data/fakeData';

export default function ChallengesPage() {
  const USER_ID = '664abc1234567890fedcba98'; // Porfile Owner's ID
  const MAX_ACTIVE = 3; // users can only have MAX 3 active challenges
  const [showChallengeDetailModal, setShowChallengeDetailModal] = useState(false); // opens/closes modal showing selected challenge details
  const [selectedChallenge, setSelectedChallenge] = useState(null); // ensures modal opens with correct challenge details
  const [activeChallenges, setActiveChallenges] = useState([fakeActivatedChallengeDetail]); // list of user's active challenges

  // Creates "active" challenge data and adds it to user's active challenges array (created for DEMO purposes)
  function handleActivateChallenge(challenge) {
    if (activeChallenges.length >= MAX_ACTIVE) return alert('You can only have 3 active challenges.');
    // create active challenge data and add to array
    const newActivated = createActivatedChallengeDetail(challenge, USER_ID);
    setActiveChallenges(prev => [...prev, newActivated]);
  }

  return (
    <MainBaseContainer>
      <div className="main-side-padding w-full flex flex-col items-center m-16">
        {/* PLACEHOLDER for main progress bar and general user header */}
        <div className="w-full bg-gray-100 p-3 text-center">
          <h2>Placeholder for main progress bar and general user header</h2>
          <a href="/challenges/redeem">Redeem</a>
        </div>
        <div className="flex w-full min-h-96 my-4 gap-x-4">
          {/* Active Challenges */}
          <AllActiveChallenges
            setShowChallengeDetailModal={setShowChallengeDetailModal}
            setSelectedChallenge={setSelectedChallenge}
            activeChallenges={activeChallenges}
          />
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
