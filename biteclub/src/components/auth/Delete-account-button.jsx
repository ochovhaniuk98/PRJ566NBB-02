'use client';

import { useState } from 'react';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';

export function DeleteAccountButton({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    await fetch('/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });

    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
      <Button variant="danger" className="w-40" onClick={() => setShowModal(true)}>
        Delete Account
      </Button>

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
    </>
  );
}
