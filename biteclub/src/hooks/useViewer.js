'use client';
import { useUser } from '@/context/UserContext'; // Supabase auth user
import { useUserData } from '@/context/UserDataContext'; // Mongo profile

// Identifies user authentication state (are they logged in or not?);
// Merges Supabase auth (instant) with Mongo profile (viewerId, which can lag).
export function useViewer() {
  const { user, loading: authLoading } = useUser(); // Supabase
  const { userData, loadingData } = useUserData(); // Mongo

  const isAuthenticated = !!user; // instant, no lag (used for gating UI)
  const supabaseId = user?.id ?? null;
  const viewerId = userData?._id ?? null;
  // checks if Supabase auth is loading OR  user is authenticated but their Mongo profile is still loading
  const loading = authLoading || (isAuthenticated && loadingData);

  return { isAuthenticated, supabaseId, viewerId, loading, user, userData };
}
