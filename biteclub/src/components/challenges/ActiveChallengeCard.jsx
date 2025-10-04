'use client'; // for circular progressbar
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTrophy, faClock } from '@fortawesome/free-solid-svg-icons';
import { getDaysRemaining } from './Util';
import { useState, useEffect } from 'react';

// DESCRIPTION: When a user adds an available challenge, the challenge is ACTIVATED and this card appears
export default function ActiveChallengeCard({ onOpen, activeChallengeData }) {
  // challenge
  const [challenge, setChallenge] = useState(''); // active challenge data
  const [fetchedChallenge, setFetchedChallenge] = useState(false);

  // num of completed steps
  const [numCompletedSteps, setNumCompletedSteps] = useState(0);
  const [fetchedNumCompletedSteps, setFetchedNumCompletedSteps] = useState(false);

  // fetch a challenge by activeChallengeData.challengeId
  useEffect(() => {
    async function fetchChallenge() {
      try {
        const res = await fetch(`api/challenges/all-challenges/get-by-challengeId/${activeChallengeData.challengeId}`);
        const data = await res.json();
        // console.log('data', data);
        setChallenge(data);
      } catch (err) {
        console.error('Failed to fetch challenge:', err);
      }

      setFetchedChallenge(true);
    }
    fetchChallenge();
  }, []);

  useEffect(() => {
    getCompletedSteps();
  }, [activeChallengeData]);

  function getCompletedSteps() {
    if (!activeChallengeData) return;
    // get num of completed challenge steps
    const numCompletedSteps = activeChallengeData.challengeSteps.filter(step => step.verificationStatus).length;
    setNumCompletedSteps(numCompletedSteps);
    setFetchedNumCompletedSteps(true);
  }

  return (
    <>
      {fetchedChallenge && fetchedNumCompletedSteps >= 0 && (
        <>
          <div
            className="md:w-1/3 w-full flex-grow relative flex flex-col items-center gap-y-2 bg-brand-yellow-lite p-4 font-primary cursor-pointer shadow-lg text-center md:mb-0 mb-2"
            onClick={onOpen} // opens challenge details modal
          >
            <div className="flex md:flex-col items-center md:gap-x-0 gap-x-2 w-full">
              {/* circular progress bar */}
              <CircularProgressBar
                totalSteps={activeChallengeData.challengeSteps.length}
                numCompletedSteps={numCompletedSteps}
              />
              <div className="md::pt-4">
                <div className="md:text-center text-left">
                  {/* title */}
                  <div className="md:h-12 capitalize">
                    <h3>{challenge.title}</h3>
                  </div>

                  <div className="md:h-30 md:mb-0 mb-4">
                    {/* desc */}
                    <p>{challenge.description}</p>
                  </div>
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
              </div>
            </div>
            <div className="w-full text-right md:block hidden absolute bottom-2 right-2">
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
    <div className="relative min-w-[100px] min-h-[100px] max-w-[150px] max-h-[150px] mb-0">
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
      <div className="absolute top-1/2 left-1/2 md:size-[85px] size-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-peach border-2 border-brand-navy text-brand-navy flex items-center justify-center font-secondary text-5xl">
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
