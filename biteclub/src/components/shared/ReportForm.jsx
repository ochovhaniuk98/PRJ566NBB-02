import { Label } from '../shared/Label';
import { Button } from '../shared/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function ReportForm({ onClose, reportType, contentTitle = '', reportedUser = '' }) {
  const handleSubmit = async e => {
    e.preventDefault();

    // ==========================================| DEMO DATA |==========================================
    // ref: dbSchema.js -- ReportSchema
    // DEMO: Reporting a Content
    const demoContentData = {
      // [Note] contentType refers to the actual Mongoose model (not the general reportType like 'User' or 'Content')
      contentType: 'BlogPost', // One of: ['InternalReview', 'ExternalReview', 'Comment', 'BlogPost', 'User']

      // If reporting content (not a user), contentId must be provided — this is the ObjectId of the item being reported
      contentId: '684c2ef7dd04f407d876b971',

      // reportedUserId refers to the author or owner of the content (e.g. the user who wrote the blog post)
      // Even though this could be derived from the content, we store it explicitly for easier querying and population
      reportedUserId: '684b90b687f7b607b363bf4d',

      // reporterType specifies whether the reporter is a normal user or business user
      reporterType: 'User', // 'User' or 'BusinessUser'

      // reporterId is the ObjectId of the logged-in user making the report
      reporterId: '6852bb8f5f6e83284b2eda97',

      // reason is the user's explanation for reporting (captured from a textarea input)
      reason: 'THIS USER IS POSTING SPAM...',
    };

    // DEMO: Reporting a User
    const demoUserData = {
      contentType: 'User',
      reportedUserId: '684b90b687f7b607b363bf4d',
      reporterType: 'User',
      reporterId: '6852bb8f5f6e83284b2eda97',
      reason: ' THIS USER IS POSTING CRAZY THINGS...',
    };

    // DEMO: Reported by a Business User
    const demoReporterBusinessData = {
      contentType: 'InternalReview',
      contentId: '6851d1c41104eb24a4cd6c72',
      reportedUserId: '68377e090be4711cfe59c72a',
      reporterType: 'BusinessUser',
      reporterId: '68548967aec05d6c03193b3c', // [!] Business User Id not restaurant Id
      reason: '... I am the Business User and I don\'t find this   related to my restaurant... ',
    };
    // =================================================================================================

    const reportData = {
      contentType: 'user',
      contentId: '',
      reportedUserId: '6852bb8f5f6e83284b2eda97',
      reporterType: 'User',
      reporterId: '684b90b687f7b607b363bf4d',
      reason: ' THIS USER IS POSTING SPAM...',
    };

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoReporterBusinessData), // try with demoData
      });

      if (!res.ok) throw new Error('Failed to submit report.');

      alert('Report submitted successfully');
      onClose(); // close the modal
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center z-50 overflow-scroll scrollbar-hide w-full h-full"
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
