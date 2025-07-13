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
  const [selectedReportType, setSelectedReportType] = useState('user'); // default to 'user'

  const [unverifiedBusinessUsers, setUnverifiedBusinessUsers] = useState([]);
  const [contentReports, setContentReports] = useState({
    userReports: [],
    reviewReports: [],
    blogPostReports: [],
    commentReports: [],
  });

  /*
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
*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedTab === 'Business Verification') {
          try {
            const data = await getBusinessUsersAwaitingVerification();
            setUnverifiedBusinessUsers(data);
          } catch (err) {
            console.error('(Admin) Failed to fetch restaurant ID:', err);
          }
        }

        if (selectedTab === 'Contents Moderation') {
          try {
            const res = await fetch('/api/reports');
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const json = await res.json();

            const grouped = {
              userReports: [],
              reviewReports: [],
              blogPostReports: [],
              commentReports: [],
            };

            for (const report of json.reports || []) {
              switch (report.contentType) {
                case 'user':
                  grouped.userReports.push(report);
                  break;
                case 'review':
                  grouped.reviewReports.push(report);
                  break;
                case 'blogpost':
                  grouped.blogPostReports.push(report);
                  break;
                case 'comment':
                  grouped.commentReports.push(report);
                  break;
                default:
                  console.warn('(Admin) Unknown report type', report);
                  break;
              }
            }

            setContentReports(grouped);
          } catch (err) {
            console.error('[FETCH_REPORTS_FAILED]', err);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab]);

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
                  <div className="flex flex-col border border-brand-peach p-4 rounded hover:shadow gap-3">
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
              <Button onClick={() => setSelectedReportType('user')} type="button" className="w-30" variant={'roundTab'}>
                Users
              </Button>
              <Button
                onClick={() => setSelectedReportType('review')}
                type="button"
                className="w-30"
                variant={'roundTab'}
              >
                Reviews
              </Button>
              <Button
                onClick={() => setSelectedReportType('blogpost')}
                type="button"
                className="w-30"
                variant={'roundTab'}
              >
                Blog Posts
              </Button>
              <Button
                onClick={() => setSelectedReportType('comment')}
                type="button"
                className="w-30"
                variant={'roundTab'}
              >
                Comments
              </Button>
            </div>
            {selectedReportType === 'user' &&
              contentReports.userReports.map(report => (
                <div key={report._id} className="border p-4 rounded mb-2">
                  <p>
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  <p>
                    <strong>Reported User:</strong> {report.reportedUserId?.username}
                  </p>
                  <p>
                    <strong>Status:</strong> {report.status}
                  </p>
                </div>
              ))}

            {selectedReportType === 'review' &&
              contentReports.reviewReports.map(report => (
                <div key={report._id} className="border p-4 rounded mb-2">
                  <p>
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  {/* Add any review-specific info here */}
                </div>
              ))}

            {selectedReportType === 'blogpost' &&
              contentReports.blogPostReports.map(report => (
                <div key={report._id} className="border p-4 rounded mb-2">
                  <p>
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  {/* Add any blogpost-specific info here */}
                </div>
              ))}

            {selectedReportType === 'comment' &&
              contentReports.commentReports.map(report => (
                <div key={report._id} className="border p-4 rounded mb-2">
                  <p>
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  {/* Add any comment-specific info here */}
                </div>
              ))}
          </>
        )}
      </div>
    </>
  );
}
