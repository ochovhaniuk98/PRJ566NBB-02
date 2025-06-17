import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenClip } from '@fortawesome/free-solid-svg-icons';


// panel appears when general user selects to "Manage Content" on profile
export default function EditModePanel({
  isSelected = false,
  onSelect = () => {}, // tracks on user checks off item for deletion
  onEditClick = () => {},
  onDeleteClick, // instead of onDeleteClick = () => {}, favBlog is not going to have this props, so make that optional
  forInstagram = false,
}) {
  return (
    <div className="absolute bottom-0 w-fit h-11 bg-white/70 rounded-full m-1 px-5 shadow-md flex gap-6 justify-between items-center">
      {/* controlled checkbox */}
      <div
        className={`custom-checkbox transition-transform hover:scale-130 ${isSelected ? 'custom-checked' : ''}`}
        onClick={onSelect}
      >
        {/* show circle checkmark when user clicks checkbox */}
        {isSelected && <div className="custom-checkmark"></div>}
      </div>
      {/* edit btn */}
      {!forInstagram && (
        <FontAwesomeIcon
          icon={faPenClip}
          className="icon-lg text-brand-navy transition-transform hover:scale-130"
          onClick={onEditClick}
        />
      )}
      {/* delete btn */}
      <FontAwesomeIcon
        icon={faTrashCan}
        className="icon-lg text-brand-red transition-transform hover:scale-130"
        onClick={onDeleteClick}
      />
    </div>
  );
}
