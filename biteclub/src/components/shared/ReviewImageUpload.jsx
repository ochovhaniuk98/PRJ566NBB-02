'use client';

import { useEffect, useState } from 'react';
import { CldUploadWidget, getCldImageUrl } from 'next-cloudinary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faImage } from '@fortawesome/free-solid-svg-icons';
import SingleTabWithIcon from '../shared/SingleTabWithIcon';

export default function ReviewImageUpload({ onUploadClick }) {
  const [uploadedImageInfo, setUploadedImageInfo] = useState(null);
  const [savedImageId, setSavedImageId] = useState(null);
  const [fetchedImage, setFetchedImage] = useState(null);

  const [uploadedImages, setUploadedImages] = useState([]); // needed to show array of images after upload
  const [showModal, setShowModal] = useState(false); // needed to close modal

  useEffect(() => {
    if (uploadedImageInfo?.public_id) {
      const url = getCldImageUrl({
        width: 960, // 960
        height: 600,
        src: uploadedImageInfo.public_id,
      });
      console.log('Generated URL:', url);
    }
  }, [uploadedImageInfo]);

  // Fetch saved image metadata by id whenever savedImageId changes
  useEffect(() => {
    if (!savedImageId) return;

    async function fetchImageById() {
      try {
        const res = await fetch(`/api/images/${savedImageId}`);
        if (!res.ok) throw new Error('Failed to fetch image by id');
        const data = await res.json();
        setFetchedImage(data);
        console.log('Fetched image by ID:', data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchImageById();
  }, [savedImageId]);

  {
    /*  <section className="flex flex-col items-center justify-between bg-brand-yellow-lite size-full"> */
  }
  return (
    <>
      <CldUploadWidget
        uploadPreset="my-uploads"
        onSuccess={async result => {
          const info = result?.info;
          //setUploadedImageInfo(info);
          setUploadedImages(prev => [...prev, info]); // allows to show array of images after upload
          setShowModal(true);
          console.log('Upload Success:', info);

          try {
            // Add Image Metadata to MongoDB
            const response = await fetch('/api/images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: info.secure_url,
                caption: info.original_filename,
                updated_at: new Date().toISOString(),
              }),
            });

            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.error || 'Failed to save image');
            }

            console.log('✅ Metadata saved to MongoDB:', result.image);
            setSavedImageId(result.image._id); // <-- Save the ID here!
          } catch (err) {
            console.error('❌ Error saving metadata:', err.message);
          }
        }}
      >
        {({ open }) => (
          <div className="w-full flex justify-end mt-1">
            <SingleTabWithIcon
              icon={faImage}
              detailText={'Add Photos'}
              onClick={() => {
                onUploadClick();
                setUploadedImages([]); // clear data before opening modal
                open();
              }}
            />
          </div>
        )}
      </CldUploadWidget>

      {/* Display fetched images and metadata */}
      {/* Only show the modal after the button is clicked */}
      {showModal && (
        <>
          <div className="w-full h-50 bg-brand-blue-lite  p-4  rounded-lg overflow-y-scroll grid grid-cols-5 gap-1 shadow-inner">
            {uploadedImages.length > 0 &&
              uploadedImages.map((img, i) => {
                return (
                  <div
                    key={i}
                    className=" relative bg-white w-16 h-fit p-1 rounded-sm flex flex-col items-center mb-2 shadow-sm"
                  >
                    <img src={img.url} alt={img.original_filename} className="aspect-square object-cover" />
                    <div className="absolute -top-2 -right-2 aspect-square w-6 bg-white rounded-full"></div>
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="absolute -top-2 -right-2 icon-xl text-brand-grey cursor-pointer"
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

/*
{fetchedImage && (
<div className="mt-6 bg-brand-yellow">
<h3>Fetched Image Metadata from MongoDB:</h3>
<p>
<strong>ID:</strong> {fetchedImage._id}
</p>
<p>
<strong>Caption:</strong> {fetchedImage.caption}
</p>
<p>
<strong>URL:</strong> {fetchedImage.url}
</p>
<br></br>
<img src={fetchedImage.url} alt={fetchedImage.caption} width="100" />
</div>
)}
*/

//"mt-1 bg-white h-180 w-3xl border border-brand-blue rounded-lg

/*
<p>
<strong>ID:</strong> {fetchedImage._id}
</p>
<p>
<strong>Caption:</strong> {fetchedImage.caption}
</p>
<p>
<strong>URL:</strong> {fetchedImage.url}
</p>
*/
