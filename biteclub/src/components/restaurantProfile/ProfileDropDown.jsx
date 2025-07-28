'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faSignIn, faSignOut, faUserTimes } from '@fortawesome/free-solid-svg-icons';
import Spinner from '@/components/shared/Spinner';
import { Button } from '@/components/shared/Button';

export default function ProfileDropdown() {
  const router = useRouter();
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info
  const { userData } = useUserData(); // Current logged-in user's MongoDB data (User / BusinessUser Object)
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showModal, setShowModal] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoggingOut(true);
    router.push('/');
  };

  const handleDelete = async () => {
    const supabase = createClient();
    await fetch('/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loggingOut) return <Spinner message="Logging out..." />;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        className="bg-brand-green-extralite rounded-full aspect-square w-8 h-8 flex items-center justify-center outline outline-brand-navy transition-transform duration-200 hover:scale-115 focus:bg-brand-yellow"
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon icon={faUser} className="icon-lg text-brand-navy" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-amber-50 border border-amber-600 rounded-lg shadow-lg z-50">
          {/* Top Profile */}
          <div className="p-4 border-b border-amber-500">
            <div className="flex flex-col items-start">
              <p className="font-semibold">{userData?.restaurantId?.name}</p>
              <p className="text-sm text-gray-600">{user.user_metadata.email}</p>
            </div>
          </div>

          {/* Options */}
          <div className="px-4 py-4 text-xs flex flex-col gap-2">
            <p className="font-semibold">Accounts</p>
            <Link href="/users/business" className="px-3 hover:bg-gray-100 flex items-center gap-2">
              <FontAwesomeIcon icon={faIdCard} />
              <span className="text-sm">Your Restaurant</span>
            </Link>
            {user ? (
              <Link
                href="#"
                onClick={e => {
                  e.preventDefault();
                  logout();
                }}
                className="px-3 hover:bg-gray-100 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSignOut} />
                <span className="text-sm">Logout</span>
              </Link>
            ) : (
              <Link href="/login" className="px-3 hover:bg-gray-100 flex items-center gap-2">
                <FontAwesomeIcon icon={faSignIn} />
                <span className="text-sm">Login</span>
              </Link>
            )}
          </div>
          <hr className="border-amber-500" />
          <div className="px-4 py-4 text-xs flex flex-col gap-2">
            <p className="font-semibold">Danger Zone</p>
            <Link
              href="#"
              onClick={e => {
                e.preventDefault();
                setShowModal(true);
              }}
              className="px-3 hover:bg-gray-100 flex items-center gap-2 text-gray-600 hover:text-red-500"
            >
              <FontAwesomeIcon icon={faUserTimes} />
              <span className="text-sm">Delete Account</span>
            </Link>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">Confirm Account Deletion</h2>
            <p className="mb-4 text-sm text-gray-700">
              This action is <strong>irreversible</strong>. Please type <code>DELETE</code> below to confirm.
            </p>

            <input
              type="text"
              className="w-full border px-3 py-2 mb-4"
              value={confirmationText}
              onChange={e => setConfirmationText(e.target.value)}
              placeholder="Type DELETE"
            />

            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" disabled={confirmationText !== 'DELETE'} onClick={handleDelete}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
