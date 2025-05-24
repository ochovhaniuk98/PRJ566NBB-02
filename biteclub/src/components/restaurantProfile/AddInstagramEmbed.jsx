import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { useState } from 'react';

export default function AddInstagramEmbed({ onClose }) {
  const [instaLink, setInstaLink] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const instaLink = formData.get('instaLink');
    console.log(`Form submitted. Value retrieved: ${instaLink}.`);
    onClose();
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-md shadow-md w-md absolute right-0 top-100 border border-brand-yellow-lite"
    >
      <h2 className="mb-4">EMBED INSTAGRAM POST</h2>

      <div>
        {/* address */}
        <Label htmlFor="instaLink">
          <h4>Link</h4>
        </Label>
        <Input
          name="instaLink"
          type="text"
          placeholder="https://www.instagram.com/p/DCZlEDqy2to/"
          value={instaLink}
          onChange={e => setInstaLink(e.target.value)}
          required
          className="w-full"
        />
      </div>
      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-8">
        <Button type="submit" className="w-30" variant="default" disabled={false}>
          Post
        </Button>
        <Button type="button" className="w-30" onClick={onClose} variant="secondary" disabled={false}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
