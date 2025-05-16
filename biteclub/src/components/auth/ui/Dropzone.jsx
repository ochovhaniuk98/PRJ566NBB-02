"use client";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export function Dropzone() {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    // Allow user to upload business license in image or pdf format
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  // Files Preview. Upload image -> preview image. Upload PDF -> preview PDF name
const thumbs = files.map((file) =>
  file.type.startsWith("image/") ? (
    <div
      key={file.name}
      className="w-24 h-24 border border-gray-300 rounded-md p-1 flex items-center justify-center overflow-hidden bg-white shadow-sm"
    >
      <img
        src={file.preview}
        onLoad={() => URL.revokeObjectURL(file.preview)}
        alt={file.name}
        className="object-contain h-full w-full"
      />
    </div>
  ) : (
    <div
      key={file.name}
      className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded border border-gray-300 shadow-sm"
    >
      <img
        width="16"
        height="16"
        src="https://img.icons8.com/material-rounded/24/upload--v1.png"
        alt="upload icon"
      />
      <span className="break-all">{file.name}</span>
    </div>
  )
);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
      <section className="w-full max-w-xl mx-auto mt-2">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 bg-gray-50 p-6 text-center rounded-md cursor-pointer hover:bg-gray-100 transition"
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-700">
          Drag & drop some files here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Accepts: PNG, JPG, JPEG, PDF | Max size: 10MB)
        </p>
      </div>

      {files.length > 0 && (
        <aside className="mt-4 flex flex-wrap gap-3">{thumbs}</aside>
      )}
    </section>
  );
}
