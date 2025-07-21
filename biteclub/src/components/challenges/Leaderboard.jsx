import Image from 'next/image';
import { fakeUser } from '@/app/data/fakeData';

export default function Leaderboard() {
  const placedUsers = Array.from({ length: 5 });
  const bgColourList = ['#FFDCBE', '#FFF5D8', '#DFF2FB', '#C7E58B'];
  const defaultColour = bgColourList[bgColourList.length - 1];

  return (
    <div className="w-2/5 flex flex-col">
      <h2>Leaderboard</h2>
      <div className="flex-grow bg-brand-aqua flex flex-col gap-y-2 p-4">
        {placedUsers.map((_, i) => {
          const placeNumber = i + 1;
          const bgColour = placeNumber <= 3 ? bgColourList[placeNumber - 1] : defaultColour;

          return <LeaderboardPlaceCard key={i} placeNum={placeNumber} placedUser={fakeUser} bgColour={bgColour} />;
        })}
      </div>
    </div>
  );
}

function LeaderboardPlaceCard({ placeNum, placedUser, bgColour }) {
  return (
    <div className="h-1/5 p-2 flex justify-between items-center font-primary" style={{ backgroundColor: bgColour }}>
      <div className="flex gap-x-4">
        <div className="relative w-10 h-full bg-brand-yellow text-center">
          <h1 className="text-brand-navy">{placeNum}</h1>
        </div>
        <div>
          <h3 className="text-brand-navy m-0">{placedUser.username}</h3>
          <h5>
            <span className="font-semibold">{placedUser.numChallengesCompleted}</span> Challenges Completed
          </h5>
        </div>
      </div>
      {/* user's profile pic */}
      <div className="relative w-12 h-12 outline-1 outline-white rounded-full">
        <Image
          src={placedUser.userProfilePicture.url}
          alt={placedUser.userProfilePicture.alt}
          className="object-cover rounded-full"
          fill={true}
        />
      </div>
    </div>
  );
}
