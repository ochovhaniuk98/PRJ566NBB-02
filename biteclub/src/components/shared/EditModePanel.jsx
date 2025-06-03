import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenClip } from '@fortawesome/free-solid-svg-icons';

// panel appears when general user selects to "Manage Content" on profile
export default function EditModePanel({ onEditClick }) {
  const [checked, setChecked] = useState(false); // tracks on user checks off item for deletion
  return (
    <div className="absolute bottom-0 w-fit h-11 bg-white/70 rounded-full m-1 px-5  shadow-md flex gap-6 justify-between items-center">
      {/* checkbox */}
      <div className={`custom-checkbox transition-transform hover:scale-130`} onClick={() => setChecked(!checked)}>
        {/* show circle checkmark when user clicks checkbox */}
        {checked && <div className="custom-checkmark"></div>}
      </div>
      {/* edit btn */}
      <FontAwesomeIcon
        icon={faPenClip}
        className={'icon-lg text-brand-navy transition-transform hover:scale-130'}
        onClick={onEditClick}
      />
      {/* delete btn */}
      <FontAwesomeIcon icon={faTrashCan} className={'icon-lg text-brand-red transition-transform hover:scale-130'} />
    </div>
  );
}
