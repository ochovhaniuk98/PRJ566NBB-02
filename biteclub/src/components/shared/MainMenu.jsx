'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { createClient } from '@/lib/auth/client';
import { useUser } from '@/context/UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHouseChimney, faGamepad, faUtensils, faGear } from '@fortawesome/free-solid-svg-icons';
import { faMicroblog } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';

export default function MainMenu() {
  const { user } = useUser();
  const pathname = usePathname();
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        // const supabase = createClient();
        // const { data } = await supabase.auth.getUser();

        // if (!data?.user?.id) {
        if (!user?.id) {
          setUserType(null);
          setLoading(false);
          return; // Exit early if no user is logged in
        }

        // const response = await fetch(`/api/get-user-type?authId=${data.user.id}`);
        const response = await fetch(`/api/get-user-type?authId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user type');
        }

        const { userType } = await response.json();
        setUserType(userType);
      } catch (error) {
        console.error('Error fetching user type:', error);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, []);

  const menuIcons = [faHouseChimney, faUser, faGamepad, faUtensils, faMicroblog, faGear];
  // !!! settings link temporary - will put it inside general user's profile later !!!
  const menuLinks = [
    '/',
    userType ? `/users/${userType}` : '/login', // if no userType = user have not we redirect user to login page.
    '/challenges',
    '/restaurants',
    '/blog-posts',
    '/users/settings',
  ];
  const menuItems = [
    { icon: faHouseChimney, label: 'Home' },
    { icon: faUser, label: 'Profile' },
    { icon: faGamepad, label: 'Challenges' },
    { icon: faUtensils, label: 'Restaurants' },
    { icon: faMicroblog, label: 'Blogs' },
    { icon: faGear, label: 'Settings' },
  ];

  // Now the menu bar will not load until the user profile is ready.
  // This prevents users from clicking it too early (i.e., before the user profile is loaded), which could cause an unintended redirect to the login page.
  if (loading) {
    return null;
  }

  return (
    <aside
      className="fixed top-0 left-0 z-50 bg-white p-2 pt-8 h-screen w-12 shadow-lg/50 shadow-brand-grey hover:w-fit"
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
    >
      <nav className="space-y-6 flex flex-col items-center text-brand-navy">
        {menuLinks.map((link, idx) => {
          const isSelected = pathname === link;
          return (
            <div key={idx} className={`group flex flex-col items-center gap-y-1 cursor-pointer`}>
              <div
                className={`${
                  isSelected ? 'bg-brand-yellow' : 'bg-brand-green-extralite'
                } rounded-full aspect-square w-8 h-8 flex items-center justify-center outline outline-brand-navy transition-transform duration-200 group-hover:scale-115`}
                key={idx}
              >
                <Link
                  key={idx}
                  href={link}
                  className={`block p-1 ${isSelected ? 'text-brand-navy' : 'text-brand-navy'} hover:text-brand-navy`}
                >
                  <FontAwesomeIcon icon={menuItems[idx].icon} className="icon-lg" />
                </Link>
              </div>
              {/* show label text only on hover */}
              {isHovered ? <h6>{menuItems[idx].label}</h6> : <h6 className={`opacity-0`}>X</h6>}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
