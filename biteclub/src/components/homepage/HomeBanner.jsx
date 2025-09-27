import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faGamepad } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

import Sparkles from '@/components/homepage/Sparkles';

export default function HomeBanner() {
  return (
    <div className="bg-gradient-to-br from-brand-yellow to-[#ffce5d]  w-full min-h-[350px] xl:h-[48vw] lg:h-[52vw] md:h-[64vw] h-[31rem] min-w-[20rem] relative overflow-hidden">
      <div className="absolute xl:size-[50vw] lg:size-[46vw] md:size-[56vw] sm:size-[66vw] size-[20rem] xl:left-[40vw] lg:left-[44vw] md:left-[38vw] sm:left-[32vw] left-[8rem] xl:-bottom-28 lg:-bottom-17 md:-bottom-16 sm:-bottom-15 -bottom-11 min-h-72">
        <Image
          src={'img/landingBannerLargeTxt2.png'}
          alt={'food plates'}
          quality={100}
          unoptimized={true}
          className="object-contain"
          fill={true}
        />
        <Sparkles />
      </div>
      <div className="absolute -top-2 left-[10%] font-secondary xl:leading-24 lg:leading-20 md:leading-17 leading-14 uppercase w-[50%] h-full cursor-default ">
        <div className="landingContainer">
          <div className="absolute xl:w-100 lg:w-90 md:w-70 w-full left-0 h-full">
            <div className="landingTitle absolute">
              Level Up Your
              <br />
              <span className="landingTitleSpan">Taste</span>
            </div>
            <div className="landingTitle absolute md:top-1 top-[2px] text-brand-green md:[-webkit-text-stroke:1px_black] [-webkit-text-stroke:0.75px_black]">
              Level Up Your
              <br />
              <span className="landingTitleSpan text-white">Taste</span>
            </div>
          </div>
          <div className="landingText">
            Turn every meal into an adventure.
            <br />
            Explore, taste, and collect points for discounts as you level up your palate with BiteClub.
          </div>
          <div className="landingButtons">
            <button
              onClick={() => router.push('/sign-up')}
              className="landingButtonSingle bg-brand-green transform transition-transform duration-200 hover:scale-110"
            >
              <FontAwesomeIcon icon={faGamepad} className={`text-2xl`} />
              Join to Play
            </button>
            <button onClick={() => router.push('/login')} className="landingButtonSingle bg-brand-peach">
              <FontAwesomeIcon icon={faArrowRightToBracket} className={`text-2xl text-brand-navy`} />
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
