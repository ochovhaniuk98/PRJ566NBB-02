'use client';
import { useState } from 'react';

// Description: Horizontal tab menu that appears on both the GENERAL and RESTAURANT users' profiles.
export default function ProfileTabBar({ onTabChange, tabs }) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const handleTabClick = tab => {
    setSelectedTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="flex gap-x-4 md:justify-center justify-start pb-6 md:w-full w-full overflow-x-scroll scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`px-2 py-1 text-sm border-b-3 transition-colors duration-200 cursor-pointer ${
            selectedTab === tab
              ? 'border-brand-aqua text-black font-semibold'
              : 'border-white text-brand-navy hover:border-brand-blue-lite font-medium'
          }`}
        >
          <h4 className="whitespace-nowrap">{tab}</h4>
        </button>
      ))}
    </div>
  );
}
