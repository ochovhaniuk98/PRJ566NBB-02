'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import SingleTabWithIcon from '../shared/SingleTabWithIcon';

export default function RestaurantImageUpload({ restaurantId, images, setImages, forBanner = false }) {
  return (
    <>
      <CldUploadWidget
        uploadPreset="my-uploads"
        options={{
          resourceType: 'image',
          maxFiles: forBanner ? 4 : 20,
          multiple: true,
        }}
        onQueuesEnd={async result => {
          const imageUploadResults = result.info.files.map(file => ({
            ...(file.uploadInfo || {}),
            caption: file.uploadInfo.original_filename || 'Uploaded Image',
          }));
          setImages(prevImages => {
            const combinedImages = [...prevImages, ...imageUploadResults];

            (async () => {
              try {
                const res = await fetch(`/api/restaurants/${restaurantId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(forBanner ? { bannerImages: combinedImages } : { images: combinedImages }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error('Failed to update images in DB');
                console.log('Images updated in DB:', data);
              } catch (error) {
                console.error('Error updating images:', error);
              }
            })();
            return combinedImages;
          });
        }}
      >
        {({ open }) =>
          forBanner ? (
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="icon-lg text-brand-navy cursor-pointer"
              onClick={() => {
                open();
              }}
            />
          ) : (
            <SingleTabWithIcon
              icon={faHeart}
              detailText={'Add Photo'}
              onClick={() => {
                open();
              }}
            />
          )
        }
      </CldUploadWidget>
    </>
  );
}
