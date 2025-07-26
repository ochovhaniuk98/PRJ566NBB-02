'use client';

import { UserProvider } from '@/context/UserContext';
import { UserDataProvider } from '@/context/UserDataContext';

export function Providers({ children }) {
  return (
    <UserProvider>
      <UserDataProvider>{children}</UserDataProvider>
    </UserProvider>
  );
}
