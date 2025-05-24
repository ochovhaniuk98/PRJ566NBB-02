import { Button } from '../shared/Button';
import ImageUpload from '@/components/imageUpload/imageUpload';

export default function UploadImageForm({ onClose }) {
  return (
    <div className=" w-full h-full fixed p-16">
      <ImageUpload buttonType={'iconTab'} />
      <div className="absolute bottom-2 right-12  my-4 mx-8">
        <Button type="button" className="w-30" onClick={onClose} variant="secondary" disabled={false}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
