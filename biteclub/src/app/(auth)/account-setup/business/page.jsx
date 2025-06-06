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
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // --- Restaurant input & search states ---
  const [restaurantQuery, setRestaurantQuery] = useState(''); // What user types to search
  const [restaurantId, setRestaurantId] = useState(''); // Final confirmed restaurant id (objectId)
  const [restaurantName, setRestaurantName] = useState(''); // Final confirmed restaurant name
  const [restaurantLocation, setRestaurantLocation] = useState(''); // Final confirmed restaurant location
  const [results, setResults] = useState([]); // Autocomplete search results
  const [timer, setTimer] = useState(null); // Timer for debounce effect

  // --- License upload states ---
  const [uploadedLicenseInfo, setUploadedLicenseInfo] = useState(null);
  const [licenseDownloadUrl, setLicenseDownloadUrl] = useState(null);

  // --- Fetch user from Supabase on component mount ---
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };
    fetchUser();
  }, []);

  // --- Autocomplete logic: fetch results based on user input (debounced) ---
  useEffect(() => {
    if (!restaurantQuery) return setResults([]);

    if (timer) clearTimeout(timer);

    const newTimer = setTimeout(async () => {
      const res = await fetch(`/api/business-user/restaurants-search?q=${restaurantQuery}`);
      const data = await res.json();
      setResults(data);
    }, 300); // 300ms debounce

    setTimer(newTimer);
  }, [restaurantQuery]);

  // --- Generate downloadable license URL after successful Cloudinary upload ---
  useEffect(() => {
    if (uploadedLicenseInfo?.public_id) {
      const url = `https://res.cloudinary.com/dmcnahm5e/raw/upload/fl_attachment:license/v${uploadedLicenseInfo.version}/${uploadedLicenseInfo.public_id}`;
      setLicenseDownloadUrl(url);
    }
  }, [uploadedLicenseInfo]);

  const handleSubmit = async () => {
    setFormError(''); // clear previous error
    setLoading(true);

    // Validate required fields
    if (!user || !licenseDownloadUrl || !restaurantId) {
      setFormError('Please complete all required fields: upload your business license and select a restaurant.');
      setLoading(false);
      return;
    }

    if (user && licenseDownloadUrl && restaurantId) {
      try {
        // --- 1. Upload license to /upload-license ---
        const licenseResponse = await fetch('/api/business-user/license/upload-license', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supabaseId: user.id,
            url: licenseDownloadUrl,
          }),
        });

        const licenseResult = await licenseResponse.json();
        if (!licenseResponse.ok) {
          throw new Error(licenseResult.error || 'Failed to upload license');
        }
        console.log('✅ License URL saved to MongoDB:', licenseResult);

        // --- 2. Link restaurant ID to business user in /update-id-linkage ---
        const idResponse = await fetch('/api/business-user/update-id-linkage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supabaseId: user.id,
            restaurantId: restaurantId,
          }),
        });

        const idResult = await idResponse.json();
        if (!idResponse.ok) {
          throw new Error(idResult.error || 'Failed to update restaurant linkage');
        }
        console.log('Restaurant ID linked in MongoDB:', idResult);
      } catch (err) {
        console.error('Error saving metadata:', err.message);
        setFormError('An unexpected error occurred. Please try again.');
      }
    } else {
      console.warn('Missing user, license URL, or restaurant ID');
    }

    setLoading(false);
    // router.push('/users/business');
    router.push('/account-setup/business/awaiting-verification');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-green-lite">
      <div className="form-widget max-w-md w-full px-12 py-16 border border-brand-yellow-lite shadow-md rounded-md space-y-4 bg-brand-yellow-extralite flex flex-col justify-center items-stretch">
        <h2 className="text-center">Ready to reach new customers?</h2>

        {/* --- Hidden Email Field (bound to Supabase user) --- */}
        <Input id="email" type="text" value={user?.email || ''} disabled className="w-full hidden" />

        {/* --- Restaurant Search Input --- */}
        <div>
          <Label htmlFor="restaurantName">Search your restaurant by NAME or LOCATION</Label>
          <Input
            id="restaurantQuery"
            type="text"
            value={restaurantQuery}
            onChange={e => setRestaurantQuery(e.target.value)}
            className="w-full"
            placeholder="e.g. Pomegranate or College Street"
          />

          {/* --- Autocomplete Result Dropdown --- */}
          {results.length > 0 && (
            <ul className="border-2 border-brand-blue rounded bg-white mt-1 max-h-48 overflow-y-auto z-10 relative">
              {results.slice(0, 10).map((r, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setRestaurantQuery(`${r.name} — ${r.location}`); // For display only
                    setRestaurantId(r.id);
                    setRestaurantName(r.name); // Save confirmed name
                    setRestaurantLocation(r.location); // Save confirmed location
                    setResults([]); // Hide result dropdown
                  }}
                  className="cursor-pointer hover:bg-gray-100 px-3 py-1"
                >
                  {r.name} — {r.location}
                </li>
              ))}
            </ul>
          )}

          {/* --- Confirmed Restaurant Preview --- */}
          {restaurantName && restaurantLocation && (
            <div className="text-sm mt-2 text-brand-navy">
              <p>
                <strong>Restaurant name:</strong>
                <br />
                {restaurantName}
              </p>
              <p className="mt-1">
                <strong>Restaurant location:</strong>
                <br />
                {restaurantLocation}
              </p>
            </div>
          )}
        </div>

        {/* --- Business License Upload --- */}
        {/* <div>
          <section className="flex flex-col items-center justify-between">
            <CldUploadWidget
              uploadPreset="my-uploads"
              options={{ resourceType: 'raw' }}
              onSuccess={async result => {
                console.log('Upload Success:', result?.info);
                setUploadedLicenseInfo(result?.info);
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="border-2 border-dashed border-brand-blue bg-brand-blue-lite px-6 py-16 text-center rounded-md cursor-pointer w-full"
                >
                  Upload your business license
                </button>
              )}
            </CldUploadWidget>
          </section>
        </div> */}
{/* --- Business License Upload --- */}
<div>
  <section className="flex flex-col items-center justify-between">
    <CldUploadWidget
      uploadPreset="my-uploads"
      options={{ resourceType: 'raw' }}
      onSuccess={async result => {
        console.log('Upload Success:', result?.info);
        setUploadedLicenseInfo(result?.info);
      }}
    >
      {({ open }) => (
        <>
          <button
            onClick={() => open()}
            className="border-2 border-dashed border-brand-blue bg-brand-blue-lite px-6 py-16 text-center rounded-md cursor-pointer w-full"
          >
            Upload your business license
          </button>

          {uploadedLicenseInfo?.original_filename && (
            <p className="mt-2 text-sm text-gray-700">
              Uploaded: {uploadedLicenseInfo.original_filename}
            </p>
          )}
        </>
      )}
    </CldUploadWidget>
  </section>
</div>

        {/* --- Submit Button --- */}
        <Button className="w-full" onClick={handleSubmit} variant="default" disabled={loading}>
          {loading ? 'Submitting...' : 'Update'}
        </Button>

        {formError && (
          <p className="text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-2">{formError}</p>
        )}

        {/* --- Sign Out Link --- */}
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
