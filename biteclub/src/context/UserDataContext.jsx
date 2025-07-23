// context/UserDataContext.js
'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser } from './UserContext';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { user } = useUser();
  const userType = user?.user_metadata?.user_type;

  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      if (!user?.id || !userType) {
        setLoadingData(false);
        return;
      }

      const endpoint =
        userType === 'general'
          ? `/api/generals/get-profile-by-authId?authId=${user.id}`
          : userType === 'business'
          ? `/api/business-user/get-profile-by-authId?authId=${user.id}`
          : null;

      if (!endpoint) {
        console.warn('Unknown user type:', userType);
        setLoadingData(false);
        return;
      }

      const res = await fetch(endpoint);
      if (!res.ok) {
        console.error('Failed to fetch user data:', res.status);
        setLoadingData(false);
        return;
      }

      const { userData } = await res.json();
      setUserData(userData);
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoadingData(false);
    }
  }, [user?.id, userType]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserDataContext.Provider value={{ userData, loadingData, refreshUserData: fetchUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);


// Usage
// import { useUserData } from '@/context/UserDataContext'
// const { userData, loadingData, refreshUserData } = useUserData();
