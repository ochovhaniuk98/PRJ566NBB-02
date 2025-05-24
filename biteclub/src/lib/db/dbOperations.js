import dbConnect from './dbConnect';

import {
  User,
  Photo,
  Comment,
  InstagramPost,
  BlogPost,
  InternalReview,
  ExternalReview,
  CreditCard,
  Payment,
  ItemDetail,
  Order,
  ChallengeStep,
  AvailableChallengeDetail,
  ActivateChallengeDetail,
  Challenge,
  PointValueDetail,
  Point,
  Event,
  Announcement,
  MenuItem,
  BusinessUser,
  BusinessHours,
  Restaurant,
  TestCloudinaryImage,
} from '../../lib/model/dbSchema';

export async function getAllRestaurants() {
  await dbConnect();
  const restaurants = await Restaurant.find({});
  return restaurants;
}

export async function getRestaurantById(id) {
  await dbConnect();
  const restaurant = await Restaurant.findOne({ _id: id });
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  return restaurant;
}

// Post to TestCloudinaryImage Collection
export async function postTestCloudinaryImage(data) {
  await dbConnect();

  const newImage = new TestCloudinaryImage({
    url: data.url,
    caption: data.caption,
    updated_at: data.updated_at || new Date(),
  });

  const savedImage = await newImage.save();
  return savedImage;
}

// Get by id from TestCloudinaryImage Collection
export async function getImageById(id) {
  await dbConnect();
  const image = await TestCloudinaryImage.findOne({ _id: id });

  if (!image) {
    throw new Error('Image by id not found');
  }
  return image;
}

// Post Profile Pic to Users Collection
// Get User by superbase id and update the Profile Pic
export async function updateUserProfilePic(data) {
  await dbConnect();

  const user = await User.findOneAndUpdate(
    { supabaseId: data.superbaseId },
    {
      userProfilePicture: {
        url: data.url,
        caption: data.caption,
        updated_at: data.updated_at || new Date(),
      },
    },
    { new: true } // return the updated user
  );

  return user;
}

// Get User Profile Pic by User SuperbaseId
export async function getProfilePicByUserSuperbaseId(supabaseId) {
  await dbConnect();

  const user = await User.findOne({ supabaseId: supabaseId });

  if (!user) {
    throw new Error('User not found');
  }

  const image = user.userProfilePicture;

  if (!image) {
    throw new Error('Image does not exist');
  }

  return image;
}

// This function is NOT working...
// Get UserType by Supabase ID
// for client side, we use api/get-user-type
export async function getUserTypeBySupabaseId(supabaseId) {
    await dbConnect();
    console.log('✅✅✅✅✅✅✅✅✅✅ Connected to MongoDB');
    const generalUser = await User.findOne({ supabaseId: supabaseId });
    const businessUser = await BusinessUser.findOne({ supabaseId: supabaseId });

    if (generalUser && businessUser) {
      throw new Error('Invalid user: exists in both collections');
    }

    if (generalUser) return 'general';
    if (businessUser) return 'business';

    return null;

}
