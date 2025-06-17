// src/app/api/images/route.js
import { v2 as cloudinary } from 'cloudinary';
import { removeRestaurantImage, postTestCloudinaryImage } from '@/lib/db/dbOperations';

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

    // type can be 'restaurant-image' or 'restaurant-banner-image'
    const { restaurantId, public_id, object_id, type } = body;

    if ((!public_id && !object_id) || !restaurantId) {
      return new Response(JSON.stringify({ error: 'Missing required fields: restaurantId, public_id, or object_id' }), {
        status: 400,
      });
    }

    if (public_id) {
      // Check if public_id is provided and process the deletion from Cloudinary
      const res = await cloudinary.uploader.destroy(public_id);

      if (res.result !== 'ok' && res.result !== 'not_found') {
        throw new Error('Failed to delete image from Cloudinary');
      }
    }

    // Delete the image metadata from MongoDB
    const resMongoDB = await removeRestaurantImage(restaurantId, public_id, object_id, type);

    if (!resMongoDB) {
      throw new Error('Failed to delete image metadata from MongoDB');
    }

    return new Response(JSON.stringify({ message: 'Image deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
