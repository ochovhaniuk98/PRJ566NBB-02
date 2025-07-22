'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    // On initial load, check if the user is already authenticated (e.g., from a session).
    supabase.auth.getUser().then(({ data, err }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });

    // Listen for auth state changes (e.g., login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup function when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // Provide the current user to all child components
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

// Custom hook to use the context in other components (e.g., useUser())
export const useUser = () => useContext(UserContext);

/*
    example usage of useUser:
    -------------------------
    'use client'
    import { useUser } from '@/context/UserContext'

    export default function Dashboard() {
    const { user } = useUser()

    return <div>Welcome, {user?.email}</div>
    }

*/

/*
  const supabase = createClient();

  Always use supabase.auth.getUser() to protect pages and user data.
  Never trust supabase.auth.getSession() inside Server Components. It isn't guaranteed to revalidate the Auth token.
  It's safe to trust getUser() because it sends a request to the Supabase Auth server every time to revalidate the Auth token.
  const { data, error: authError } = await supabase.auth.getUser();

  if (authError || !data.user) {
    throw new Error('User not authenticated');
  }

  const user = data.user;
*/
