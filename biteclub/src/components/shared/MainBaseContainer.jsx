'use client';
import { useUser } from '@/context/UserContext';

export default function MainBaseContainer({ children }) {
  const { user } = useUser(); // Current logged-in user's Supabase info
  const userType = user?.user_metadata?.user_type || null;

  return (
    <>
      {userType === 'business' ? (
        <div className="absolute top-14 left-0 right-0">
          <div className="flex flex-col items-center">{children}</div>
        </div>
      ) : (
        <div className="absolute top-0 md:left-12 right-0 px-0 w-full">
          <div className="flex flex-col items-center">{children}</div>
        </div>
      )}
    </>
  );
}
