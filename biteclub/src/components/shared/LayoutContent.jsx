'use client';
import { useUser } from '@/context/UserContext';
import MainMenu from '../../components/shared/MainMenu';
import SearchBar from '../../components/shared/SearchBar';
import BusinessHeader from '../../components/restaurantProfile/BusinessHeader';

export default function LayoutContent({ children }) {
  const { user } = useUser();
  const userType = user?.user_metadata?.user_type || null;

  return (
    <>
      <MainMenu />
      <div className="flex-1 relative">
        {userType === 'business' ? <BusinessHeader /> : <SearchBar />}
        <main className="main-side-padding ml-12">{children}</main>
      </div>
    </>
  );
}
