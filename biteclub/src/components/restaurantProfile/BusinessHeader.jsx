'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function BusinessHeader() {
  return (
    <div className="fixed items-center w-full flex justify-between z-40 bg-white/80 pr-8 py-3">
      <div className="relative h-8 size-auto w-60 flex flex-row items-center">
        <Image src="/img/logo.jpg" alt="logo pic" className="object-contain rounded-br-md" fill={true} />
        <h1 className='text-3xl text-brand-navy ml-56'>Business</h1>
      </div>
      <div
        className={`bg-brand-green-extralite rounded-full aspect-square w-8 h-8 flex items-center justify-center outline outline-brand-navy transition-transform duration-200 group-hover:scale-115 hover:bg-brand-yellow `}
      >
        <Link href={'/users/business'} className={`block p-1 text-brand-navy hover:text-brand-navy`}>
          <FontAwesomeIcon icon={faUser} className="icon-lg" />
        </Link>
      </div>
    </div>
  );
}
