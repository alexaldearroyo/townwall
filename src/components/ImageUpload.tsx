'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { CldImage } from 'next-cloudinary';

export default function ImageUpload({
  setImageUrl,
}: {
  setImageUrl: (url: string) => void;
}) {
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = (result: any) => {
    setImage(result.info.secure_url);
    setImageUrl(result.info.secure_url);
  };

  return (
    <div className="image-upload">
      {image ? (
        <CldImage src={image} width="300" height="300" crop="fill" alt="" />
      ) : (
        <CldUploadWidget
          uploadPreset="your_upload_preset"
          onUpload={handleUpload}
        >
          {({ open }) => (
            <button onClick={() => open()} className="upload-button">
              Upload Image
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
