'use client';
import { motion } from 'framer-motion';

const sparkleAnim = {
  scale: [0, 0.4, 1, 1.15, 0],
  rotate: [0, 60, 180, 300, 360],
  opacity: [0, 1, 1, 0.6, 0],
};

function Sparkle({ className = '', delay = 0, size, src = '/img/sparkle.svg' }) {
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute will-change-transform ${className}`}
      style={size ? { width: size, height: size, transformOrigin: 'center' } : { transformOrigin: 'center' }}
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{ scale: [0, 0.4, 1, 1.15, 0], rotate: [0, 60, 180, 300, 360], opacity: [0, 1, 1, 0.6, 0] }}
      transition={{ duration: 1.3, ease: 'easeIn', delay, repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
    />
  );
}

export default function Sparkles({ breakpt }) {
  return (
    <div className="absolute inline-block xl:size-[34%] xl:top-[24.5vw] xl:left-[13vw] lg:size-[30%] lg:top-[22vw] lg:left-[13vw] md:size-[30%] md:top-[27vw] md:left-[16vw] sm:size-[30%] sm:top-[31.5vw] sm:left-[18.75vw] size-[6rem] top-[9.5rem] left-[5.75rem]">
      {/* Three sparkles in-sync (same delay) */}
      <Sparkle
        className="xl:-top-8 xl:right-1 lg:-top-2 lg:-right-5 md:-top-4 md:right-0 sm:top-0 sm:-right-1 -top-1 right-0 size-9 sm:size-13 md:size-16 lg:size-20 xl:size-30"
        delay={0}
      />
      <Sparkle
        className="xl:top-6 xl:left-1 lg:top-7 lg:-left-1 md:top-7 md:-left-2 sm:top-9 sm:-left-1 top-8 -left-2 size-6 sm:size-6 md:size-10 lg:size-8 xl:size-18"
        delay={0.2}
      />
      <Sparkle
        className="xl:bottom-9 xl:right-6 lg:bottom-0 lg:right-2 md:bottom-2 md:right-4 sm:bottom-1 sm:right-3 bottom-1 right-1 size-7 sm:size-10 md:size-8 lg:size-12 xl:size-22"
        delay={0.5}
      />
    </div>
  );
}

// xl:bg-amber-500/10 lg:bg-pink-400/10 md:bg-pink-600/10 sm:bg-green-300/30 bg-orange-300/10
