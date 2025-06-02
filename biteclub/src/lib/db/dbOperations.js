'use server';
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

// ==================
// FOR BUSINESS USERS
// ==================

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

export async function getRestaurantReviews(id) {
  await dbConnect();

  let reviews = await InternalReview.find({ restaurant_id: id });
  let externalReviews = await ExternalReview.find({ restaurant_id: id });

  // Wait for all user data to be fetched and attached
  const updatedReviews = await Promise.all(
    reviews.map(async review => {
      const user = await User.findOne({ _id: review.user_id });
      if (user) {
        review = review.toObject();
        review.user_id = user.username;
        review.user_pic = user.userProfilePicture;
      }
      return review;
    })
  );

  return {
    internalReviews: updatedReviews,
    externalReviews: externalReviews,
  };
}

export async function updateRestaurant(id, data) {
  await dbConnect();

  const restaurant = await Restaurant.findOneAndUpdate(
    { _id: id },
    { $set: data }, // Using $set to allow partial updates
    { new: true }
  );

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  return restaurant;
}

export async function addExternalReview(embedLink, userId, restaurantId) {
  await dbConnect();

  const newReview = new ExternalReview({
    content: { embedLink },
    user_id: userId,
    restaurant_id: restaurantId,
  });

  const savedReview = await newReview.save();
  return savedReview;
}

export async function getBusinessUserRestaurantId({ supabaseId }) {
  await dbConnect();
  const user = await BusinessUser.findOne({ supabaseId });
  if (!user) return null;
  return { restaurantId: user.restaurantId.toString() ?? null };
}

// Update license for Business User
export async function updateLicenseForBusinessUser(data) {
  await dbConnect();

  const user = await BusinessUser.findOneAndUpdate(
    { supabaseId: data.superbaseId },
    { licenseFileUrl: data.url },
    { new: true } // returns the updated user
  );

  return user;
}

// =================
// FOR GENERAL USERS
// =================

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

// Get general user's username and bio (for Account-setUp Page, Setting page)
export async function getGeneralUserProfileBySupabaseId({ supabaseId }) {
  await dbConnect();
  const user = await User.findOne({ supabaseId });
  if (!user) return null;
  return {
    username: user.username,
    userBio: user.userBio,
    displayFavouriteRestaurants: user.displayFavouriteRestaurants,
    displayVisitedPlaces: user.displayVisitedPlaces,
  };
}

// Return the whole user profile (for User Dashboard, and Public)
export async function getGeneralUserProfileByMongoId(mongoId) {
  await dbConnect();
  // const user = await User.findOne({ _id: mongoId });
  const user = await User.findById(mongoId); // Use findById for _id
  if (!user) return null;
  return user; // Returns entire User document
}

export async function getGeneralUserMongoIDbySupabaseId({ supabaseId }) {
  await dbConnect();
  const user = await User.findOne({ supabaseId });
  if (!user) return null;
  return user._id.toString();
}

// ==================
// CLOUDINARY RELATED
// ==================

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
