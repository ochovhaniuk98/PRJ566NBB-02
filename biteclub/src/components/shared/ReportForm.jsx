import { Label } from '../shared/Label';
import { Button } from '../shared/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function ReportForm({ onClose, reportType, contentTitle = '', reportedUser = '' }) {

  const handleSubmit = async e => {
    e.preventDefault();
    
    // ref: dbSchema.js -- ReportSchema
    // /*
      const demoData = {
        contentType: 'user',                        // ['review', 'comment', 'blogpost', 'user'], 
                                                    // [!] Notice: This is not the same as reportType (User / Content). 
        reportedUserId: '6852bb8f5f6e83284b2eda97', // reported user's mongoID
        reporterType: 'User',                       // ['User', 'BusinessUser'],
        reporterId: '684b90b687f7b607b363bf4d',     // logged-in user's mongoID
        reason: ' THIS USER IS POSTING SPAM...',    // from the textarea
      };
    // */
    const reportData = {
      contentType: 'user',
      reportedUserId: '6852bb8f5f6e83284b2eda97',
      reporterType: 'User',
      reporterId: '684b90b687f7b607b363bf4d',
      reason: ' THIS USER IS POSTING SPAM...',
    };


    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoData), // try with demoData
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
