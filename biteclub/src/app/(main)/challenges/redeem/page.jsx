'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import { Button } from '@/components/shared/Button';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import Spinner from '@/components/shared/Spinner';

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
      console.log("User: ", userData);
      setPoints(userData.numOfPoints);
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
      console.log("Server response: ", data)
      alert('Points successfully redeemed!\n' + 'Your coupon code is ' + data.couponCode);
    }
  }

  if (loadingData || loading) return <Spinner />;

  return (
    <MainBaseContainer>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center mt-16">
        <div className="flex flex-col items-start gap-4 w-full m-8">
          <h1>Get Your Rewards</h1>
          <p>Complete challenges to earn points, then redeem them here for exclusive food coupons.</p>
          <p className="text-2xl">Your points: {points}</p>
        </div>
        <div className="flex flex-col gap-6 min-w-full">
          {redemption_options.map(redemption_option => {
            return (
              <div
                className="flex flex-row w-full justify-between items-center text-[50px]"
                key={redemption_option.value}
              >
                <div className="self-start font-bold text-[50px]">${redemption_option.value}</div>
                <Button
                  type="button"
                  className="w-30"
                  variant="default"
                  onClick={() => {
                    redeemOption(redemption_option);
                  }}
                >
                  {redemption_option.points_needed} points
                </Button>
              </div>
            );
          })}
        </div>
        {couponCode && <p><span className="font-bold">Current coupon: </span>{couponCode}</p>}
      </div>
    </MainBaseContainer>
  );
}
