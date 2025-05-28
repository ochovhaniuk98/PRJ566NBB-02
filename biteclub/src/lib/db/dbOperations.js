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

// Update general user's username and bio
export async function updateGeneralUsername(data) {
  await dbConnect();

  const user = await User.findOneAndUpdate(
    { supabaseId: data.supabaseId },
    {
      username: data.username,
      userBio: data.userBio,
      displayFavouriteRestaurants: data.displayFavouriteRestaurants,
      displayVisitedPlaces: data.displayVisitedPlaces,
    },
    { new: true } // returns the updated user
  );

  return user;
}

// Get general user's username and bio
export async function getGeneralUserProfile({ supabaseId }) {
  await dbConnect();
  const user = await User.findOne({ supabaseId });
  if (!user) return null;
  return { username: user.username, 
    userBio: user.userBio, 
    displayFavouriteRestaurants: user.displayFavouriteRestaurants, 
    displayVisitedPlaces: user.displayVisitedPlaces};
}