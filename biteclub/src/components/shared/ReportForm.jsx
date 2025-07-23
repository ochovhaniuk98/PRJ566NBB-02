import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';
import { Label } from '../shared/Label';
import { Button } from '../shared/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function ReportForm({
  // For report form display
  onClose,
  reportType,
  contentTitle = '',
  // For sending data to admin panel
  contentType = '', // [REQUIRED / NOT NULL]
  contentId = '', // [NULLABLE] Only if the reported contentType is a User
  reportedUser = '', // [REQUIRED / NOT NULL] User OBJECT (not just Id) -- The one who got reported
}) {
  /*
  // ==========================================| DEMO DATA |==========================================
  // ref: dbSchema.js -- ReportSchema
  const demoContentData = {
    // [Note] NOT the reportType i.e. 'User' or 'Content'
    // One of: ['InternalReview', 'ExternalReview', 'CommentPost', 'BlogPost', 'User']
    contentType: 'BlogPost',

    // If reporting content is not a user, contentId (Mongoose ObjectId) must be provided
    contentId: '684c2ef7dd04f407d876b971',

    // Author or owner of the reported content
    // Even though this could be derived from the content, we store it explicitly for easier querying and population
    reportedUserId: '684b90b687f7b607b363bf4d',

    // 'User' or 'BusinessUser'
    reporterType: 'User',

    // The Mongoose ObjectId of user who send out this report
    reporterId: '6852bb8f5f6e83284b2eda97',

    // reason from form textarea input
    reason: 'THIS USER IS POSTING SPAM...',
  };
  // =================================================================================================
  */

  const [reason, setReason] = useState('');
  const [reporterUserType, setReporterUserType] = useState(null);
  const [reporter, setReporter] = useState(null);

  // Fetch current user and their profile
  useEffect(() => {
    const fetchReporterData = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          console.error('Failed to get current user:', error);
          return;
        }
        const authId = data.user.id;

        // Get user type
        const reporterUserTypeRes = await fetch(`/api/get-user-type?authId=${authId}`);
        if (!reporterUserTypeRes.ok) {
          console.error('Failed to fetch user type');
          return;
        }

        const { userType } = await reporterUserTypeRes.json();
        setReporterUserType(userType);

        // Get profile based on type
        let reporterRes;
        if (userType == 'general') {
          reporterRes = await fetch(`/api/generals/get-profile-by-authId?authId=${authId}`);
        } else if (userType == 'business') {
          reporterRes = await fetch(`/api/business-user/get-profile-by-authId?authId=${authId}`);
        } else {
          console.warn('Unknown user type:', userType);
          return;
        }

        if (!reporterRes.ok) {
          console.error('Failed to fetch current profile:', reporterRes.status);
          return;
        }
        const { profile } = await reporterRes.json(); // { profile } matching what the API call returned
        setReporter(profile);
      } catch (err) {
        console.error('Error in fetchReporterData:', err);
      }
    };

    fetchReporterData();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!reporter || !reportedUser) {
      alert('Something is wrong with the user data.');
      return;
    }

    if (reportedUser._id === reporter._id) {
      alert('You cannot report yourself!');
      return;
    }

    // renaming userType
    let reporterType;
    if (reporterUserType === 'general') {
      reporterType = 'User';
    } else if (reporterUserType === 'business') {
      reporterType = 'BusinessUser';
    }

    const reportData = {
      contentType: contentType,
      contentId: contentId,
      reportedUserId: reportedUser._id,
      reporterId: reporter._id,
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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center z-[100] overflow-scroll scrollbar-hide w-full h-full"
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
