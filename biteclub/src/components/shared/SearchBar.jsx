'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      router.push(`/search?search=${encodeURIComponent(searchInput)}`);
      setSearchInput('');
    }
  };

  return (
    <div className="fixed w-full flex justify-between z-40 bg-white/50 main-side-padding ">
      <div className="relative  h-8 size-auto w-60 mt-3">
        <Image src="/img/logo.jpg" alt="logo pic" className="object-contain rounded-br-md" fill={true} />
      </div>
      <div className="relative w-128 max-w-full">
        <span className="absolute inset-y-0 left-3 flex items-center text-brand-grey">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <input
          type="text"
          placeholder="Search for restaurants, blog posts, or users"
          className="w-full pl-8 font-primary rounded-full"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
