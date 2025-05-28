// TODO: change supabase logic to cloudinary logic for user avatar - DONE

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CldUploadWidget, getCldImageUrl } from 'next-cloudinary';
import { Button } from '@/components/shared/Button';

export default function Avatar({ uid, url, size, onUpload }) {
  const [uploading, setUploading] = useState(false);
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

  // Fetch the User Profile Pic if the user previously uploaded it
  useEffect(() => {
    if (!uid) return;

    async function fetchExistingImage() {
      try {
        const res = await fetch(`/api/user-profile-pic/${uid}`);

        if (!res.ok) throw new Error('Failed to fetch image by User supabaseId');

        const data = await res.json();
        setFetchedImage(data);
        setSavedImageId(data._id); // Save the ID so the upload logic remains consistent
        console.log('Fetched existing image:', data);
      } catch (err) {
        console.warn('No existing profile image found:', err.message);
      }
    }

    fetchExistingImage();
  }, [uid]);

  // Fetch saved image metadata by id whenever savedImageId changes
  useEffect(() => {
    if (!savedImageId) return;

    async function fetchImageById() {
      try {
        const res = await fetch(`/api/user-profile-pic/${uid}`);

        if (!res.ok) throw new Error('Failed to fetch image by User superbaseId');

        const data = await res.json();
        setFetchedImage(data);
        console.log('Fetched image by ID:', data);
        setUploading(false);
      } catch (err) {
        console.error(err);
      }
    }

    fetchImageById();
  }, [savedImageId]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center gap-2">
        {fetchedImage ? (
          <img
            width={size}
            height={size}
            src={fetchedImage.url}
            alt="Avatar"
            className="rounded-full object-cover"
            style={{ height: size, width: size }}
          />
        ) : (
          //<div className="rounded-full bg-gray-200" style={{ height: size, width: size }} />
          <img
            width={size}
            height={size}
            src={'../../img/profilePicPlaceholder.png'}
            alt="placeholder"
            className="rounded-full object-contain border border-white"
            style={{ height: size, width: size }}
          />
        )}
      </div>

      <CldUploadWidget
        uploadPreset="my-uploads"
        onSuccess={async result => {
          const info = result?.info;
          setUploadedImageInfo(info);
          setUploading(true);
          console.log('UID', uid);
          console.log('Upload Success:', info);

          try {
            // Add Image Metadata to MongoDB
            const response = await fetch('/api/user-profile-pic', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                superbaseId: uid,
                url: info.secure_url,
                caption: info.original_filename,
                updated_at: new Date().toISOString(),
              }),
            });

            const result = await response.json();
            console.log('Result', result);

            if (!response.ok) {
              throw new Error(result.error || 'Failed to update the Profile Pic');
            }

            console.log('✅ Metadata saved to MongoDB:', result.user);
            setSavedImageId(result.user.userProfilePicture._id); // <-- Save the ID here!
          } catch (err) {
            console.error('❌ Error saving metadata:', err.message);
            setUploading(false);
          }
        }}
      >
        {({ open }) =>
          uploading ? (
            <p>Uploading...</p>
          ) : (
            <Button type="submit" onClick={() => open()} className="w-30" variant="secondary" disabled={false}>
              Upload Photo
            </Button>
          )
        }
        {/*<label
            onClick={() => open()}
            className="text-sm text-blue-600 cursor-pointer hover:underline"
            htmlFor="single"
          >
            {uploading ? 'Uploading ...' : 'Upload'}
          </label>*/}
      </CldUploadWidget>
    </div>
  );
}
