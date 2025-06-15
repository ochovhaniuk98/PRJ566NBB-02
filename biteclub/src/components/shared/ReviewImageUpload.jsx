'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faImage } from '@fortawesome/free-solid-svg-icons';
import SingleTabWithIcon from '../shared/SingleTabWithIcon';

export default function ReviewImageUpload({ reviewImages, setReviewImages, onUploadClick }) {
  const handleDeleteImage = async (public_id, index) => {
    try {
      const res = await fetch('/api/images/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id }),
      });

      if (!res.ok) throw new Error('Failed to delete image');

      setReviewImages(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  return (
    <>
      <CldUploadWidget
        uploadPreset="my-uploads"
        options={{
          resourceType: 'image',
          maxFiles: 5,
          multiple: true,
        }}
        onSuccess={async result => {
          const info = result?.info;
          setReviewImages(prev => [...prev, { ...info, caption: info.original_filename || 'Uploaded Image' }]);
        }}
      >
        {({ open }) => (
          <div className="w-full flex justify-end mt-1">
            <SingleTabWithIcon
              icon={faImage}
              detailText={'Add Photos'}
              onClick={() => {
                onUploadClick();
                setReviewImages([]);
                open();
              }}
            />
          </div>
        )}
      </CldUploadWidget>
      {/* Display uploaded images with delete option */}
      {reviewImages.length > 0 && (
        <>
          <div className="w-full h-50 bg-brand-blue-lite  p-4  rounded-lg overflow-y-scroll grid grid-cols-5 gap-1 shadow-inner">
            {reviewImages.map((img, i) => {
              return (
                <div
                  key={img.public_id}
                  className=" relative bg-white w-16 h-fit p-1 rounded-sm flex flex-col items-center mb-2 shadow-sm"
                >
                  <img src={img.url} alt={img.original_filename} className="aspect-square object-cover" />
                  <div className="absolute -top-2 -right-2 aspect-square w-6 bg-white rounded-full"></div>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="absolute -top-2 -right-2 icon-xl text-brand-grey cursor-pointer"
                    onClick={() => handleDeleteImage(img.public_id, i)}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
