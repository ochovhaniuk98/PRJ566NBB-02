'use client';

import { useEffect, useState } from 'react';
import { CldUploadWidget, getCldImageUrl } from 'next-cloudinary';

export default function ImageUpload() {
  const [uploadedImageInfo, setUploadedImageInfo] = useState(null);
  const [savedImageId, setSavedImageId] = useState(null);
  const [fetchedImage, setFetchedImage] = useState(null);

  useEffect(() => {
    if (uploadedImageInfo?.public_id) {
      const url = getCldImageUrl({
        width: 960,
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

  return (
    <section className="flex flex-col items-center justify-between">
      <CldUploadWidget
        uploadPreset="my-uploads"
        onSuccess={async result => {
          const info = result?.info;
          setUploadedImageInfo(info);
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
          <button onClick={() => open()} className="bg-blue-500 text-white px-4 py-2 rounded">
            Upload an Image
          </button>
        )}
      </CldUploadWidget>

      {/* Display fetched image metadata */}
      {fetchedImage && (
        <div className="mt-6">
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
          <img src={fetchedImage.url} alt={fetchedImage.caption} width="600" />
        </div>
      )}
    </section>
  );
}
