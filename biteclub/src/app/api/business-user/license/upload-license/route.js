// src/app/api/business-user/license/upload-license/route.js
import { updateLicenseForBusinessUser } from '@/lib/db/dbOperations';

// PDF (Business User License) is saved in Cloudinary and metadata will be saved in MongoDB
// POST request to add ODF DOWNLOAD Url to MongoDB (Collection Name: BusinessUser)
// Find the User by the superbaseId and update their License Url
export async function POST(request) {
  try {
    const body = await request.json();
    const { supabaseId, url } = body;

    const user = await updateLicenseForBusinessUser({ supabaseId, url });

    return new Response(JSON.stringify({ message: 'License PDF Updated', user }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
