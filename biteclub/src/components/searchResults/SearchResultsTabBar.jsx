import { Button } from '../shared/Button';

export default function SearchResultsTabBar({ selectedTab, setSelectedTab }) {
  const tabs = ['Restaurants', 'Blog Posts', 'Users'];

  const handleTabClick = idx => {
    setSelectedTab(idx);
  };
  return (
    <div className="flex gap-x-2">
      {tabs.map((tab, idx) => (
        <Button
          key={idx}
          onClick={() => handleTabClick(idx)}
          type="submit"
          className="w-30"
          variant={selectedTab == idx ? 'roundTabActive' : 'roundTab'}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}
