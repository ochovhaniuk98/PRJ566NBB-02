import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import { Label } from '../shared/Label';
import { Button } from '../shared/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import Spinner from '@/components/shared/Spinner';
import Image from 'next/image';

export default function ReportForm({
  // For report form display
  onClose,
  reportType,
  contentTitle = '',
  // For sending data to admin panel
  contentType = '', // [REQUIRED]
  contentId = '', // [NULLABLE] Only if the reported contentType is a User
  reportedUser = '', // [REQUIRED] User OBJECT (not just Id) -- The one who got reported
}) {
  /*
  // ==========================================| DEMO DATA |==========================================
  // ref: dbSchema.js -- ReportSchema
  const demoContentData = {
    // [Note] NOT the reportType i.e. 'User' or 'Content'
    contentType: 'BlogPost',                    // One of: ['InternalReview', 'ExternalReview', 'CommentPost', 'BlogPost', 'User']
    contentId: '684c2ef7dd04f407d876b971',      // If reporting content is not a user, contentId (Mongoose ObjectId) must be provided
    reportedUserId: '684b90b687f7b607b363bf4d', // Author or owner of the reported content
    reporterType: 'User',                       // 'User' or 'BusinessUser'
    reporterId: '6852bb8f5f6e83284b2eda97',     // The Mongoose ObjectId of user who send out this report
    reason: 'THIS USER IS POSTING SPAM...',     // reason from form textarea input
  };
  // =================================================================================================
  */

  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info
  const userType = user?.user_metadata.user_type; // reporter = current user
  const { userData, loadingData, refreshUserData } = useUserData();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingData || !userData) return;
    setLoading(false);
  }, [loadingData, userData]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!userData || !reportedUser) {
      alert('User data not ready. Please try again later.');
      return;
    }

    if (reportedUser._id === userData._id) {
      alert('You cannot report yourself!');
      return;
    }

    // renaming userType to match API call requirements
    let reporterType;
    if (userType === 'general') {
      reporterType = 'User';
    } else if (userType === 'business') {
      reporterType = 'BusinessUser';
    }

    const reportData = {
      contentType: contentType,
      contentId: contentId,
      reportedUserId: reportedUser._id,
      reporterId: userData._id,
      reporterType: reporterType,
      reason: reason.trim(),
    };

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData), // try with demoData
      });

      if (res.status == 409) {
        alert('You have already reported this content!');
      } else if (!res.ok) {
        throw new Error('Failed to submit report.');
      } else {
        alert('Report submitted successfully');
      }

      onClose(); // close the modal
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (loadingData || loading) return <Spinner />;

  return (
    <div
      className="fixed inset-0 bg-brand-peach/40 flex justify-center z-[100] overflow-scroll scrollbar-hide w-full h-full"
      onClick={e => e.stopPropagation()}
    >
      <div className="relative bg-transparent p-8 w-2xl min-h-fit ">
        <div className="bg-brand-green-lite w-full font-primary rounded-t-lg flex gap-x-2 cursor-pointer p-3 font-semibold">
          <FontAwesomeIcon icon={faFlag} className={`icon-xl text-white`} />
          Report {reportType === 'user' ? 'User' : 'Content'}
        </div>
        <form className=" w-full min-h-content bg-white rounded-b-lg shadow-md flex flex-col items-center pb-8">
          <div className="w-full p-6 flex flex-col gap-3">
            <div>
              <div className="flex font-primary gap-x-2">
                <div className="font-secondary text-4xl mb-4">
                  Report {reportType === 'user' ? reportedUser.username : 'Content'}
                </div>

                {reportType === 'user' && (
                  <div className="w-10 h-10 aspect-square bg-brand-green rounded-full relative">
                    <Image
                      src={reportedUser.userProfilePicture.url}
                      alt={reportedUser.userProfilePicture.caption}
                      className="object-cover rounded-full"
                      fill={true}
                    />
                  </div>
                )}
              </div>
              {reportType !== 'user' && (
                <p className="mb-4">
                  You are reporting <span className="font-semibold italic">{contentTitle}</span>.
                </p>
              )}
              <Label>Reason for reporting</Label>
              <textarea
                type="text"
                className={'w-full rounded-md p-2 h-50 resize-none font-primary'}
                placeholder="Write your reason for reporting here..."
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-16">
            <Button type="submit" className="w-30" variant="default" disabled={false} onClick={handleSubmit}>
              Submit
            </Button>
            <Button type="button" className="w-30" variant="secondary" disabled={false} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
