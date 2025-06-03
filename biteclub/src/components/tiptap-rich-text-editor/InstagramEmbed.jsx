// Reusing the code instagramEmbed implemented by Irish
'use client';
import { useEffect, useRef, useState } from 'react';

export default function InstagramEmbed({ postUrl, onHeightChange }) {
  const wrapperRef = useRef();
  const [measuredHeight, setMeasuredHeight] = useState(null); //  dynamic height

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process();

        // Wait for embed to fully render
        setTimeout(() => {
          if (wrapperRef.current) {
            const fullHeight = wrapperRef.current.offsetHeight;
            console.log('✅ Actual Instagram height:', fullHeight);
            setMeasuredHeight(fullHeight); //  Store height locally
            if (onHeightChange) onHeightChange(fullHeight); //  Send to parent
          }
        }, 1500);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [postUrl, onHeightChange]);

  return (
    <div
      ref={wrapperRef}
      className=" border rounded-md border-brand-yellow-lite"
      style={{
        height: '630px',
        gridRow: 'span 2',
        overflow: 'visible',
      }}
    >
      <blockquote
        className="instagram-media iframe"
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
