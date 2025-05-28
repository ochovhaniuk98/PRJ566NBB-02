'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@/components/auth/ui/Dropzone';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';

export default function BusinessSetupForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: Store restaurantName and uploaded file to MongoDB / Cloudinary
    router.push('/users/business');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-green-lite">
      <div className="form-widget max-w-md w-full px-12 py-16 border border-brand-yellow-lite shadow-md rounded-md space-y-4 bg-brand-yellow-extralite flex  flex-col justify-center items-stretch">
        <h2 className="text-center">Ready to reach new customers?</h2>
        <div>
          {/* 
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>*/}
          <Label htmlFor="email" className={'hidden'}>
            Email
          </Label>

          {/* 
          <input
            id="email"
            type="text"
            value={user?.email || ''}
            disabled
            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 cursor-not-allowed"
          />*/}
          <Input id="email" type="text" value={user?.email || ''} disabled className="w-full hidden" />
        </div>

        <div>
          {/*<label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
            Enter Restaurant Name
          </label> */}
          <Label htmlFor="restaurantName">Restaurant Name</Label>
          {/* 
          <input
            id="restaurantName"
            type="text"
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />*/}
          <Input id="restaurantName" type="text" className="w-full" />
        </div>

        <div>
          {/** 
          <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700">
            Upload your business license
          </label>*/}
          <Label htmlFor="businessLicense">Upload your business license.</Label>
          <Dropzone onDrop={files => console.log(files)} />
        </div>

        {/*   <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Update'}
        </button> */}
        <Button className="w-full" onClick={handleSubmit} variant="default" disabled={loading}>
          {loading ? 'Submitting...' : 'Update'}
        </Button>

        <form action="/signout" method="post" className="relative">
          <button
            className="text-sm text-brand-navy font-primary font-medium p-2 rounded-md absolute -left-8 -bottom-15 underline cursor-pointer"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
