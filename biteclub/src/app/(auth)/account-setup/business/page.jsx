'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';
import { CldUploadWidget } from 'next-cloudinary';

export default function BusinessSetupForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(false);

  const [uploadedLicenseInfo, setUploadedLicenseInfo] = useState(null);
  const [licenseDownloadUrl, setLicenseDownloadUrl] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (uploadedLicenseInfo?.public_id) {
      console.log('public_id:', uploadedLicenseInfo.public_id);
      console.log('version:', uploadedLicenseInfo.version);

      const url = `https://res.cloudinary.com/dmcnahm5e/raw/upload/fl_attachment:license/v${uploadedLicenseInfo.version}/${uploadedLicenseInfo.public_id}`;

      setLicenseDownloadUrl(url);

      console.log('Generated License URL:', url);
    }
  }, [uploadedLicenseInfo]);

  const handleSubmit = async () => {
    setLoading(true);

    // The Image has been stored to Cloudinary at this point
    // Store License Download Url in Business User (MongoDB)
    if (user && licenseDownloadUrl) {
      try {
        // Add License Download Url to MongoDB
        const response = await fetch('/api/business-user/license/upload-license', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            superbaseId: user.id,
            url: licenseDownloadUrl,
          }),
        });

        const result = await response.json();
        console.log('Result', result);

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update the License PDF');
        }

        console.log('✅ Metadata saved to MongoDB:', result);
      } catch (err) {
        console.error('❌ Error saving metadata:', err.message);
      }
    }

    router.push('/users/business');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-green-lite">
      <div className="form-widget max-w-md w-full px-12 py-16 border border-brand-yellow-lite shadow-md rounded-md space-y-4 bg-brand-yellow-extralite flex  flex-col justify-center items-stretch">
        <h2 className="text-center">Ready to reach new customers?</h2>
        <div>
          <Label htmlFor="email" className={'hidden'}>
            Email
          </Label>

          <Input id="email" type="text" value={user?.email || ''} disabled className="w-full hidden" />
        </div>

        <div>
          <Label htmlFor="restaurantName">Restaurant Name</Label>

          <Input
            id="restaurantName"
            type="text"
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <section className="flex flex-col items-center justify-between">
            <CldUploadWidget
              uploadPreset="my-uploads"
              options={{
                resourceType: 'raw', // Set here too
              }}
              onSuccess={async result => {
                console.log('Upload Success:', result?.info);
                setUploadedLicenseInfo(result?.info);
              }}
            >
              {({ open }) => (
                <button onClick={() => open()} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Upload your business license
                </button>
              )}
            </CldUploadWidget>
          </section>
        </div>

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
