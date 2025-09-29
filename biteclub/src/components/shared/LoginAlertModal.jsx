import { faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../shared/Button';

export default function LoginAlertModal({ isOpen, handleClose }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // required to ensure overlay is above menu/search bar (z-index not working)
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, mounted]);
  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-brand-peach/40 w-screen h-screen z-[100]">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 md:w-sm w-xs min-h-20 rounded-lg shadow-2xl bg-white text-center font-primary flex flex-col items-center justify-center">
        <div className="bg-brand-blue-lite w-full min-h-8 flex items-center justify-between p-2">
          <div className="text-sm text-brand-grey font-medium">
            <FontAwesomeIcon icon={faTriangleExclamation} className={`text-lg text-brand-blue mr-2`} />
            Login Required
          </div>
          <FontAwesomeIcon icon={faXmark} className={`text-lg text-brand-navy cursor-pointer`} onClick={handleClose} />
        </div>
        <div className="h-full p-4 flex flex-col gap-4 text-base">
          Please log in to continue.
          <div className="flex gap-2">
            <Button type="button" className="w-30" variant="default">
              Login
            </Button>
            <Button type="button" className="w-30" variant="third" onClick={handleClose}>
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
