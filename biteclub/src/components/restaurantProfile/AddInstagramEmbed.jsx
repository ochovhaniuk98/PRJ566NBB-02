import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { useSubmitExternalReview } from '@/hooks/use-submit-external-review';

export default function AddInstagramEmbed({ restaurantId, userId, onClose }) {
  const { embedLink, setEmbedLink, loading, error, handleSubmit } = useSubmitExternalReview({
    restaurantId,
    userId,
    onSuccess: onClose,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-md shadow-md w-md absolute right-0 top-100 border border-brand-yellow-lite"
    >
      <h2 className="mb-4">EMBED INSTAGRAM POST</h2>

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
          {loading ? 'Posting...' : 'Post'}
        </Button>
        <Button type="button" className="w-30" onClick={onClose} variant="secondary" disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
