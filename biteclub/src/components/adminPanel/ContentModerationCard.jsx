'use client';
import { useState } from 'react';

export default function ContentModerationCard({ report, onResolve }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${report._id}`, {
        method: 'PATCH', // 'PUT', [! we update only specific fields]
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
        method: 'PATCH', // 'PUT', [! we update only specific fields]
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
      console.error('Approval failed', error);
      alert('Failed to approve');
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
          <span className="col-span-2">
            <strong>Reported User </strong>
          </span>

          <span>Name</span>
          <span>
            : {report.reportedUserId?.username} ({report.reportedUserId?._id})
          </span>

          <span>Strikes</span>
          <span>: {report.reportedUserId?.strike ?? 0}</span>

          <hr className="col-span-2 border-neutral-300 my-2" />

          <span className="col-span-2">
            <strong>Reporter</strong>
          </span>

          <span>Name</span>
          <span>
            : {report.reporterId?.username} ({report.reporterId?._id})
          </span>

          <span>User Type</span>
          <span>: {report.reporterType}</span>

          <hr className="col-span-2 border-gray-300 my-2" />

          <span className="col-span-2">
            <strong>Report Details</strong>
          </span>
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

          <span>Status</span>
          <span>: {report.status}</span>
          {(report.status === 'Approved' || report.status === 'Rejected') && (
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
          <div className="mt-2">
            <button
              onClick={handleApprove}
              className="bg-green-400 text-white px-4 py-2 mr-2 rounded cursor-pointer hover:bg-green-600"
              disabled={loading}
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="bg-red-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-500"
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
