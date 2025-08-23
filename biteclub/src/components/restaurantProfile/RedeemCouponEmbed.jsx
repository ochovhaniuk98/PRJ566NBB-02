import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
//import { useSubmitExternalReview } from '@/hooks/use-submit-external-review';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';

export default function AddInstagramEmbed({ restaurantId, userId, onClose }) {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const submitCoupon = async () => {
    console.log(couponCode);
    setLoading(true);
    const res = await fetch('/api/redeemCoupon', {
      method: 'POST',
      body: JSON.stringify({
        couponCode: couponCode.toLowerCase().trim(),
      }),
    });
    if (res.status == 200) {
      const data = await res.json();
      setError(`Successfully redeemed $${data.value} coupon!`);
      setTimeout(() => {
        setError(null);
        onClose();
      }, 5000);
    } else {
      setError('Coupon not found');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-brand-peach/40 flex items-center justify-center z-[9999] overflow-scroll scrollbar-hide w-full h-full ">
      <div className="relative bg-transparent p-8 w-2xl min-h-fit ">
        <div className="bg-brand-green-lite w-full font-primary rounded-t-lg flex gap-x-2 cursor-pointer p-3 font-semibold shadow-md">
          <FontAwesomeIcon icon={faGift} className={`icon-xl text-white`} />
          Confirm Coupon
        </div>
        <div className="bg-white p-8 rounded-b-md shadow-md w-full">
          <div className="font-secondary text-4xl mb-4">Confirm Coupon</div>

          <div>
            <Label htmlFor="couponCode">
              <h4>Coupon Code</h4>
            </Label>
            <Input
              id="couponCode"
              name="couponCode"
              type="text"
              placeholder="xxxxxxxxxxxxxx"
              onChange={e => setCouponCode(e.target.value)}
              required
              className="w-full"
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-600 mt-2">{error}</p>}

          <div className="flex justify-end gap-2 mt-8">
            <Button type="submit" className="w-30" variant="default" disabled={loading} onClick={submitCoupon}>
              {loading ? 'Confirming...' : 'Confirm'}
            </Button>
            <Button type="button" className="w-30" onClick={onClose} variant="secondary" disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
