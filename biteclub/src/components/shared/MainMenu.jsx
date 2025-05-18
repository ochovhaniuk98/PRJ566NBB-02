'use client';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHouseChimney, faGamepad, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faMicroblog } from '@fortawesome/free-brands-svg-icons';

export default function MainMenu() {
  const pathname = usePathname();
  const menuIcons = [faHouseChimney, faUser, faGamepad, faUtensils, faMicroblog];
  const menuLinks = ['/', '/users', '#', '/restaurants', '#'];

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
            >
              <a
                key={idx}
                href={link}
                className={`block p-1 ${isSelected ? 'text-brand-navy' : 'text-brand-navy'} hover:text-brand-navy`}
              >
                <FontAwesomeIcon icon={menuIcons[idx]} className="icon-lg" />
              </a>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
