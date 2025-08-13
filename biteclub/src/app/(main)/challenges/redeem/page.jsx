'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import Spinner from '@/components/shared/Spinner';
import { Milestone } from '@/components/challenges/ChallengesPage';
import Image from 'next/image';

const BAR_COMPLETE_COLOR = '#8CBF38';
const MAX_POINTS = 2750;

const redemption_options = [
  {
    points_needed: 1000,
    value: 5.0,
  },
  {
    points_needed: 1500,
    value: 10.0,
  },
  {
    points_needed: 2000,
    value: 15.0,
  },
  {
    points_needed: 2500,
    value: 20.0,
  },
  {
    points_needed: 2750,
    value: 25.0,
  },
];

export default function Redeem() {
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info
  const { userData, loadingData } = useUserData(); // Current logged-in user's MongoDB data (User / BusinessUser Object)
  const [points, setPoints] = useState(0); // not null
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState(null);

  useEffect(() => {
    // [!] do not set "!userData?.numOfPoints" or it will run forever if the user does not have points yet
    if (loadingData || !userData) return;
    if (userData?.numOfPoints != undefined) {
      console.log('User: ', userData);

      setPoints(userData.numOfPoints);
      //setPoints(2200); // FOR TESTING
    }
    if (userData?.coupon?.code) {
      setCouponCode(userData.coupon.code);
    }
    setLoading(false);
  }, [loadingData, userData]);

  async function redeemOption(option) {
    if (option.points_needed > points) {
      alert('Insufficient points!');
      return;
    }

    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supabaseId: user.id,
        reward: option.value,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      console.log('Server response: ', data);
      alert('Congrats! Points Redeemed!');
    }
  }

  if (loadingData || loading) return <Spinner />;

  // get point level user reached
  const level = redemption_options.filter(o => points >= o.points_needed).length;

  // calc progress perc
  const percentComplete = (() => {
    const capped = Math.min(points, MAX_POINTS);
    const percent = ((capped - 1000) / (MAX_POINTS - 1000)) * 100;
    return Math.max(0, Math.round(percent));
  })();

  return (
    <MainBaseContainer>
      <div className="main-side-padding py-8 w-full flex flex-col items-center justify-center min-h-screen relative">
        <div className="absolute top-18 left-20">
          <h2 className="">REDEEM POINTS</h2>
        </div>
        <div className="flex flex-row w-full items-center justify-center">
          {/* Num of Points */}
          <div className="size-28 mb-4 mr-0 relative">
            <Image src={'/img/coinWithFork.png'} alt={'coin'} className="object-contain" fill={true} />
          </div>
          <div className="inline-flex items-baseline justify-center font-primary mb-8">
            <span className="text-9xl font-secondary font-normal text-brand-green">{points || 0}</span>
            <span className="text-2xl font-medium">pts</span>
          </div>
        </div>

        {/* main progress bar */}
        <div className="w-[80%] flex flex-row items-center relative mb-32">
          <div className="absolute bg-brand-peach w-[100%] h-[24px] rounded-full"></div>
          <div
            className={`absolute w-[100%] h-[24px] z-[1] rounded-full`}
            style={{ width: `${percentComplete}%`, backgroundColor: BAR_COMPLETE_COLOR }}
          ></div>
          <div className="flex flex-row justify-between w-full">
            {redemption_options.map((redemption_option, i) => {
              return (
                <Milestone
                  key={i}
                  level={level}
                  levelRequired={i + 1}
                  className="z-[2]"
                  pointsNeeded={redemption_option.points_needed}
                  reward={redemption_option.value}
                  largeSize={true}
                  onRedeem={() => redeemOption(redemption_option)}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full">
          <h2>Available Coupon Code</h2>
          {couponCode ? (
            <div className="bg-brand-aqua-lite border-4 border-brand-aqua h-30 w-xs rounded-md shadow-md p-4 mt-2 flex flex-col items-center justify-center">
              <div className="font-secondary text-6xl flex items-center gap-x-1 text-brand-aqua">
                <span className="font-primary text-4xl font-semibold">$</span>20
              </div>
              <h3 className="uppercase">{couponCode}</h3>
            </div>
          ) : (
            <div className="bg-white border-2 border-brand-aqua border-dashed h-30 w-xs rounded-md p-4 mt-2 flex flex-col items-center justify-center text-6xl font-primary font-medium text-brand-aqua">
              $0
            </div>
          )}
        </div>
      </div>
    </MainBaseContainer>
  );
}
