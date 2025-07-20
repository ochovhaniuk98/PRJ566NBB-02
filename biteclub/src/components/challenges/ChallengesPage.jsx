'use client'; // for circular progressbar
import MainBaseContainer from '../shared/MainBaseContainer';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faTrophy,
  faClock,
  faGamepad,
  faDrumstickBite,
  faHamburger,
  faTrashAlt,
  faCircleXmark,
  faPlugCircleXmark,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { fakeUser, fakeChallenge1 } from '@/app/data/fakeData';
import { useState } from 'react';

export default function ChallengesPage() {
  const [showChallengeDetailCard, setShowChallengeDetailCard] = useState(false);

  return (
    <MainBaseContainer>
      <div className="main-side-padding w-full flex flex-col items-center m-16">
        {/* PLACEHOLDER for main progress bar and general user header */}
        <div className="w-full bg-gray-100 p-3 text-center">
          <h3 className="uppercase">Placeholder for main progress bar and general user header</h3>
          <a href="/challenges/redeem">Redeem</a>
        </div>
        {/* Active Challenges and Leaderboard container */}
        <div className="flex w-full min-h-96 my-4 gap-x-4">
          <div className="w-3/5">
            <h2>My Active Challenges</h2>
            <div className="flex gap-x-4">
              <ActiveChallengeCard onOpen={setShowChallengeDetailCard} />
              <ActiveChallengeCard />
              <ActiveChallengeCard />
            </div>
          </div>
          <Leaderboard />
        </div>
        {/* PLACEHOLDER for AI-generated challenges */}
        <div className="w-full bg-gray-100 p-3 text-center">
          <h3 className="uppercase">Placeholder for AI-generated challenges</h3>
        </div>
        {showChallengeDetailCard && <ActiveChallengeDetailCard onClose={setShowChallengeDetailCard} />}
      </div>
    </MainBaseContainer>
  );
}

function ActiveChallengeCard({ onOpen }) {
  return (
    <div
      className="w-1/3 relative flex flex-col items-center gap-y-2 bg-brand-yellow-lite p-4 font-primary cursor-pointer shadow-lg text-center"
      onClick={() => onOpen(true)}
    >
      <MyCircularBar />
      <h3>Around the World in 80 Days</h3>
      <div className="min-h-20">
        <p>See the world in Toronto! Try a cuisine from 5 different continents.</p>
      </div>
      <div className="w-full mb-2">
        <div className="flex justify-between">
          <h4>
            <FontAwesomeIcon icon={faTrophy} className={` icon-md text-brand-yellow mr-1`} />
            REWARD:
          </h4>
          <p>
            <span className="font-semibold">400</span> pts
          </p>
        </div>
        <div className="flex justify-between">
          <h4>
            <FontAwesomeIcon icon={faClock} className={` icon-md text-brand-yellow mr-1`} />
            TIME LEFT:
          </h4>
          <p>
            <span className="font-semibold">30</span> days
          </p>
        </div>
      </div>
      <div className="w-full text-right">
        <FontAwesomeIcon icon={faChevronRight} className={` icon-xl text-brand-navy`} />
      </div>
    </div>
  );
}

function MyCircularBar() {
  const current = 3;
  const total = 5;
  const percentage = (current / total) * 100;

  return (
    <div className="relative w-[150px] h-[150px] mb-0">
      <CircularProgressbar
        value={percentage}
        text={`${current}/${total}`} // text hidden with transparent color
        styles={buildStyles({
          pathColor: '#80c001',
          trailColor: '#ffdcbe',
          textColor: 'transparent', // hide default
          strokeWidth: 24,
        })}
        strokeWidth={24}
      />

      {/* Inner circle with border stroke */}
      <div className="absolute top-1/2 left-1/2 w-[85px] h-[85px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-peach border-2 border-brand-navy text-brand-navy flex items-center justify-center font-secondary text-4xl">
        {current}/{total}
      </div>
    </div>
  );
}

