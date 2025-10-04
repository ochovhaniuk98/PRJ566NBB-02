'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function RotatingGallery({
  images = [],
  interval = 2500, // time between slides
  transitionMs = 900, // fade duration
  className = '',
}) {
  const [idx, setIdx] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setIdx(i => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  if (!images.length) return null;

  return (
    <div
      className={`relative overflow-hidden aspect-[4/3] ${className}  rounded-xl shadow-xl`}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Gallery"
    >
      {images.map((img, i) => (
        <div
          key={img.src || i}
          className={`absolute inset-0 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          style={{
            transition: `opacity ${transitionMs}ms ease-in-out`,
            willChange: 'opacity',
          }}
          aria-hidden={i !== idx}
        >
          <Image
            src={img.src}
            alt={img.alt || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={i === 0} // avoids initial flash
          />
        </div>
      ))}

      {/* dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-brand-yellow' : 'bg-brand-yellow-lite/70'}`}
          />
        ))}
      </div>
    </div>
  );
}
