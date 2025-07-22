'use client';

// src/app/(auth)/account-setup/business/page.jsx
import { useEffect, useState } from 'react';
// import { createClient } from '@/lib/auth/client';
import { useUser } from '@/context/UserContext';

import { useRouter } from 'next/navigation';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';
import { CldUploadWidget } from 'next-cloudinary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faUtensils } from '@fortawesome/free-solid-svg-icons';

export default function BusinessSetupForm() {
  const router = useRouter();
  const { user } = useUser();

  // const [user, setUser] = useState(null);
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
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const supabase = createClient();
  //     const { data, error } = await supabase.auth.getUser();
  //     if (!error) setUser(data.user);
  //   };
  //   fetchUser();
  // }, []);

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
    <div
      className="h-full min-h-screen flex bg-cover bg-[length:100%]"
      style={{
        backgroundImage: "url('/img/greenOnYellowBG.png')",
        backgroundPosition: '-2rem',
      }}
    >
      <div className="w-1/2 px-12 py-16 h-full min-h-screen ml-auto bg-white flex flex-col ">
        <div className="form-widget flex flex-col space-y-4 bg-brand-yellow-extralite w-lg h-content m-auto px-14 py-16 shadow-md">
          <div className="aspect-square w-fit p-2 bg-brand-yellow border border-brand-navy rounded-full mx-auto flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faUtensils} className={`icon-lg text-brand-navy`} />
          </div>
          <h2 className="text-center">Ready to reach new customers?</h2>

          {/* --- Hidden Email Field (bound to Supabase user) --- */}
          <Input id="email" type="text" value={user?.email || ''} disabled className="w-full hidden" />

          {/* --- Restaurant Search Input --- */}
          <div className="relative w-full mt-4">
            <Label htmlFor="restaurantName">Search your restaurant by NAME or LOCATION</Label>
            <Input
              id="restaurantQuery"
              type="text"
              value={restaurantQuery}
              onChange={e => setRestaurantQuery(e.target.value)}
              className={`w-full ${results.length > 0 && 'm-0 mt-2 rounded-b-none rounded-t-md'}`}
              placeholder="e.g. Pomegranate or College Street"
              required
            />

            {/* --- Autocomplete Result Dropdown --- */}
            {results.length > 0 && (
              <ul className="absolute border border-t-0 border-brand-blue rounded-b bg-white mt-[1px] max-h-max h-90 w-full overflow-y-auto z-10 ">
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
                    <div className="flex flex-col">
                      <span className="font-medium text-brand-navy">{r.name}</span>
                      <span className="text-sm text-gray-600">{r.location}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* --- Confirmed Restaurant Preview --- */}

            <div className="text-sm font-medium font-primary text-center mt-2 text-brand-grey border-2 border-dashed border-brand-yellow-lite py-6 px-3 bg-brand-yellow-extralite cursor-default">
              Selected Restaurant
              <Label>Name</Label>
              <div className=" w-full border-2 border-brand-yellow-lite rounded-md my-2 mb-4 px-3 py-2 text-center bg-brand-yellow-lite">
                {restaurantName && restaurantLocation ? (
                  <h5 className="uppercase">{restaurantName}</h5>
                ) : (
                  <h5 className="text-brand-grey">{'Select your restaurant above.'}</h5>
                )}
              </div>
              <Label>Location</Label>
              <div className="w-full  border-2 border-brand-yellow-lite rounded-md my-2 px-3 py-2 text-center bg-brand-yellow-lite">
                {restaurantName && restaurantLocation ? (
                  <h5>{restaurantLocation.length > 43 ? restaurantLocation.slice(0, 43) : restaurantLocation}</h5>
                ) : (
                  <h5 className="text-brand-grey">
                    Select your restaurant above.
                    <br />
                  </h5>
                )}
              </div>
            </div>

            {/* --- Business License Upload --- */}
            <div>
              <section className="flex flex-col items-center">
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
                      <Label className="w-full border-t-1 border-brand-grey-lite mt-6 pt-6 leading-normal">
                        Please upload a copy of your business license. We will verify your restaurant within 2-3 days.
                      </Label>
                      <button
                        onClick={() => open()}
                        className="border-1 border-brand-peach bg-brand-peach p-2 px-6 my-6 font-primary font-medium shadow-sm text-sm text-brand-navy text-center rounded-md cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faCloudArrowUp} className={`icon-lg text-brand-navy mr-2`} />
                        Upload Business License
                      </button>
                      {uploadedLicenseInfo?.original_filename && (
                        <span className="mt-2 flex items-center gap-2">
                          <img
                            width="24"
                            height="24"
                            src="https://img.icons8.com/material-outlined/24/cloud-checked.png"
                            alt="cloud-checked"
                          />
                          <p className="text-sm text-brand-navy">Uploaded: {uploadedLicenseInfo.original_filename}</p>
                        </span>
                      )}
                    </>
                  )}
                </CldUploadWidget>
              </section>
            </div>
          </div>

          {/* --- Submit Button --- */}
          <Button className="w-60 m-auto mt-12" onClick={handleSubmit} variant="default" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>

          {formError && (
            <p className="text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-2 mt-4">{formError}</p>
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
    </div>
  );
}
