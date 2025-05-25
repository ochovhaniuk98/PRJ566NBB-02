'use client';

import { useEffect, useState } from 'react';
import { CldUploadWidget, getCldImageUrl } from 'next-cloudinary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faHeart } from '@fortawesome/free-solid-svg-icons';
import SingleTabWithIcon from '../shared/SingleTabWithIcon';

export default function RestaurantImageUpload({ buttonType }) {
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
        {({ open }) =>
          !buttonType ? (
            <button onClick={() => open()} className="bg-blue-500 text-white px-4 py-2 rounded">
              Upload an Image
            </button>
          ) : (
            <SingleTabWithIcon
              icon={faHeart}
              detailText={'Add Photo'}
              onClick={() => {
                setUploadedImages([]); // clear data before opening modal
                open();
                setShowModal(true);
              }}
            />
          )
        }
      </CldUploadWidget>

      {/* Display fetched images and metadata */}
      {/* Only show the modal after the button is clicked */}
      {showModal && (
        <div className="fixed w-screen h-screen bg-black/50 left-0 top-0 z-200 py-12 px-80  ">
          <div className="box-border bg-white h-full w-full  rounded-lg  z-210 p-8 flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {uploadedImages.length > 0 ? 'Completed Uploading Photos!' : 'Select Photos to Upload'}
              </h2>
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="icon-2xl text-brand-navy cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>
            <div className="w-full h-full bg-brand-blue-lite  p-4 mt-4 rounded-lg overflow-y-scroll grid grid-cols-4 gap-2 shadow-inner">
              {uploadedImages.length > 0 &&
                uploadedImages.map((img, i) => {
                  return (
                    <div className="bg-white w-fit h-fit p-2 rounded-md flex flex-col items-center mb-4 shadow-sm">
                      <img
                        src={img.url}
                        alt={img.original_filename}
                        width="200"
                        className="aspect-square object-cover mb-1"
                      />
                      <h5>
                        {img.original_filename.length > 25
                          ? img.original_filename.slice(0, 25) + '...'
                          : img.original_filename}
                      </h5>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
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
