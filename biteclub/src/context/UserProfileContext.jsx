// context/UserProfileContext.js
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext'; // your existing Supabase context

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const { user } = useUser();
  // base on userType
  // const userType = ...
  
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setUserProfile(null);
        setLoadingProfile(false);
        return;
      }

      try {
        const res = await fetch(`/api/generals/get-profile-by-authId?authId=${user.id}`);
        const { profile } = await res.json();
        setUserProfile(profile);
      } catch (err) {
        console.error('Failed to fetch Mongo user profile:', err);
        setUserProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  return (
    <UserProfileContext.Provider value={{ userProfile, loadingProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
