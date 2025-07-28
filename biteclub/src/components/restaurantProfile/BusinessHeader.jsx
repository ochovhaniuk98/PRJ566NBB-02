'use client';
import Image from 'next/image';
import ProfileDropdown from './ProfileDropDown';

export default function BusinessHeader() {
  return (
    <div className="fixed items-center w-full flex justify-between z-40 bg-white/80 pr-8 py-3">
      <div className="relative h-8 size-auto w-60 flex flex-row items-center">
        <Image src="/img/logo.jpg" alt="logo pic" className="object-contain rounded-br-md" fill={true} />
        <h1 className='text-3xl text-brand-navy ml-56'>Business</h1>
      </div>
        <ProfileDropdown/>
    </div>
  );
}
