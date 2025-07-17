import { useState } from 'react';
import ReportForm from './ReportForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

export function ReportContentLink({
  setPopupHovered = () => {},
  contentTitle,
  alignToRight = false,
  reportType = '',
  contentType = '',
  contentId = '',
  author = '',
}) {
  const [openReportForm, setOpenReportForm] = useState(false);

  return (
    <div
      className={`bg-white border border-brand-yellow-lite rounded-md w-50 shadow-md absolute z-[1000] top-6 ${
        alignToRight ? 'right-3' : 'left-3'
      }`}
      onClick={e => e.stopPropagation()}
      onMouseEnter={() => setPopupHovered(true)}
      onMouseLeave={() => setPopupHovered(false)}
    >
      <ul>
        <li className="hover:bg-brand-peach-lite py-3 px-4 font-primary" onClick={() => setOpenReportForm(true)}>
          <FontAwesomeIcon icon={faFlag} className={`icon-md text-brand-navy mr-2`} />
          Report Content
        </li>

      </ul>
      {/* Report form */}
      {openReportForm && (
        <ReportForm
          onClose={() => setOpenReportForm(false)}
          contentTitle={contentTitle}
          reportType={reportType}
          reportedUser={author}
          contentType={contentType}
          contentId={contentId}
        />
      )}
    </div>
  );
}
