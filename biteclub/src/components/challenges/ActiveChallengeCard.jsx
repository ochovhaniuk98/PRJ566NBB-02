'use client'; // for circular progressbar
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTrophy, faClock } from '@fortawesome/free-solid-svg-icons';
import { fakeChallenges } from '@/app/data/fakeData';
import { getDaysRemaining } from './Util';
import { useState, useEffect } from 'react';

// DESCRIPTION: When a user adds an available challenge, the challenge is ACTIVATED and this card appears
export default function ActiveChallengeCard({ onOpen, activeChallengeData }) {
  // get specific challenge from "fakeChallenges" array to access details
  // const challenge = fakeChallenges.find(c => c._id === activeChallengeData.challengeId);
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
  const numCompletedSteps = activeChallengeData.challengeSteps.filter(step => step.verificationStatus).length;

  console.log('activeChallengeData: ', activeChallengeData);

  return (
    <>
      {fetchedChallenge && (
        <>
          <div
            className="w-1/3 relative flex flex-col items-center gap-y-2 bg-brand-yellow-lite p-4 font-primary cursor-pointer shadow-lg text-center"
            onClick={onOpen} // opens challenge details modal
          >
            {/* circular progress bar */}
            <CircularProgressBar
              totalSteps={activeChallengeData.challengeSteps.length}
              numCompletedSteps={numCompletedSteps}
            />
            {/* title */}
            <h3>{challenge.title}</h3>
            <div className="min-h-20">
              {/* desc */}
              <p>{challenge.description}</p>
            </div>
            {/*reward + time left */}
            <div className="w-full mb-2">
              <ChallengeStat s_icon={faTrophy} s_label="REWARD:" s_unit="pts" s_value={challenge.numberOfPoints} />
              <ChallengeStat
                s_icon={faClock}
                s_label="TIME LEFT:"
                s_unit="days"
                s_value={getDaysRemaining(activeChallengeData.endDate)}
              />
            </div>
            <div className="w-full text-right">
              <FontAwesomeIcon icon={faChevronRight} className={` icon-xl text-brand-navy`} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function CircularProgressBar({ totalSteps, numCompletedSteps }) {
  const percentage = (numCompletedSteps / totalSteps) * 100;
  return (
    <div className="relative w-[150px] h-[150px] mb-0">
      <CircularProgressbar
        value={percentage}
        text={`${numCompletedSteps}/${totalSteps}`}
        styles={buildStyles({
          pathColor: '#80c001',
          trailColor: '#ffdcbe',
          textColor: 'transparent', // hide default text
          strokeWidth: 24,
        })}
        strokeWidth={24}
      />
      {/* inner circle with border stroke */}
      <div className="absolute top-1/2 left-1/2 w-[85px] h-[85px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-peach border-2 border-brand-navy text-brand-navy flex items-center justify-center font-secondary text-5xl">
        {numCompletedSteps}/{totalSteps}
      </div>
    </div>
  );
}

function ChallengeStat({ s_label, s_value, s_unit, s_icon }) {
  return (
    <div className="flex justify-between">
      <h4>
        <FontAwesomeIcon icon={s_icon} className={` icon-md text-brand-yellow mr-1`} />
        {s_label}
      </h4>
      <p>
        <span className="font-semibold">{s_value}</span> {s_unit}
      </p>
    </div>
  );
}
