import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import StyledPageTitle from '@/components/shared/StyledPageTitle';
import { Button } from '@/components/shared/Button';

export default function SurpriseBanner({ onSurprise }) {
  return (
    <div
      className=" flex flex-col gap-4 items-center justify-center w-full h-full md:p-8 p-2 md:py-8 py-4 bg-brand-aqua text-center
    bg-no-repeat
    sm:bg-[url('/img/lightSpoonFork.png')] sm:bg-[length:12rem] sm:bg-[position:10%_8rem]
    md:bg-[url('/img/lightSpoonFork.png')] md:bg-[length:12rem] md:bg-[position:5%_6rem]
    lg:bg-[url('/img/lightSpoonFork.png')] lg:bg-[length:12rem] lg:bg-[position:5%_6rem]
    xl:bg-[url('/img/lightSpoonFork.png')] xl:bg-[length:15rem] xl:bg-[position:18%_4rem]"
    >
      <div className="relative lg:w-3xl md:w-lg w-sm lg:h-17 h-8">
        <StyledPageTitle
          textString="Can't decide what to eat?"
          p_fontSize="lg:text-7xl md:text-5xl text-4xl"
          txtColour="text-white"
          outlineWidth="lg:[-webkit-text-stroke:0.75px_black] [-webkit-text-stroke:0.75px_black]"
          shadowPos="lg:top-[3px] top-[2px]"
          textAlign="text-center"
        />
      </div>
      <p className="w-sm">
        When everything looks good, choosing can be the hardest part. Let chance decide. Discover a cuisine you didn’t
        know you were craving.
      </p>
      <Button className="m-auto" onClick={onSurprise} variant="secondary" disabled={false}>
        Surprise Me
        <FontAwesomeIcon icon={faArrowRight} className={`text-xl`} />
      </Button>
    </div>
  );
}
