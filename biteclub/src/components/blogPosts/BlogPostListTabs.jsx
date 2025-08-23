// ('use client');

export default function BlogPostListTabs({ selectedTab, setSelectedTab }) {
  const tabs = ['EXPLORE', 'FOLLOWING'];

  const handleTabClick = tab => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex gap-x-2 justify-end">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`px-2 py-1 mr-4 text-sm border-b-3 transition-colors duration-200 cursor-pointer ${
            selectedTab === tab
              ? 'border-brand-green-lite text-black font-semibold'
              : 'border-white text-brand-navy hover:border-brand-blue-lite font-medium'
          }`}
        >
          <h4>{tab}</h4>
        </button>
      ))}
    </div>
  );
}
