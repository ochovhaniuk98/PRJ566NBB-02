'use client';
import { useMediaQuery } from 'react-responsive';
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
  const { userData, loadingData, refreshUserData } = useUserData(); // Current logged-in user's MongoDB data (User / BusinessUser Object)
  const [points, setPoints] = useState(0); // not null
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState(null);
  const [couponValue, setCouponValue] = useState(0);

  useEffect(() => {
    // [!] do not set "!userData?.numOfPoints" or it will run forever if the user does not have points yet
    if (loadingData || !userData) return;
    if (userData?.numOfPoints != undefined) {
      console.log('User: ', userData);

      setPoints(userData.numOfPoints);
    }
    if (userData?.coupon?.code && userData?.coupon?.value) {
      setCouponCode(userData.coupon.code);
      setCouponValue(userData.coupon.value);
    } else {
      setCouponCode(null);
      setCouponValue(0);
    }
    setLoading(false);
  }, [loadingData, userData, refreshUserData]);

  async function redeemOption(option) {
    if (option.points_needed > points) {
      alert('Insufficient points!');
      return;
    }

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mongoId: userData._id,
          reward: option.value,
          pointsNeeded: option.points_needed,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Server response: ', data);
        alert('Congrats! Points Redeemed!');
      } else {
        alert('Failed to redeem points: ' + data.message);
      }
    } catch (error) {
      alert('Failed to redeem points: ' + error.message);
    } finally {
      refreshUserData();
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
      <div className="main-side-padding mt-16 w-full flex flex-col items-center min-h-screen relative">
        <div className="">
          <h2 className="">REDEEM POINTS</h2>
        </div>
        <div className="flex flex-row w-full items-center justify-center">
          {/* Num of Points */}
          <div className="md:size-28 size-24 mb-4 mr-0 relative">
            <Image src={'/img/coinWithFork.png'} alt={'coin'} className="object-contain" fill={true} />
          </div>
          <div className="inline-flex items-baseline justify-center font-primary mb-8">
            <span className={'text-9xl font-secondary font-normal text-brand-green'}>{points || '000'}</span>
            <span className={'text-2xl font-medium'}>pts</span>
          </div>
        </div>

        {/* main progress bar */}
        <div className="md:w-[70%] w-[99%] flex flex-row items-center relative mb-2">
          <div className="absolute bg-brand-peach w-[100%] md:h-[16px] h-[12px] rounded-full"></div>
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
        <RedeemButtonsOnMobile redemptionOptions={redemption_options} level={level} />
        <div className="w-full flex justify-center">
          <div>
            <h2 className="text-center">Available Coupon Code</h2>
            {couponCode ? (
              <div className="bg-brand-aqua-lite border-4 border-brand-aqua h-30 w-xs rounded-md shadow-md p-4 mt-2 flex flex-col items-center justify-center">
                <div className="font-secondary text-6xl flex items-center gap-x-1 text-brand-aqua">
                  <span className={'font-primary text-4xl font-semibold'}>$</span>
                  {couponValue}
                </div>
                <h3 className="uppercase">{couponCode}</h3>
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-brand-grey-lite h-30 w-xs rounded-md p-4 mt-2 flex flex-col items-center justify-center">
                <div className="font-secondary text-6xl flex items-center gap-x-1 text-brand-grey-lite">
                  <span className={'font-primary text-4xl font-semibold'}>$</span>0
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainBaseContainer>
  );
}

function RedeemButtonsOnMobile({ redemptionOptions, level }) {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <>
      {isMobile && (
        <div className="flex flex-col w-full  gap-y-4 items-center mb-8">
          <h2>Redeemable Discounts</h2>
          {level > 0 ? (
            redemptionOptions.map((redemption_option, i) => {
              const enabled = level >= i + 1;
              return (
                enabled && (
                  <div className="flex items-center">
                    <h2 className="inline-block w-12">
                      <span className="text-lg font-normal">$</span>
                      {redemption_option.value}
                    </h2>
                    <button className=" bg-brand-blue text-brand-navy font-medium py-2 px-6 rounded-full shadow cursor-pointer">
                      Redeem
                    </button>
                  </div>
                )
              );
            })
          ) : (
            <i className="font-light text-center text-brand-grey">
              No discounts to redeem.
              <br />
              Complete challenges to earn points!
            </i>
          )}
        </div>
      )}
    </>
  );
}
