import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '@/components/shared/Button';
import ReviewImageUpload from './ReviewImageUpload';
import { useSubmitExternalReview } from '@/hooks/use-submit-external-review';
import StarRating from './StarRating';
import { addInternalReview, updateInternalReview } from '@/lib/db/dbOperations';

// Has 2 modes: ADDING a NEW review (along with embed instagram link option) and EDITING an existing one.
// editReviewMode: Tracks whether this form should display a review to be edited, or just empty fields (for writing new review + instagram link)
export default function AddReviewForm({
  restaurantId = null,
  userId = null,
  onCancel,
  children,
  editReviewMode = false,
  reviewData = null,
  onReviewSaved = () => {}, // for rerendering the data after add or edit
}) {
  const [showPhotoPlaceholder, setShowPhotoPlaceholder] = useState(true);
  const [showInstagramForm, setShowInstagramForm] = useState(false);

  console.log(userId);

  const {
    embedLink,
    setEmbedLink,
    loading: externalReviewLoading,
    error: externalReviewError,
    handleSubmit: handleInstagramSubmit,
  } = useSubmitExternalReview({ userId, restaurantId, onSuccess: onCancel });

  const [internalReviewError, setInternalReviewError] = useState(null);

  const [reviewRating, setReviewRating] = useState({ value: 0, message: '' });
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewImages, setReviewImages] = useState([]);

  // Duplicated here (original in StarRating.jsx)
  // [TODO] should be refractor later. For now it's a quick fix so that the message will show on UI.
  const reviewRatingMessages = [
    'I regret everything.',
    'Ehh, at least I tried it.',
    'It was fine, nothing special.',
    'Good, met all my expectations!',
    'Chef’s kiss 👨‍🍳💋',
  ];

  useEffect(() => {
    if (editReviewMode && reviewData) {
      setReviewTitle(reviewData.title || '');
      setReviewContent(reviewData.body || '');
      setReviewRating({
        value: reviewData.rating || 0,
        message: reviewData.rating > 0 ? reviewRatingMessages[reviewData.rating - 1] : '',
      });

      setReviewImages(reviewData.photos || []);
    }
  }, [editReviewMode, reviewData]);

  const handleInternalSubmit = async e => {
    e.preventDefault();

    // const res = await addInternalReview(reviewData);

    if (editReviewMode && reviewData?._id) {
      // update review
      const res = await updateInternalReview({
        reviewId: reviewData._id,
        body: reviewContent,
        title: reviewTitle,
        rating: reviewRating.value,
        photos: reviewImages,
        userId: reviewData.user_id,
        restaurantId: reviewData.restaurant_id,
      });

      if (res) {
        console.log('Internal review updated');
        onReviewSaved();
        onCancel();
      } else {
        setInternalReviewError('Failed to update review.');
      }
    } else {
      // if not edit mode and no reviewData => create new review
      const res = await addInternalReview({
        body: reviewContent,
        title: reviewTitle,
        rating: reviewRating.value,
        photos: reviewImages,
        userId,
        restaurantId,
      });

      if (res) {
        console.log('Internal review added successfully:', res);
        onReviewSaved();
        onCancel();
      } else {
        setInternalReviewError('Failed to add internal review. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center  z-[99999999999999]  overflow-scroll scrollbar-hide">
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
            <form
              onSubmit={handleInternalSubmit}
              className=" w-full min-h-full bg-white rounded-b-lg shadow-md flex flex-col items-center pb-8"
            >
              <div className="w-full p-6 flex flex-col gap-3">
                <div>
                  <div className="font-secondary text-4xl mb-4">
                    {editReviewMode ? 'Edit Review' : 'Write a Review'}
                  </div>
                  <Label>Rating</Label>
                  <div className="flex items-center gap-6">
                    {/* StarRating also has two modes: STATIC (for just viewing on review cards) and INTERACTIVE for inputting ratings in the AddReviewForm.
                Parameters "interactive" and "onChange" are false or empty by default, but need values when StarRating is being used for rating input.*/}
                    <StarRating
                      iconSize="text-4xl cursor-pointer"
                      interactive={true}
                      ratingNum={reviewRating.value}
                      onChange={(val, msg) => setReviewRating({ value: val, message: msg })}
                    />
                    {reviewRating.value > 0 && <p>{reviewRating.message}</p>}
                  </div>
                </div>
                <div>
                  <Label>Headline</Label>
                  <Input
                    type="text"
                    className={'w-full'}
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                    placeholder="Enter a catchy headline for your review"
                    required
                  />
                </div>
                <div>
                  <Label>Review</Label>
                  <textarea
                    type="text"
                    className={'w-full rounded-md p-2 h-50 resize-none'}
                    onChange={e => setReviewContent(e.target.value)}
                    placeholder="Write your review here..."
                    value={reviewContent}
                    required
                  />
                </div>
                <ReviewImageUpload
                  reviewImages={reviewImages}
                  setReviewImages={setReviewImages}
                  onUploadClick={() => setShowPhotoPlaceholder(false)}
                />
                {
                  /* The div below is just a PLACEHOLDER/for styling puposes so that the form stays the same height when the "Add Photos" button is clicked.
                Do NOT use for backend logic. The "real" photo div is inside ReviewImageUpload.*/ showPhotoPlaceholder && (
                    <div className="w-full h-50 bg-brand-blue-lite  p-4  rounded-lg overflow-y-scroll grid grid-cols-5 gap-1 shadow-inner"></div>
                  )
                }
              </div>
              {
                /* Show error message if there was an error submitting the internal review */
                internalReviewError && <p className="text-red-600 mt-2 text-center">{internalReviewError}</p>
              }
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
              <form
                onSubmit={handleInstagramSubmit}
                className="bg-white absolute top-0 w-full h-full rounded-b-lg p-6 flex flex-col items-center"
              >
                <div className="font-secondary text-4xl mb-4 w-full">Add Instagram Post</div>
                <div className="w-full">
                  <Label>Link</Label>
                  <Input
                    type="text"
                    className={'w-full'}
                    value={embedLink}
                    onChange={e => setEmbedLink(e.target.value)}
                    disabled={externalReviewLoading}
                    placeholder="https://www.instagram.com/p/DCZlEDqy2to/"
                  />
                </div>
                {externalReviewError && <p className="text-red-600 mt-2">{externalReviewError}</p>}
                <div className=" flex justify-end gap-2 mt-16">
                  <Button type="submit" className="w-30" variant="default" disabled={externalReviewLoading}>
                    {externalReviewLoading ? 'Posting...' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    className="w-30"
                    variant="secondary"
                    disabled={externalReviewLoading}
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
