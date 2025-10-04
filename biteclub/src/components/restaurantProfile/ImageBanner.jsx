import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import RestaurantImageUpload from './RestaurantImageUpload';
import EditPhotosModal from './EditPhotosModal';

export default function ImageBanner({ restaurantId, images, setImages, isOwner = false }) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [gridImages, setGridImages] = useState([]);

  useEffect(() => {
    function getGridImages(images) {
      if (images.length === 1) {
        // Repeat the single image 4 times
        return Array(4).fill(images[0]);
      }
      if (images.length < 4) {
        // Show all images, then repeat from the start to fill 4 slots
        const result = [];
        for (let i = 0; i < 4; i++) {
          result.push(images[i % images.length]);
        }
        return result;
      }
      if (images.length === 4) {
        // Use all 4 images as they are
        return images;
      }
      // More than 4 images: randomly pick 4 unique images
      const shuffled = [...images].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    }
    setGridImages(getGridImages(images));
  }, [images]);

  return (
    <>
      <div className="grid grid-cols-4 gap-0 relative w-full border-b border-brand-grey-lite">
        {gridImages.map((img, i) => (
          <img key={i} src={img?.url} alt={img?.caption} className="w-full md:h-80 h-40 object-cover" />
        ))}
        {/* add/delete banner images icons */}
        {isOwner && (
          <div className="absolute  bottom-2 right-2 flex gap-2">
            <div className=" flex justify-center items-center rounded-full h-8 w-8 bg-brand-yellow-lite/80 cursor shadow-md">
              <RestaurantImageUpload
                restaurantId={restaurantId}
                images={images}
                setImages={setImages}
                forBanner={true}
              />
            </div>
            <div className="flex justify-center items-center rounded-full h-8 w-8 bg-brand-yellow-lite/80 cursor shadow-md">
              <FontAwesomeIcon
                icon={faTrashCan}
                className="icon-lg text-brand-navy cursor-pointer"
                onClick={() => setShowPhotoModal(true)}
              />
            </div>
          </div>
        )}
      </div>{' '}
      {/* show delete banner images form */}
      {isOwner && showPhotoModal && (
        <EditPhotosModal
          restaurantId={restaurantId}
          photos={images}
          setImages={setImages}
          showModal={showPhotoModal}
          setShowModal={setShowPhotoModal}
          forBanner={true}
        />
      )}
    </>
  );
}
