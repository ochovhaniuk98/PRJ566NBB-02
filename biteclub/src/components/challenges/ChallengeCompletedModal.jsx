import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmarkCircle, faXmarkSquare } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

// modal that pops up automatically when user completes WHOLE challenge
export default function ChallengeCompletedModal({ numPointsWon = 123, setShowChallengeCompletedModal }) {
  return (
    <div className="fixed inset-0 z-100 w-screen h-screen bg-brand-navy flex flex-col items-center gap-y-8">
      {/* Close Modal Icon */}
      <div className="fixed top-3 right-3 p-1 w-fit h-fit" onClick={() => setShowChallengeCompletedModal(false)}>
        <FontAwesomeIcon
          icon={faXmarkCircle}
          className="text-4xl text-brand-blue cursor-pointer transition-transform duration-200 hover:scale-125"
        />
      </div>
      {/* Num of Points Header */}
      <div className="text-white font-primary text-3xl flex items-baseline-last gap-x-1">
        <div className="flex items-center gap-x-2">
          <FontAwesomeIcon icon={faPlus} className="text-5xl text-white cursor-pointer" />
          <div className=" relative w-56 h-32">
            <div className="absolute top-0 right-1 font-secondary text-[8rem] ">{numPointsWon}</div>
            <div
              className="absolute top-1 right-0 font-secondary text-[8rem] text-brand-green"
              style={{
                WebkitTextStroke: '1px white',
              }}
            >
              {numPointsWon}
            </div>
          </div>
        </div>
        <span className="text-3xl font-semibold">points</span>
      </div>
      {/* Coin + Confetti Image */}
      <div className="relative h-110 w-full">
        <Image src={'/img/coinAndConfetti.png'} alt={'coin and confetti'} className="object-contain" fill={true} />
      </div>
      <h2 className="text-brand-aqua-lite">Challenge Completed!</h2>
    </div>
  );
}
