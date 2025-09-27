'use client';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faGamepad, faTrophy } from '@fortawesome/free-solid-svg-icons';
import Sparkles from '@/components/homepage/Sparkles';

export default function HomeBanner() {
  // Change button link depending on user type (authorized vs unauthorized)
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info
  const primaryBtnHref = user ? '/challenges' : '/sign-up';
  const primaryBtnLabel = user ? 'Play Now' : 'Join to Play';
  const secondaryBtnHref = user ? '/challenges/redeem' : '/login';
  const secondaryBtnLabel = user ? 'Redeem Points' : 'Login';

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
            <Link href={primaryBtnHref} className={`landingButtonSingle bg-brand-green-lite hover:bg-brand-green`}>
              <FontAwesomeIcon icon={faGamepad} className={`text-2xl`} />
              {primaryBtnLabel}
            </Link>
            <Link href={secondaryBtnHref} className="landingButtonSingle bg-brand-peach hover:bg-[#ffcea5]">
              <FontAwesomeIcon icon={user ? faTrophy : faArrowRightToBracket} className={`text-2xl text-brand-navy`} />
              {secondaryBtnLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
