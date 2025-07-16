'use client';
import { useState } from 'react';

function ContentModerationTag({ contentType, status }) {
  const contentTagMap = {
    InternalReview: {
      label: 'Internal Review',
      className: 'bg-amber-200 text-black',
    },
    ExternalReview: {
      label: 'External Review',
      className: 'bg-green-200 text-black',
    },
    BlogPost: {
      label: 'Blog Post',
      className: 'bg-blue-200 text-black',
    },
    CommentPost: {
      label: 'CommentPost',
      className: 'bg-purple-200 text-black',
    },
    User: {
      label: 'User Profile',
      className: 'bg-pink-200 text-black',
    },
  };

  const statusTagMap = {
    Approved: {
      label: 'Approved',
      className: 'bg-green-100 text-green-800 border border-green-300',
    },
    Rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 border border-red-300',
    },
    Pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    },
    ApprovedAndBanned: {
      label: 'Approved and Banned',
      className: 'bg-gray-800 text-gray-100 border border-gray-700',
    },
  };

  const contentTag = contentTagMap[contentType];
  const statusTag = statusTagMap[status];

  return (
    <div className="flex gap-2 items-center">
      {contentTag && (
        <div className={`inline-block px-2 py-1 text-sm rounded ${contentTag.className}`}>{contentTag.label}</div>
      )}
      {statusTag && (
        <div className={`inline-block px-2 py-1 text-sm rounded ${statusTag.className}`}>{statusTag.label}</div>
      )}
    </div>
  );
}

