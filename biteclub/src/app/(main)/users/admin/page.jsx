'use client';

import { getBusinessUsersAwaitingVerification, approveBusinessUser } from '@/lib/db/dbOperations';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [unverifiedBusinessUsers, setUnverifiedBusinessUsers] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBusinessUsersAwaitingVerification();
        console.log('Business users awaiting verification:', data);
        setUnverifiedBusinessUsers(data);
      } catch (err) {
        console.error('Failed to fetch restaurant ID:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (!unverifiedBusinessUsers || unverifiedBusinessUsers.length === 0) {
    return (
      <>
        <div className="mb-8 p-16">
          <p>No business users found awaiting verification.</p>
        </div>
      </>
    );
  }

  const handleApprove = async userId => {
    try {
      const success = await approveBusinessUser(userId);
      if (!success) {
        alert('Approval failed');
        return;
      }
      alert('User approved successfully');

      setUnverifiedBusinessUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Error approving user:', err);
      alert('Failed to approve user');
    }
  };

  const handleReject = async supabaseId => {
    try {
      const res = await fetch('/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: supabaseId }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }
      alert('User rejected and deleted successfully');
      setUnverifiedBusinessUsers(prev => prev.filter(u => u.supabaseId !== supabaseId));
    } catch (err) {
      console.error('Error rejecting user:', err);
      alert('Failed to reject user');
    }
  };

  return (
    <>
      <div className="mb-8 p-16">
        <h1>Business Users Awaiting Verification</h1>
        {unverifiedBusinessUsers.map(user => (
          <div key={user._id} className="mb-4">
            <div className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">{user.restaurantId?.name}</h2>
              <p className="text-sm text-gray-600">Location: {user.restaurantId?.location}</p>
              <p className="text-sm text-gray-600">User ID: {user?._id}</p>
              <p className="text-sm text-gray-600">Supabase ID: {user?.supabaseId}</p>
              <p className="text-sm text-gray-600">
                License:{' '}
                {user?.licenseFileUrl ? (
                  <button
                    onClick={() => window.open(user.licenseFileUrl, '_blank')}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Download
                  </button>
                ) : (
                  <span className="text-gray-400">No license available</span>
                )}
              </p>
              <div className="mt-2">
                <button
                  onClick={() => handleApprove(user._id)}
                  className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user?.supabaseId)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
