'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      if (pathname !== '/restaurants') {
        router.push(`/search?search=${encodeURIComponent(searchInput)}`);
        //setSearchInput('');
      }
    }
  };

  return (
    <div className="fixed w-full flex justify-between z-40 bg-white/30 main-side-padding md:space-x-0 space-x-2">
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
      <div className="relative w-148 max-w-full">
        <span className="absolute inset-y-0 left-3 flex items-center text-brand-grey">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <input
          type="text"
          id="search-bar-input"
          placeholder="Search restaurants, blog posts, or users"
          className="w-full pl-8 font-primary rounded-full"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value.toLowerCase())}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
