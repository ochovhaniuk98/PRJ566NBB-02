import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import InstagramEmbed from './InstagramEmbed';
import { getExternalReviewsByTheRestaurantId, removeExternalReview } from '@/lib/db/dbOperations';
import { useEffect, useState } from 'react';
import NoContentPlaceholder from '../shared/NoContentPlaceholder';

export default function DeleteInstagramForm({ restaurantId, setShowDeleteInstaModal }) {
  const [instagramEmbeds, setInstagramEmbeds] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchInstagramEmbeds = async () => {
      try {
        const data = await getExternalReviewsByTheRestaurantId(restaurantId);
        setInstagramEmbeds(data);
      } catch (error) {
        console.error('Error fetching Instagram embeds:', error);
      }
    };
    fetchInstagramEmbeds();
  }, [restaurantId]);

  const handleRemoveEmbed = async embedId => {
    try {
      const response = await removeExternalReview(embedId);
      if (!response) throw new Error('Failed to remove embed');
      setInstagramEmbeds(prev => prev.filter(embed => embed._id !== embedId));

      setMessageType('success');
      setMessage('Embed removed successfully.');
      setTimeout(() => setMessage(null), 1100);
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to remove embed. Please try again.');
      setTimeout(() => setMessage(null), 1100);
    }
  };

  return (
    <div className="fixed w-screen h-screen bg-transparent left-0 top-0 z-200 md:p-8 md:px-8 px-0">
      <div className={`box-border bg-white h-full w-full  rounded-lg  z-210 md:p-8 p-4 flex flex-col shadow-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Delete Instagram Embeds</h2>
          <div className="flex justify-between items-center gap-8">
            <FontAwesomeIcon
              icon={faCircleLeft}
              className="icon-2xl text-brand-navy cursor-pointer"
              onClick={() => setShowDeleteInstaModal(false)}
            />
          </div>
        </div>
        <div className="w-full h-full bg-brand-blue-lite p-4 mt-4 rounded-lg overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 gap-2 shadow-inner relative">
          {instagramEmbeds.length === 0 && (
            <NoContentPlaceholder
              contentType="Instagram embeds"
              className="absolute left-1/2 top-1/4 -translate-x-1/2"
            />
          )}
          {instagramEmbeds.length > 0 &&
            instagramEmbeds.map(embed => (
              <div key={embed._id} className="relative bg-white rounded-md shadow-sm p-2">
                <InstagramEmbed url={embed?.content?.embedLink} forEditRestaurant={true} />
                {/* Close Icon */}
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="absolute -top-2 -right-2 icon-2xl text-brand-red cursor-pointer hover:text-4xl transition-all duration-300 bg-white rounded-full shadow-sm"
                  onClick={() => handleRemoveEmbed(embed._id)}
                />
              </div>
            ))}
        </div>
      </div>
      {/* Message Display */}
      {message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white z-300 ${
            messageType === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
