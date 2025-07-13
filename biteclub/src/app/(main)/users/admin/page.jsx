'use client';

import { getBusinessUsersAwaitingVerification, approveBusinessUser } from '@/lib/db/dbOperations';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import ProfileTabBar from '@/components/shared/ProfileTabBar';

export default function AdminPage() {
  const panelTabs = ['Business Verification', 'Contents Moderation'];

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(panelTabs[0]);

  const [unverifiedBusinessUsers, setUnverifiedBusinessUsers] = useState([]);
  const [contentReports, setContentReports] = useState({
    userReports: [],
    reviewReports: [],
    blogPostReports: [],
    commentReports: [],
  });

  useEffect(() => {
    if (!selectedTab) return;
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

  if (loading)
    return (
      <div className="mb-8 p-16">
        <p>Loading...</p>
      </div>
    );

  const handleBusinessVerificationApprove = async userId => {
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

  const handleBusinessVerificationReject = async supabaseId => {
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
      <div className="mb-8 p-16 pt-26">
        <ProfileTabBar tabs={panelTabs} onTabChange={setSelectedTab} />
        {selectedTab === panelTabs[0] && (
          <>
            <h1 className="mb-6">Business Users Awaiting Verification</h1>
            {unverifiedBusinessUsers && unverifiedBusinessUsers.length > 0 ? (
              unverifiedBusinessUsers.map(user => (
                <div key={user._id} className="mb-4">
                  <div className="flex flex-col border border-brand-peach p-4 rounded shadow gap-3">
                    <h2 className="text-lg font-bold">{user.restaurantId?.name}</h2>
                    <div className="grid grid-cols-[120px_1fr] text-gray-600 gap-y-1">
                      <span>Location</span>
                      <span>: {user.restaurantId?.location}</span>

                      <span>User ID</span>
                      <span>: {user._id}</span>

                      <span>Supabase ID</span>
                      <span>: {user.supabaseId}</span>

                      <span>License</span>
                      <span>
                        {user.licenseFileUrl ? (
                          <button
                            onClick={() => window.open(user.licenseFileUrl, '_blank')}
                            className="text-gray-600 cursor-pointer underline hover:text-blue-600"
                          >
                            Download
                          </button>
                        ) : (
                          <span className="text-gray-400">No license available</span>
                        )}
                      </span>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => handleBusinessVerificationApprove(user._id)}
                        className="bg-green-400 text-white px-4 py-2 mr-2 rounded cursor-pointer hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleBusinessVerificationReject(user.supabaseId)}
                        className="bg-red-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mb-8 p-16">
                <p>No business users found awaiting verification.</p>
              </div>
            )}
          </>
        )}

        {/* Content Reports */}
        {selectedTab === panelTabs[1] && (
          <>
            <h1 className="mb-6">Contents Moderation</h1>
            <div className="flex gap-x-2 mb-4">
              <Button onClick={() => {}} type="button" className="w-30" variant={'roundTab'}>
                All
              </Button>
              <Button onClick={() => {}} type="button" className="w-30" variant={'roundTab'}>
                Users
              </Button>
              <Button onClick={() => {}} type="button" className="w-30" variant={'roundTab'}>
                Reviews
              </Button>
              <Button onClick={() => {}} type="button" className="w-30" variant={'roundTab'}>
                Blog Posts
              </Button>
              <Button onClick={() => {}} type="button" className="w-30" variant={'roundTab'}>
                Comments
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
