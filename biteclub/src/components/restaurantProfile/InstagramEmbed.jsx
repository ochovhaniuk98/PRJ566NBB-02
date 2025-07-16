import { useEffect, useRef, useState } from 'react';
import EditModePanel from '../shared/EditModePanel';

// instagram embed component
export default function InstagramEmbed({
  url,
  isEditModeOn = false,
  forEditRestaurant = false,
  isSelected = false,
  onSelect = () => {},
  onDeleteClick = () => {},
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const scriptId = 'instagram-embed-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => window.instgrm?.Embeds?.process();
    } else {
      window.instgrm?.Embeds?.process?.();
    }
  }, [isVisible]);

  return (
    <div ref={ref} className="w-full border rounded-md border-brand-yellow-lite min-h-[420px] relative">
      {isVisible ? (
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          {...(!forEditRestaurant ? { 'data-instgrm-captioned': true } : {})}
          style={{ width: '100%' }}
        ></blockquote>
      ) : (
        <div className="w-full h-[420px] bg-gray-100 animate-pulse rounded-md" />
      )}
      {/* show edit/delete panel if user wants to manage profile */}
      {isEditModeOn && (
        <EditModePanel forInstagram={true} isSelected={isSelected} onSelect={onSelect} onDeleteClick={onDeleteClick} />
      )}
    </div>
  );
}
