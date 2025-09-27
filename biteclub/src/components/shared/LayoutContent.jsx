'use client';
import { useUser } from '@/context/UserContext';
import MainMenu from '../../components/shared/MainMenu';
import SearchBar from '../../components/shared/SearchBar';
import BusinessHeader from '../../components/restaurantProfile/BusinessHeader';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

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
        {userType === 'business' ? (
          <BusinessHeader />
        ) : (
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        )}
        <main className={`${path === '/' ? '' : 'main-side-padding  w-full'}`}>{children}</main>
      </div>
    </>
  ) : (
    children
  );
}
