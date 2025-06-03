import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip } from '@fortawesome/free-solid-svg-icons';
import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '@/components/shared/Button';
import ReviewImageUpload from './ReviewImageUpload';

// Has 2 modes: ADDING a NEW review and EDITING an existing one.
// editReviewMode: Tracks whether this form should display a review to be edited, or just empty fields (for writing new review)
export default function AddReviewForm({ onCancel, children, editReviewMode = false }) {
  const [showPhotoPlaceholder, setShowPhotoPlaceholder] = useState(true);
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center  z-50  overflow-scroll scrollbar-hide">
        <div className="bg-transparent p-8 w-xl min-h-fit ">
          <form className="relative w-full h-full bg-white rounded-lg shadow-md flex flex-col items-center pb-8">
            <div className="bg-brand-green-lite w-full font-secondary text-2xl py-3 pl-3 uppercase rounded-t-lg">
              <FontAwesomeIcon icon={faPenClip} className={`text-2xl text-white mr-2`} />
              {/* Show title depending on mode */}
              {editReviewMode ? 'Edit Review' : 'Write a Review'}
            </div>
            <div className="w-full p-6 flex flex-col gap-3">
              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-6">{children}</div>
              </div>
              <div>
                <Label>Headline</Label>
                <Input type="text" className={'w-full'} />
              </div>
              <div>
                <Label>Review</Label>
                <textarea type="text" className={'w-full rounded-md p-2 h-50 resize-none'} />
              </div>
              <ReviewImageUpload onUploadClick={() => setShowPhotoPlaceholder(false)} />
              {
                /* The div below is just a PLACEHOLDER/for styling puposes so that the form stays the same height when the "Add Photos" button is clicked.
                Do NOT use for backend logic. The "real" photo div is inside ReviewImageUpload.*/ showPhotoPlaceholder && (
                  <div className="w-full h-50 bg-brand-blue-lite  p-4  rounded-lg overflow-y-scroll grid grid-cols-5 gap-1 shadow-inner"></div>
                )
              }
            </div>
            <div className=" absolute bottom-6 flex justify-end gap-2 mt-16">
              <Button type="submit" className="w-30" variant="default" disabled={false}>
                Save
              </Button>
              <Button type="button" className="w-30" variant="secondary" disabled={false} onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
