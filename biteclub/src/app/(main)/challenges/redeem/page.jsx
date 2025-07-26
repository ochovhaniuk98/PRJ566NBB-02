'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import { Button } from '@/components/shared/Button';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import Spinner from '@/components/shared/Spinner';

const redemption_options = [
  {
    points_needed: 50,
    value: 5.0,
  },
  {
    points_needed: 100,
    value: 10.0,
  },
  {
    points_needed: 200,
    value: 20.0,
  },
];

function randomString() {
  return [...Array(5)].map(value => (Math.random() * 1000000).toString(36).replace('.', '')).join('');
}

export default function Redeem() {
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info
  const { userData, loadingData } = useUserData(); // Current logged-in user's MongoDB data (User / BusinessUser Object)
  const [points, setPoints] = useState(0); // not null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // [!] do not set "!userData?.numOfPoints" or it will run forever if the user does not have points yet
    if (loadingData || !userData) return;
    if (userData?.numOfPoints != undefined) {
      setPoints(userData.numOfPoints);
    }
    setLoading(false);
  }, [loadingData, userData]);

  async function redeemOption(option) {
    if (option.points_needed > points) {
      alert('Insufficient points!');
      return;
    }

    const res = await fetch('/api/points', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supabaseId: user.id,
        numOfPoints: points - option.points_needed,
      }),
    });

    if (res.ok) {
      alert('Points successfully redeemed!\n' + 'Your coupon code is ' + randomString());
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
      </div>
    </MainBaseContainer>
  );
}
