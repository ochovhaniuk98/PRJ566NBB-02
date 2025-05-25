import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

export default function EditPhotosModal({ photos = [], showModal, setShowModal }) {
  const [localPhotos, setLocalPhotos] = useState([]);

  useEffect(() => {
    if (showModal) {
      setLocalPhotos(photos);
    }
  }, [showModal, photos]);

  // removes photos LOCALLY/ON UI only
  const handleRemove = indexToRemove => {
    setLocalPhotos(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    showModal && (
      <div className="fixed w-screen h-screen bg-black/50 left-0 top-0 z-200 py-12 px-80  ">
        <div className="box-border bg-white h-full w-full  rounded-lg  z-210 p-8 flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Delete Photos</h2>
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="icon-2xl text-brand-navy cursor-pointer"
              onClick={() => setShowModal(false)}
            />
          </div>
          <div className="w-full h-full bg-brand-blue-lite  p-4 mt-4 rounded-lg overflow-y-scroll grid grid-cols-4 gap-2 shadow-inner">
            {localPhotos.length > 0 &&
              localPhotos.map((img, i) => {
                return (
                  <div
                    key={i}
                    className="relative bg-white w-fit h-fit p-2 rounded-md flex flex-col items-center mb-4 shadow-sm"
                  >
                    <img src={img.url} alt={img.caption} width="200" className="aspect-square object-cover mb-1" />
                    <h5>{img.caption.length > 25 ? img.caption.slice(0, 25) + '...' : img.caption}</h5>
                    <div className="absolute -top-2 -right-2 aspect-square w-8 bg-white rounded-full"></div>
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="absolute -top-2 -right-2 icon-2xl text-brand-red cursor-pointer"
                      onClick={() => handleRemove(i)}
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