function Leaderboard() {
  const placedUsers = Array.from({ length: 5 }); // creates an array of 5 undefined elements
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
      {/* User's profile pic */}
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

function ActiveChallengeDetailCard({ onClose }) {
  return (
    <div className="fixed inset-0  bg-brand-peach/40 flex justify-center items-center  z-[100]  overflow-scroll scrollbar-hide">
      <div className="bg-transparent p-8">
        <div className="w-5xl min-h-104 bg-white shadow-lg rounded-lg pb-3 relative">
          <div className="bg-brand-green-lite flex items-center font-primary font-semibold text-md capitalize py-3 px-3 rounded-t-lg w-full justify-between">
            <div>
              <FontAwesomeIcon icon={faGamepad} className={`text-2xl text-white mr-2`} />
              Update Challenge
            </div>
            <FontAwesomeIcon
              icon={faXmark}
              className={` icon-xl text-brand-navy cursor-pointer`}
              onClick={() => onClose(false)}
            />
          </div>
          <div className="p-6 flex gap-x-8 w-full">
            <div className="w-2/5 flex flex-col gap-y-4">
              <h1>Around the World in 80 Days</h1>
              <p>See the world in Toronto! Try a cuisine from 5 different continents. </p>
              <div className="bg-brand-yellow-lite rounded-lg p-3 space-y-2">
                <ul>
                  {/* Challenge Stat: PROGRESS */}
                  <li className="flex justify-between">
                    <div className="flex">
                      <div className="bg-white rounded-full w-7 h-7 text-center flex flex-col items-center justify-center mr-1">
                        <FontAwesomeIcon icon={faGamepad} className={` icon-lg text-brand-green`} />
                      </div>
                      <h2>Progress</h2>
                    </div>
                    <h2 className="font-bold">3/5 completed</h2>
                  </li>
                </ul>
                <ul>
                  {/* Challenge Stat: TIME LEFT */}
                  <li className="flex justify-between">
                    <div className="flex">
                      <div className="bg-white rounded-full w-7 h-7 text-center flex flex-col items-center justify-center mr-1">
                        <FontAwesomeIcon icon={faClock} className={` icon-lg text-brand-blue`} />
                      </div>
                      <h2>Time Left</h2>
                    </div>
                    <h2 className="font-bold">30 days</h2>
                  </li>
                </ul>
                <ul>
                  {/* Challenge Stat: REWARD */}
                  <li className="flex justify-between">
                    <div className="flex">
                      <div className="bg-white rounded-full w-7 h-7 text-center flex flex-col items-center justify-center mr-1">
                        <FontAwesomeIcon icon={faTrophy} className={` icon-lg text-brand-yellow`} />
                      </div>
                      <h2>Reward</h2>
                    </div>
                    <h2 className="font-bold">300 points</h2>
                  </li>
                </ul>
              </div>
            </div>
            <ChallengeStepsContainer />
          </div>
          <button className="absolute left-3 bottom-3 cursor-pointer font-primary font-medium rounded-lg text-sm text-brand-red border border-brand-red py-1 px-3">
            <FontAwesomeIcon icon={faTrashAlt} className={` icon-md text-brand-red mr-1`} />
            Drop Challenge
          </button>
        </div>
      </div>
    </div>
  );
}

function ChallengeStepsContainer() {
  const restaurantsList = ['Resto Name 1', 'Resto Name 2', 'Resto Name 3', 'Resto Name 4', 'Resto Name 5'];
  return (
    <div className="w-3/5 flex flex-wrap gap-4 gap-x-10 items-center justify-center font-primary pt-4">
      {restaurantsList.map((restaurant, i) => (
        <div key={i} className="min-h-44 w-28 flex flex-col items-center cursor-pointer">
          <div className="rounded-full w-full aspect-square bg-white border border-brand-grey shadow-md flex flex-col items-center justify-center p-2 text-center relative">
            <FontAwesomeIcon icon={faHamburger} className={`absolute text-7xl text-brand-yellow/20`} />
            <h5 className="z-10 font-semibold">{restaurant}</h5>
          </div>

          <div className="bg-brand-blue-lite p-1 px-3 mt-2 rounded-full uppercase text-brand-navy text-sm font-semibold shadow-md">
            Check-in
          </div>
        </div>
      ))}
    </div>
  );
}