export default function ContentModerationCard({ report, onResolve }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${report._id}`, {
        method: 'PATCH', // 'PUT', [!] we update only specific fields
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Approved',
          resolvedAt: new Date(),
          incrementStrike: true,
        }),
      });
      if (!res.ok) throw new Error(`(Content Moderation) Error: ${res.status}`);
      onResolve?.(report._id); // update UI in parent (AdminPanel page)
      alert('Report Approved');
    } catch (error) {
      console.error('Approval failed', error);
      alert('Failed to approve');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${report._id}`, {
        method: 'PATCH', // 'PUT', [!] we update only specific fields
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Rejected',
          resolvedAt: new Date(),
          incrementStrike: false,
        }),
      });
      if (!res.ok) throw new Error(`(Content Moderation) Error: ${res.status}`);
      onResolve?.(report._id); // update UI in parent (AdminPanel page)
      alert('Report Rejected');
    } catch (error) {
      console.error('Reject failed', error);
      alert('Failed to reject');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndBanUser = async () => {
    setLoading(true);
    try {
      // Step 1: Approve the report
      const approveRes = await fetch(`/api/reports/${report._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ApprovedAndBanned',
          resolvedAt: new Date(),
          incrementStrike: true,
        }),
      });

      if (!approveRes.ok) {
        throw new Error(`Report update failed: ${approveRes.status}`);
      }

      // Step 2: Ban the user
      const banRes = await fetch(`/api/admin-user/ban-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          banUserId: report.reportedUserId?.supabaseId,
          numStrikes: report.reportedUserId?.strike,
        }),
      });

      if (!banRes.ok) {
        throw new Error(`Ban user failed: ${banRes.status}`);
      }

      onResolve?.(report._id);
      alert('Approved and Banned User');
    } catch (error) {
      console.error('Approval and ban user failed', error);
      alert('Failed to approve and ban user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div
        className={[
          'flex flex-col border p-4 rounded gap-3 hover:shadow transition-all',
          report.status === 'Pending'
            ? 'border-neutral-300 hover:border-teal-300 hover:bg-teal-50'
            : 'border-neutral-300 hover:border-amber-200 hover:bg-brand-yellow-extralite',
        ].join(' ')}
      >
        {/* 
            grid-cols-[120px_1fr]:
            - 120px : the first column will always be 120 pixels wide (fixed width).
            - 1fr   : the second column takes up the remaining space (flexible, like a stretchable unit). 
        */}
        <div className="grid grid-cols-[120px_1fr] text-gray-600 gap-y-1">
          {/* REPORTED USER */}
          <span className="col-span-2">
            <strong>Reported User </strong>
          </span>

          <span>Name</span>
          <span>
            : {report.reportedUserId?.username} ({' '}
            <a
              href={`/generals/${report.reportedUserId?._id}`}
              className="text-neutral-600 cursor-pointer underline hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {report.reportedUserId?._id}
            </a>{' '}
            )
          </span>

          <span>Strikes</span>
          <span>: {report.reportedUserId?.strike ?? 0}</span>

          <hr className="col-span-2 border-neutral-300 my-2" />

          {/* REPORTER */}
          <span className="col-span-2">
            <strong>Reporter</strong>
          </span>

          <span>Name</span>
          <span>
            :{' '}
            {report.reporterType === 'BusinessUser'
              ? report.reporterId?.restaurantId?.name
              : report.reporterId?.username}{' '}
            ({' '}
            <a
              href={`/${report.reporterType === 'BusinessUser' ? 'restaurants' : 'generals'}/${
                report.reporterType === 'BusinessUser' ? report.reporterId?.restaurantId._id : report.reporterId?._id
              }`}
              className="text-neutral-600 cursor-pointer underline hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {report.reporterId?._id}
            </a>{' '}
            )
          </span>

          <span>User Type</span>
          <span>: {report.reporterType}</span>

          <hr className="col-span-2 border-gray-300 my-2" />

          {/* REPORT DETAILS */}
          <span className="col-span-2">
            <strong>Report Details</strong>
          </span>

          <span>Tag</span>
          <ContentModerationTag contentType={report.contentType} status={report.status} />

          {report.contentId && (
            <>
              <span>Content</span>
              {/* Fall back to ._id if title is not present */}

              <span>
                :{' '}
                {/* 
                [TODO: ADJUST PATH]
                  CommentPost → /blog-posts/comments/[id]                   (Done)
                  BlogPost → /blog-posts/[id]                               (Done)
                  Review → /restaurants/[restaurantId]/reviews/[reviewId]   (Not sure of how to get to a specific review)
                */}
                <a
                  href={
                    report.contentType === 'CommentPost'
                      ? `/blog-posts/comments/${report.contentId?._id}`
                      : report.contentType === 'BlogPost'
                      ? `/blog-posts/${report.contentId?._id}`
                      : report.contentType === 'InternalReview' || report.contentType === 'ExternalReview' // [!] REDIRECT TO RESTAURANT PROFILE INSTEAD.
                      ? `/restaurants/${report.contentId?.restaurant_id}`
                      : '#'
                  }
                  className="text-neutral-600 cursor-pointer underline hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {report.contentId?.title || report.contentId?._id}
                </a>
              </span>
            </>
          )}

          <span>Reason</span>
          <span>: {report.reason}</span>

          <span>Report Time</span>
          <span>
            :{' '}
            {new Date(report.createdAt)?.toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </span>

          {report.status !== 'Pending' && (
            <>
              <span>Resolved Time</span>
              <span>
                :{' '}
                {new Date(report.resolvedAt)?.toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </>
          )}
        </div>

        {report.status === 'Pending' && (
          <div className="mt-4">
            {report.reportedUserId?.strike == 4 ? (
              <button
                onClick={handleApproveAndBanUser}
                className="w-auto bg-stone-900 text-white px-4 py-2 mr-2 rounded cursor-pointer hover:bg-red-600"
                disabled={loading}
              >
                {' '}
                Approve and Ban Reported User
              </button>
            ) : (
              <button
                onClick={handleApprove}
                className="w-30 bg-green-400 text-white px-4 py-2 mr-2 rounded cursor-pointer hover:bg-green-600"
                disabled={loading}
              >
                Approve
              </button>
            )}

            <button
              onClick={handleReject}
              className="w-30 bg-red-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-500"
              disabled={loading}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
