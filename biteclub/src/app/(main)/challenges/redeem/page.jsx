'use client';

import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/Button';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
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

export default Redeem => {
  const [points, setPoints] = useState(null);
  const { user } = useUser(); // Current logged-in user's Supabase info
  const { userData, loadingData, refreshUserData } = useUserData();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!user?.id) return;

  //     const res = await fetch(`/api/generals/get-profile-by-authId?authId=${user.id}`);
  //     const { profile } = await res.json();

  //     console.log('Points: ', profile.numOfPoints);
  //     setPoints(profile.numOfPoints);
  //   };

  //   fetchData();
  // }, [user?.id]);

  useEffect(() => {
    if (!userData?.numOfPoints) return;
    setPoints(userData.numOfPoints);
  }, [userData?.numOfPoints]);


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

  return (
    <MainBaseContainer>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center m-16">
        <div className="flex flex-row justify-between w-full mb-8">
          <h1>Redeem</h1>
          <span>Total points: {points}</span>
        </div>
        <div className="flex flex-col justify-between w-full h-[300px]">
          {redemption_options.map(redemption_option => {
            return (
              <div className="flex flex-row w-full justify-between text-[50px]" key={redemption_option.value}>
                <div className="self-start font-bold text-[50px]">${redemption_option.value}</div>
                <Button
                  type="button"
                  className="w-30"
                  variant="default"
                  onClick={() => {
                    redeemOption(redemption_option);
                  }}
                >
                  {redemption_option.points_needed}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </MainBaseContainer>
  );
};
