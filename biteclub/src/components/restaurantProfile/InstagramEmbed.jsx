import { useEffect, useRef, useState } from 'react';
import EditModePanel from '../shared/EditModePanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faFlag } from '@fortawesome/free-solid-svg-icons';
import { ReportContentLink } from '../shared/ReportContentLink';

// instagram embed component
export default function InstagramEmbed({ url, isEditModeOn = false, forEditRestaurant = false }) {
  const [showReportFormLink, setShowReportFormLink] = useState(false);
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
      {/* Report Content flag */}
      <div className="min-w-30 absolute top-2 right-2 flex items-center bg-white font-primary font-semibold text-brand-navy p-2 cursor-pointer text-sm">
        <FontAwesomeIcon
          icon={faEllipsis}
          className={`icon-lg text-brand-navy ml-auto`}
          onClick={e => {
            setShowReportFormLink(prev => !prev);
          }}
        />
      </div>
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
      {isEditModeOn && <EditModePanel forInstagram={true} />}
      {/* link to report content form */}
      {showReportFormLink && <ReportContentLink contentTitle={'an Instagram post'} alignToRight={true} />}
    </div>
  );
}
