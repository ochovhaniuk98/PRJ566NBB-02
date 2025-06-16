import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function EditPhotosModal({
  restaurantId,
  photos,
  setImages,
  showModal,
  setShowModal,
  forBanner = false,
}) {
  const handleRemove = async (public_id, index, object_id) => {
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
      <div className="fixed w-screen h-screen bg-black/50 left-0 top-0 z-200 py-12 px-60">
        <div
          className={`box-border bg-white ${
            forBanner ? 'h-fit' : 'h-full'
          } w-full  rounded-lg  z-210 p-8 flex flex-col shadow-lg`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{forBanner ? 'Delete Banner Photos' : 'Delete Photos'}</h2>
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="icon-2xl text-brand-navy cursor-pointer"
              onClick={() => setShowModal(false)}
            />
          </div>
          <div className="w-full h-full bg-brand-blue-lite  p-4 mt-4 rounded-lg overflow-y-scroll grid grid-cols-4 gap-2 shadow-inner">
            {photos.length === 0 && (
              <div className="col-span-4 text-center text-gray-500">{'No photos available to delete.'}</div>
            )}
            {photos.length > 0 &&
              photos.map((img, i) => {
                return (
                  <div
                    key={i}
                    className="relative bg-white w-fit h-fit p-2 rounded-md flex flex-col items-center mb-4 shadow-sm"
                  >
                    <img src={img.url} alt={img.caption} width="200" className="aspect-square object-cover mb-1" />
                    <h5>{img?.caption.length > 25 ? img?.caption.slice(0, 25) + '...' : img?.caption}</h5>
                    <div className="absolute -top-2 -right-2 aspect-square w-8 bg-white rounded-full shadow-sm"></div>
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="absolute -top-2 -right-2 icon-2xl text-brand-red cursor-pointer hover:text-4xl transition-all duration-300"
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
