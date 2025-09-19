'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHouseChimney, faGamepad, faUtensils, faGear } from '@fortawesome/free-solid-svg-icons';
import { faMicroblog } from '@fortawesome/free-brands-svg-icons';
import { useUser } from '@/context/UserContext';

export default function MainMenu() {
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info
  const userType = user?.user_metadata?.user_type || null;

  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Wait for user to be resolved (either an object or null)
    // Avoid staying in "loading" forever
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

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

  // return an EMPTY Menu Bar until the USER profile is READY.
  // This prevents users from clicking it too early (i.e., before the user profile is loaded), which could cause an unintended redirect to the login page.
  if (loading && userType !== 'business') {
    return (
      <aside className="fixed top-0 left-0 z-50 bg-white p-2 pt-8 h-screen w-12 shadow-lg/50 shadow-brand-grey hover:w-fit"></aside>
    );
  }

  return (
    <>
      {userType !== 'business' && (
        <aside
          className="group fixed md:top-0 bottom-0 left-0 z-50 bg-brand-green-lite md:p-2 md:pt-8 p-4 px-2 md:h-screen md:w-12 w-full md:shadow-lg shadow-brand-grey/50 shadow-[0_-4px_6px_-1px]  md:hover:w-24"
          onMouseLeave={() => setIsHovered(false)}
          onMouseEnter={() => {
            setIsHovered(true);
          }}
        >
          <nav className=" md:space-y-6 flex md:flex-col flex-row items-center justify-between text-brand-navy font-primary">
            {menuLinks.map((link, idx) => {
              const isSelected = pathname === link;
              return (
                <div key={idx} className={`group flex flex-col items-center gap-y-1 cursor-pointer  md:w-fit w-12`}>
                  <div
                    className={`${
                      isSelected ? 'bg-brand-yellow' : 'bg-brand-green-lite'
                    } rounded-full aspect-square w-8 h-8 flex items-center justify-center outline outline-brand-navy transition-transform duration-200 group-hover:scale-115`}
                    key={idx}
                  >
                    <Link
                      key={idx}
                      href={link}
                      className={`block p-1 ${
                        isSelected ? 'text-brand-navy' : 'text-brand-navy'
                      } hover:text-brand-navy`}
                    >
                      <FontAwesomeIcon icon={menuItems[idx].icon} className="icon-lg" />
                    </Link>
                  </div>
                  {/* show label text only on hover */}
                  <h6
                    className="
              text-xs
              md:opacity-0 md:group-hover:opacity-100
              transition-opacity duration-150
            "
                  >
                    {menuItems[idx].label}
                  </h6>
                </div>
              );
            })}
          </nav>
        </aside>
      )}
    </>
  );
}
