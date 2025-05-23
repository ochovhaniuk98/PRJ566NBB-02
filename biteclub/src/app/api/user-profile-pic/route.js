// src/app/api/user-profile-pic/route.js
import { updateUserProfilePic } from '@/lib/db/dbOperations';

// Image (User Profile Pic) is saved in Cloudinary and metadata will be saved in MongoDB
// POST request to add image (User Profile Pic) metadata to MongoDB (Collection Name: User)
// Find the User by the superbaseId and update their Profile Picture
export async function POST(request) {
  try {
    const body = await request.json();
    const { superbaseId, url, caption, updated_at } = body;

    const user = await updateUserProfilePic({ superbaseId, url, caption, updated_at });
    console.log('USer user user', user);

    return new Response(JSON.stringify({ message: 'Profile picture updated', user }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
