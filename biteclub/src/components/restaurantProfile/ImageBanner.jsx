import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlusCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import RestaurantImageUpload from './RestaurantImageUpload';
import EditPhotosModal from './EditPhotosModal';

export default function ImageBanner({ restaurantId, images, setImages, isOwner = false }) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-4 gap-0 relative">
        {images.map((elem, i) => (
          <img key={i} src={elem.url} alt={elem.caption} className="w-full h-80 object-cover" />
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
        <EditPhotosModal photos={images} showModal={showPhotoModal} setShowModal={setShowPhotoModal} forBanner={true} />
      )}
    </>
  );
}
