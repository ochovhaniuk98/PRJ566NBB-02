'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StyledPageTitle from '@/components/shared/StyledPageTitle';
import { Button } from '@/components/shared/Button';
import StarRating from '@/components/shared/StarRating';
import RotatingGallery from './RotatingGallery';
import { POME_IMAGES } from '@/app/data/fakeData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../shared/Spinner';

// Purpose: To provide HR or employers to easily navigate to The Pomegranate Restaurant's profile from the homepage
// (so they can see a full profile demo)
export default function PomegranateRestaurantHighlight() {
  const POMEGRANATE_ID = '682a2ecf70221a179b693583'; // Pomegranate Restaurant's ID

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!POMEGRANATE_ID) return;
    (async () => {
      try {
        const res = await fetch(`/api/restaurants/${POMEGRANATE_ID}?fields=name,rating,numReviews,priceRange`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Highlight fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [POMEGRANATE_ID]);

  if (loading) {
    return <Spinner />;
  }
  if (!data) return null;

  const { name, rating = 0, numReviews = 0, priceRange = '$' } = data;

  return (
    <div className=" bg-white mt-12 flex md:flex-row flex-col justify-center items-center gap-y-4 gap-x-6 w-full min-h-96 border border-brand-yellow-lite md:p-3 p-0">
      <div className="md:w-4/7 w-full">
        <RotatingGallery images={POME_IMAGES} />
      </div>
      <div className="md:w-3/7 w-full flex justify-center items-center relative lg:p-8 p-4 pl-0">
        <div className="flex flex-col gap-y-4 items-center">
          <div className="absolute size-16 top-8 hidden">
            <Image
              src={'img/chefHat.png'}
              alt={'food plates'}
              quality={100}
              unoptimized={true}
              className="object-contain"
              fill={true}
            />
          </div>
          <StyledPageTitle
            textString={name.replace(/^The\s+/i, '')}
            p_fontSize="xl:text-7xl md:text-5xl text-4xl"
            txtColour="text-brand-yellow"
            outlineWidth="lg:[-webkit-text-stroke:0.75px_black] [-webkit-text-stroke:0.75px_black]"
            shadowPos="lg:top-[3px] top-[2px]"
            textAlign="text-center"
          />

          <div className="flex items-center gap-x-2">
            <h2 className="font-semibold">{Number(rating).toFixed(1)}</h2>
            <StarRating colour={'text-brand-green'} iconSize={'md:icon-xl icon-lg'} ratingNum={Number(rating)} />
            <div className="font-normal text-xl font-primary">
              {numReviews.toLocaleString()} <span className="font-normal text-xl font-primary">reviews</span>
            </div>
            {/* price range tag */}
            <div className="bg-brand-blue-lite px-2 rounded-full w-15 h-fit flex justify-center text-primary">
              <p>{priceRange}</p>
            </div>
          </div>
          <p className="text-black text-lg font-normal">
            Opened in 2003 by Ali Fakhrashrafi and Danielle Schrage, Pomegranate is a love letter to Ali’s Iranian
            childhood. The couple set out to serve home-style Persian stews, researching recipes in memoirs and
            historical texts. With chefs who’ve stayed two decades, they’ve built a living legacy.
          </p>
          <Link href={`/restaurants/${POMEGRANATE_ID}`}>
            <Button className="m-auto" variant="secondary">
              Visit Profile
              <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
