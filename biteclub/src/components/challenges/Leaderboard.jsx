import { useState, useEffect } from 'react';
import Image from 'next/image';
import { fakeUser } from '@/app/data/fakeData';

export default function Leaderboard() {
  const placedUsers = Array.from({ length: 5 });
  const bgColourList = ['#FFDCBE', '#FFF5D8', '#DFF2FB', '#C7E58B'];
  const defaultColour = bgColourList[bgColourList.length - 1];

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch('/api/challenges/leader-board');
      const data = await res.json();
      setUsers(data);
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60 * 60 * 1000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-2/5 flex flex-col">
      <h2>Leaderboard</h2>
      {/* <div className="flex-grow bg-brand-aqua flex flex-col gap-y-2 p-4"> */}
      <div className="flex-grow bg-brand-aqua flex flex-col gap-y-2 p-4 overflow-y-auto max-h-[80vh]">
        {users.map((u, i, arr) => {
          if (i === 0) {
            u.rank = 1; // first always 1
          } else {
            if (u.numChallengesCompleted === arr[i - 1].numChallengesCompleted) {
              u.rank = arr[i - 1].rank; // same score = same rank
            } else {
              u.rank = arr[i - 1].rank + 1; // next unique score = previous rank + 1
            }
          }

          return (
            <LeaderboardPlaceCard
              key={u._id}
              placeNum={u.rank}
              placedUser={u.user}
              numChallengesCompleted={u.numChallengesCompleted}
            />
          );
        })}
      </div>
    </div>
  );
}

function LeaderboardPlaceCard({ placeNum, placedUser, numChallengesCompleted, bgColour }) {
  return (
    <div className="h-1/5 p-2 flex justify-between items-center font-primary" style={{ backgroundColor: bgColour }}>
      <div className="flex gap-x-4">
        <div className="relative w-10 h-full bg-brand-yellow text-center">
          <h1 className="text-brand-navy">{placeNum}</h1>
        </div>
        <div>
          <h3 className="text-brand-navy m-0">{placedUser.username}</h3>
          <h5>
            <span className="font-semibold">{numChallengesCompleted}</span> Challenges Completed
          </h5>
        </div>
      </div>
      {/* user's profile pic */}
      <div className="relative w-12 h-12 outline-1 outline-white rounded-full">
        <Image src={placedUser.userProfilePicture.url} alt="" className="object-cover rounded-full" fill={true} />
      </div>
    </div>
  );
}
