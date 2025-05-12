"use client";
import { useState } from "react";

export default function ProfileTabBar({ onTabChange, tabs }) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="flex justify-center pt-4 pb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`px-2 py-1 mr-4 text-sm border-b-3 transition-colors duration-200 cursor-pointer ${
            selectedTab === tab
              ? "border-brand-aqua text-black font-semibold"
              : "border-white text-brand-navy hover:border-brand-blue-lite font-medium"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
