'use client';
import { useUser } from '@/context/UserContext';
import MainMenu from '../../components/shared/MainMenu';
import SearchBar from '../../components/shared/SearchBar';
import BusinessHeader from '../../components/restaurantProfile/BusinessHeader';
import { usePathname } from 'next/navigation';

export default function LayoutContent({ children }) {
  const { user } = useUser();
  const path = usePathname();
  const onQuestionnairePage = path.toLowerCase() == '/questionnaire';
  console.log('Path: ', path);
  const userType = user?.user_metadata?.user_type || null;

  return !onQuestionnairePage ? (
    <>
      {' '}
      <MainMenu />
      <div className="flex-1 relative">
        {userType === 'business' ? <BusinessHeader /> : <SearchBar />}
        <main className="main-side-padding md:ml-12">{children}</main>
      </div>
    </>
  ) : (
    children
  );
}
