import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '@/components/shared/Button';
import ReviewImageUpload from './ReviewImageUpload';

// Has 2 modes: ADDING a NEW review (along with embed instagram link option) and EDITING an existing one.
// editReviewMode: Tracks whether this form should display a review to be edited, or just empty fields (for writing new review + instagram link)
export default function AddReviewForm({ onCancel, children, editReviewMode = false }) {
  const [showPhotoPlaceholder, setShowPhotoPlaceholder] = useState(true);
  const [showInstagramForm, setShowInstagramForm] = useState(false);
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center  z-50  overflow-scroll scrollbar-hide">
        <div className="relative bg-transparent p-8 w-2xl min-h-fit ">
          {/* Toggle Switch -- Allows users to select "Write a review" OR "Add Instagram Post" if adding NEW review (non-edit mode) */}
          <div className="bg-brand-green-lite w-full font-secondary uppercase rounded-t-lg flex justify-between cursor-pointer">
            <div
              className={`flex items-center font-primary font-semibold text-md capitalize py-3 px-3 rounded-tl-lg ${
                editReviewMode ? 'w-full' : 'w-[50%]'
              } hover:bg-brand-aqua bg-brand-aqua`}
              onClick={() => setShowInstagramForm(false)}
            >
              <FontAwesomeIcon icon={faPenClip} className={`text-2xl text-white mr-2`} />
              {/* Show title depending on mode */}
              {editReviewMode ? 'Edit Review' : 'Write a Review'}
            </div>
            {!editReviewMode && (
              <div
                className="flex items-center font-primary font-semibold text-md capitalize py-3 px-3 w-[50%] rounded-tr-lg hover:bg-brand-aqua shadow-md"
                onClick={() => setShowInstagramForm(true)}
              >
                <FontAwesomeIcon icon={faInstagram} className={`text-2xl text-white mr-2`} />
                Add Instagram Post
              </div>
            )}
          </div>
          <div className="relative">
            {/* EDIT or WRITE a Reveiw form */}
            <form className=" w-full min-h-full bg-white rounded-b-lg shadow-md flex flex-col items-center pb-8">
              <div className="w-full p-6 flex flex-col gap-3">
                <div>
                  <div className="font-secondary text-4xl mb-4">
                    {editReviewMode ? 'Edit Review' : 'Write a Review'}
                  </div>
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
              <div className=" flex justify-end gap-2 mt-16">
                <Button type="submit" className="w-30" variant="default" disabled={false}>
                  Save
                </Button>
                <Button type="button" className="w-30" variant="secondary" disabled={false} onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
            {/* Add Instagram post form */}
            {showInstagramForm && (
              <form className="bg-white absolute top-0 w-full h-full rounded-b-lg p-6 flex flex-col items-center">
                <div className="font-secondary text-4xl mb-4 w-full">Add Instagram Post</div>
                <div className="w-full">
                  <Label>Link</Label>
                  <Input type="text" className={'w-full'} />
                </div>
                <div className=" flex justify-end gap-2 mt-16">
                  <Button type="submit" className="w-30" variant="default" disabled={false}>
                    Save
                  </Button>
                  <Button
                    type="button"
                    className="w-30"
                    variant="secondary"
                    disabled={false}
                    onClick={() => setShowInstagramForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
