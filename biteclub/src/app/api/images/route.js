// src/app/api/images/route.js
import { postTestCloudinaryImage } from '@/lib/db/dbOperations';

// For now it is done for testing purposes - Image is saved in Cloudinary and metadata will be saved in MongoDB
// POST request to add image metadata to MongoDB (Testing Collection Name: TestCloudinaryImage)
// src/app/api/images/route.js
export async function POST(request) {
  try {
    const body = await request.json();
    const { url, caption, updated_at } = body;

    const result = await postTestCloudinaryImage({ url, caption, updated_at });

    return new Response(JSON.stringify({ message: 'Image saved', image: result }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
