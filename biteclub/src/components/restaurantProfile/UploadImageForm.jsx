import { Button } from '../shared/Button';
import ImageUpload from '@/components/imageUpload/imageUpload';

export default function UploadImageForm({ onClose }) {
  return (
    <div className="w-full h-full bg-white fixed flex justify-center space-x-8 pt-16">
      <ImageUpload />
      <div className="flex justify-center gap-2 mb-16">
        <Button type="button" className="w-30" onClick={onClose} variant="secondary" disabled={false}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
