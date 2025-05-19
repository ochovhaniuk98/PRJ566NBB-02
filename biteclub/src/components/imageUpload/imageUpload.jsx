'use client';

import { useEffect, useState } from 'react';
import { CldUploadWidget, getCldImageUrl } from 'next-cloudinary';

export default function ImageUpload() {
  const [uploadedImageInfo, setUploadedImageInfo] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    if (uploadedImageInfo?.public_id) {
      const url = getCldImageUrl({
        width: 960,
        height: 600,
        src: uploadedImageInfo.public_id,
      });
      setImageURL(url);
      console.log('Generated URL:', url);
    }
  }, [uploadedImageInfo]);

  return (
    <section className="flex flex-col items-center justify-between">
      <CldUploadWidget
        uploadPreset="my-uploads"
        onSuccess={result => {
          setUploadedImageInfo(result?.info);
          console.log('Upload Success:', result?.info);
        }}
      >
        {({ open }) => (
          <button onClick={() => open()} className="bg-blue-500 text-white px-4 py-2 rounded">
            Upload an Image
          </button>
        )}
      </CldUploadWidget>

      {imageURL && (
        <div className="mt-6">
          <p>✅ Uploaded!</p>
          <p>
            <strong>URL:</strong> {imageURL}
          </p>
          <img src={imageURL} alt="Uploaded" width="400" />
        </div>
      )}
    </section>
  );
}
