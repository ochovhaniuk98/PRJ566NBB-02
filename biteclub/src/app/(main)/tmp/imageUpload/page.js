const { default: ImageUpload } = require('@/components/imageUpload/imageUpload');

export default function ImageUploadPage() {
  return (
    <div>
      <h1 className="text-5xl text-center font-primary font-bold text-brand-navy mt-50">Image Upload</h1>

      <div className="mt-10">
        <ImageUpload />
      </div>
    </div>
  );
}
