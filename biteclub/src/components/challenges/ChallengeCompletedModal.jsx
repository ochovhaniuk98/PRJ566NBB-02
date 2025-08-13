import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useEffect } from 'react';

// modal that pops up automatically when user completes WHOLE challenge
export default function ChallengeCompletedModal({ numPointsWon = 123, setShowChallengeCompletedModal }) {
  useEffect(() => {
    // Automatically close the modal after 7 seconds
    const timer = setTimeout(() => {
      setShowChallengeCompletedModal(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, [setShowChallengeCompletedModal]);

  return (
    <div className="fixed inset-0 z-100 w-screen h-screen bg-brand-green flex items-center justify-between">
      <div
        className="h-full w-1/4 bg-cover"
        style={{
          backgroundImage: "url('/img/confetti-large.png')",
          backgroundSize: '290%',
          backgroundPosition: '0rem',
          transform: 'scaleX(-1)',
        }}
      ></div>

      <div className="w-2/4 h-full flex flex-col items-center justify-evenly text-brand-navy">
        {/* Num of Points Header */}
        <div className="text-brand-navy font-primary text-3xl flex items-baseline-last gap-x-0">
          <div className="flex items-center gap-x-1">
            <FontAwesomeIcon icon={faPlus} className="text-6xl text-brand-navy cursor-pointer" />
            <div
              className="font-secondary text-[12rem] text-brand-navy"
              style={{
                WebkitTextStroke: '2px white',
              }}
            >
              {numPointsWon}
            </div>
          </div>
          <span className="text-3xl font-semibold">points</span>
        </div>
        {/* Coin Image */}
        <div className="relative h-86 w-full">
          <Image src={'/img/coinWithFork.png'} alt={'coin and confetti'} className="object-contain" fill={true} />
        </div>
        <span className="text-brand-navy text-3xl font-semibold font-primary uppercase">Challenge Completed!</span>
      </div>
      <div
        className="h-full w-1/4 bg-cover"
        style={{
          backgroundImage: "url('/img/confetti-large.png')",
          backgroundSize: '290%',
          backgroundPosition: '0rem',
        }}
      >
        {/* Close Modal Icon */}
        <div className="fixed top-3 right-3 p-1 w-fit h-fit" onClick={() => setShowChallengeCompletedModal(false)}>
          <FontAwesomeIcon
            icon={faXmarkCircle}
            className="text-5xl text-white cursor-pointer transition-transform duration-200 hover:scale-125"
          />
        </div>
      </div>
    </div>
  );
}
