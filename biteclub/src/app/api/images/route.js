// src/app/api/images/route.js
import { v2 as cloudinary } from 'cloudinary';
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

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { public_id } = body;

    if (!public_id) {
      return new Response(JSON.stringify({ error: 'Image ID is required' }), { status: 400 });
    }

    const res = await cloudinary.uploader.destroy(public_id);

    if (res.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary');
    }
    return new Response(JSON.stringify({ message: 'Image deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
