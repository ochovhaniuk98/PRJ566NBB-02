import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import NoContentPlaceholder from '../shared/NoContentPlaceholder';

export default function EditPhotosModal({
  restaurantId,
  photos,
  setImages,
  showModal,
  setShowModal,
  forBanner = false,
}) {
  const handleRemove = async (public_id, index, object_id) => {
    if (forBanner && photos?.length <= 1) {
      alert('You must have at least one banner image. Please upload another before deleting this one.');
      return;
    }
    try {
      const res = await fetch('/api/images/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          public_id,
          object_id,
          type: forBanner ? 'restaurant-banner-image' : 'restaurant-image',
        }),
      });

      setImages(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  return (
    showModal && (
      <div className="fixed w-screen h-screen bg-transparent left-0 top-0 z-200 md:p-8 md:px-8 px-0">
        <div
          className={`box-border bg-white ${
            forBanner ? 'h-fit' : 'h-full'
          } w-full  rounded-lg  z-210 md:p-8 p-4 flex flex-col shadow-lg`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{forBanner ? 'Delete Banner Photos' : 'Delete Photos'}</h2>
            <FontAwesomeIcon
              icon={faCircleLeft}
              className="icon-2xl text-brand-navy cursor-pointer"
              onClick={() => setShowModal(false)}
            />
          </div>
          <div className="w-full h-full bg-brand-blue-lite p-4 mt-4 rounded-lg overflow-y-scroll grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 shadow-inner">
            {photos.length === 0 && (
              <NoContentPlaceholder
                contentType="photos"
                iconImgNum={4}
                className="absolute left-1/2 top-1/4 -translate-x-1/2"
              />
            )}
            {photos.length > 0 &&
              photos.map((img, i) => {
                return (
                  <div
                    key={i}
                    className="relative bg-white w-fit h-fit p-2 rounded-md flex flex-col items-center md:mb-4 mb-2 shadow-sm"
                  >
                    <img src={img.url} alt={img.caption} width="200" className="aspect-square object-cover mb-1" />
                    <h5>{img?.caption.length > 25 ? img?.caption.slice(0, 25) + '...' : img?.caption}</h5>
                    <div className="absolute -top-1 right-0 aspect-square w-8 bg-white rounded-full shadow-sm"></div>
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="absolute -top-1 right-0 icon-2xl text-brand-red cursor-pointer hover:text-4xl transition-all duration-300"
                      onClick={() => handleRemove(img.public_id, i, img._id)}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    )
  );
}
