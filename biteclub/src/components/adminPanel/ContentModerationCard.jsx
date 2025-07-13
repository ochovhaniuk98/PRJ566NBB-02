'use client';

export default function ContentModerationCard({ report }) {
  return (
    <div className="mb-4">
      <div className="flex flex-col border border-red-300 p-4 rounded gap-3 hover:shadow hover:bg-red-50">
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

          <hr className="col-span-2 border-gray-300 my-2" />

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
            {new Date(report.createdAt).toLocaleString('en-US', {
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
        </div>

        <div className="mt-2">
          <button
            onClick={() => {}}
            className="bg-green-400 text-white px-4 py-2 mr-2 rounded cursor-pointer hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => {}}
            className="bg-red-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-500"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
