'use client';
import { useEffect, useState } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUserData } from '@/context/UserDataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // read logged-in state (Mongo user)
  const { userData } = useUserData();
  const isLoggedIn = !!userData?._id;

  // clears search input field when navigating to new page,
  // but query string remains when on /search page
  useEffect(() => {
    if (pathname === '/search') {
      setSearchInput(params.get('search') ?? '');
    } else {
      setSearchInput('');
    }
  }, [pathname, params]);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      if (pathname !== '/restaurants') {
        router.push(`/search?search=${encodeURIComponent(searchInput)}`);
        //setSearchInput('');
      }
    }
  };

  return (
    <div className="fixed w-full flex items-center justify-between z-40 bg-white/30 main-side-padding md:space-x-0 space-x-2">
      <div className="relative  h-12 size-auto md:w-60 w-50 mt-1 cursor-pointer" onClick={() => router.push('/')}>
        <Image
          src="/img/logo_final.png"
          alt="logo pic"
          quality={100}
          unoptimized={true}
          className="object-contain rounded-br-md"
          fill={true}
        />
      </div>

      <div className="flex gap-2 w-188 max-w-full">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-brand-grey">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            type="text"
            id="search-bar-input"
            placeholder={
              pathname !== '/restaurants' ? 'Search restaurants, blog posts, or users' : 'Search restaurants'
            }
            className="w-full pl-8 font-primary"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value.toLowerCase())}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Show Login if NOT logged in (and avoid showing it while loading) */}
        {!isLoggedIn && pathname !== '/login' && (
          <Link
            href="/login"
            className="px-2 py-2 text-brand-navy font-primary border-1 border-brand-navy m-2 mr-0 text-sm rounded-sm sm:inline-flex gap-2 items-center justify-center w-30 h-full font-semibold hidden cursor-pointer bg-white/20"
          >
            <FontAwesomeIcon icon={faArrowRightToBracket} className={`text-md text-brand-navy`} />
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
