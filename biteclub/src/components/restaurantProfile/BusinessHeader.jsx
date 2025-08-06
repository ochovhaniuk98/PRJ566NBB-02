'use client';
import Image from 'next/image';
import ProfileDropdown from './ProfileDropDown';

export default function BusinessHeader() {
  return (
    <div className="fixed items-center w-full flex justify-between z-40 bg-brand-blue-lite/80 main-side-padding h-14">
      <div className="flex items-center gap-2">
        <div className="relative h-12 size-auto w-36 flex flex-row items-center justify-start">
          <Image src="/img/logo_final.png" alt="logo pic" className="object-contain rounded-br-md" fill={true} />
        </div>
        <h1 className="text-3xl text-black">Business</h1>
      </div>
      <ProfileDropdown />
    </div>
  );
}
//  <div className="relative  h-12 size-auto w-60 mt-1">
