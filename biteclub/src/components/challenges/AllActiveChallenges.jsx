import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faQuestion } from '@fortawesome/free-solid-svg-icons';
import ActiveChallengeCard from './ActiveChallengeCard';
import { fakeActivatedChallengeDetail } from '@/app/data/fakeData';

export default function AllActiveChallenges({ activeChallenges, setShowChallengeDetailModal, setSelectedChallenge }) {
  return (
    <div className="w-3/5">
      <h2>My Active Challenges</h2>
      <div className="flex gap-x-4">
        {[0, 1, 2].map(i =>
          activeChallenges[i] ? (
            <ActiveChallengeCard
              key={i}
              onOpen={() => {
                setSelectedChallenge(activeChallenges[i]);
                setShowChallengeDetailModal(true);
              }}
              activeChallengeData={activeChallenges[i]}
            />
          ) : (
            /* empty slot for when user has less than 3 active challenges */
            <EmptyChallengeSlot key={i} />
          )
        )}
      </div>
    </div>
  );
}

function EmptyChallengeSlot() {
  return (
    <div className="w-1/3 min-h-102 flex items-center justify-center bg-brand-yellow-extralite text-brand-grey shadow-inner rounded p-4 font-primary text-center">
      <FontAwesomeIcon icon={faGamepad} className={`text-6xl text-brand-yellow-lite mr-3`} />
      <FontAwesomeIcon icon={faQuestion} className={`text-5xl text-brand-yellow-lite`} />
    </div>
  );
}
