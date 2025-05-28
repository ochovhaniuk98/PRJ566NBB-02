'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/auth/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHouseChimney, faGamepad, faUtensils, faGear } from '@fortawesome/free-solid-svg-icons';
import { faMicroblog } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';

export default function MainMenu() {
  const pathname = usePathname();
  const [userType, setUserType] = useState(null);

useEffect(() => {
  const fetchUserType = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (data?.user?.id) {
        const response = await fetch('/api/get-user-type', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ supabaseId: data.user.id }),
        });

        const { userType } = await response.json();
        setUserType(userType);
      } else {
        // Optional: explicitly set userType to null
        setUserType(null);
      }
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  fetchUserType();
}, []);

  const menuIcons = [faHouseChimney, faUser, faGamepad, faUtensils, faMicroblog, faGear];
  // !!! settings link temporary - will put it inside general user's profile later !!!
  const menuLinks = [
    '/',
    userType ? `/users/${userType}` : '/login', // if no userType = user have not we redirect user to login page.
    '#',
    '/restaurants',
    '#',
    '/users/settings',
  ];

  return (
    <aside className="fixed top-0 left-0 z-50 bg-white p-2 pt-8 h-screen w-12 shadow-lg/50 shadow-brand-grey">
      <nav className="space-y-16 flex flex-col items-center">
        {menuLinks.map((link, idx) => {
          const isSelected = pathname === link;
          return (
            <div
              className={`${
                isSelected ? 'bg-brand-yellow' : 'bg-brand-green-extralite'
              } rounded-full aspect-square flex items-center justify-center outline outline-brand-navy hover:bg-brand-green-lite`}
              key={idx}
            >
              <Link
                key={idx}
                href={link}
                className={`block p-1 ${isSelected ? 'text-brand-navy' : 'text-brand-navy'} hover:text-brand-navy`}
              >
                <FontAwesomeIcon icon={menuIcons[idx]} className="icon-lg" />
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
