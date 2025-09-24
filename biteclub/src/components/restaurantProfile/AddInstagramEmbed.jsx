import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { useSubmitExternalReview } from '@/hooks/use-submit-external-review';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function AddInstagramEmbed({ restaurantId, userId, onClose }) {
  const { embedLink, setEmbedLink, loading, error, handleSubmit } = useSubmitExternalReview({
    restaurantId,
    userId,
    onSuccess: onClose,
  });

  return (
    <div className="fixed inset-0 bg-brand-peach/40 flex items-center justify-center z-[9999] overflow-scroll scrollbar-hide w-full h-full ">
      <div className="relative bg-transparent md:p-8 p-2 w-2xl min-h-fit ">
        <div className="bg-brand-green-lite w-full font-primary rounded-t-lg flex gap-x-2 cursor-pointer p-3 font-semibold shadow-md">
          <FontAwesomeIcon icon={faInstagram} className={`icon-xl text-white`} />
          Add Instagram Post
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-md shadow-md w-full ">
          <div className="font-secondary text-4xl mb-4">Add Instagram Post</div>

          <div>
            <Label htmlFor="instaLink">
              <h4>Link</h4>
            </Label>
            <Input
              id="instaLink"
              name="instaLink"
              type="text"
              placeholder="https://www.instagram.com/p/DCZlEDqy2to/"
              value={embedLink}
              onChange={e => setEmbedLink(e.target.value)}
              required
              className="w-full"
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-600 mt-2">{error}</p>}

          <div className="flex justify-end gap-2 mt-8">
            <Button type="submit" className="w-30" variant="default" disabled={loading}>
              {loading ? 'Posting...' : 'Add'}
            </Button>
            <Button type="button" className="w-30" onClick={onClose} variant="secondary" disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
