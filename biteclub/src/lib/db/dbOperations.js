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
import mongoose from 'mongoose';

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

// "Favourte Restaurant" Related
// Calculate the number of likes and display to restaurant page
export async function getRestaurantNumOfFavourites(restaurantId) {
  await dbConnect();
  const count = await User.countDocuments({
    favouriteRestaurants: { $in: [restaurantId] },
  });
  return count;
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

export async function removeRestaurantImage(restaurantId, image_public_id, image_object_id, type) {
  await dbConnect();

  const imagesField = type === 'restaurant-image' ? 'images' : 'bannerImages';
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  if (!restaurant[imagesField]) {
    throw new Error(`Field ${imagesField} not found`);
  }

  const updatedImages = restaurant[imagesField].filter(image => {
    const publicIdMatches = image.public_id === image_public_id;
    const objectIdMatches = image._id && image._id.toString() === image_object_id?.toString();
    return !(publicIdMatches || objectIdMatches);
  });

  if (updatedImages.length === restaurant[imagesField].length) {
    console.warn('Image not found for deletion:', image_public_id, image_object_id);
  }

  restaurant[imagesField] = updatedImages;
  const updatedRestaurant = await restaurant.save();

  return !!updatedRestaurant;
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

export async function addInternalReview(data) {
  await dbConnect();

  const { body, title, rating, photos, userId, restaurantId } = data;

  const newReview = new InternalReview({
    body,
    title,
    rating,
    date_posted: new Date(),
    comments: [],
    photos: photos || [],
    likes: { count: 0, users: [] },
    dislikes: { count: 0, users: [] },
    user_id: userId,
    restaurant_id: restaurantId,
  });

  const savedReview = await newReview.save();
  if (!savedReview) {
    throw new Error('Failed to save internal review');
  }
  return JSON.parse(JSON.stringify(savedReview));
}

export async function getBusinessUserRestaurantId({ supabaseId }) {
  await dbConnect();
  const user = await BusinessUser.findOne({ supabaseId });
  if (!user) return null;
  // return { restaurantId: user.restaurantId.toString() ?? null };
  return { restaurantId: user.restaurantId ? user.restaurantId.toString() : null }; // safe version
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

// Check if the business user is verified
export async function getBusinessUserVerificationStatus({ supabaseId }) {
  await dbConnect();
  const user = await BusinessUser.findOne({ supabaseId }, 'verificationStatus');
  if (!user) return null;
  return user.verificationStatus;
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
      displayFavouriteBlogPosts: data.displayFavouriteBlogPosts,
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
    displayFavouriteBlogPosts: user.displayFavouriteBlogPosts,
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
  const user = await User.findOne({ supabaseId }).select('_id').lean();
  return user?._id?.toString() || null; // without "|| null", it will return undefined if not found
}

export async function getUserReviews(userId) {
  await dbConnect();

  try {
    const internalReviews = await InternalReview.find({ user_id: userId }).lean();
    const externalReviews = await ExternalReview.find({ user_id: userId }).lean();

    return {
      internalReviews: internalReviews,
      externalReviews: externalReviews,
    };
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw new Error('Failed to fetch user reviews');
  }
}

export async function getBlogPostNumOfFavourites(blogId) {
  await dbConnect();
  const count = await User.countDocuments({
    favouriteBlogs: { $in: [blogId] },
  });
  return count;
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

function extractMentionedRestaurantIds(contentJSON) {
  const ids = [];

  function walk(node) {
    if (!node) return;

    if (node.type === 'mention' && node.attrs?.id) {
      ids.push(node.attrs.id);
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  }

  walk(contentJSON);

  const uniqueIds = new Set(ids); // Eliminate duplicates
  return Array.from(uniqueIds);
}

// Create a Blog Post
export async function createBlogPost({ title, content, userId }) {
  await dbConnect();

  const blocks = content?.content;

  let previewText = '';
  if (Array.isArray(blocks)) {
    const firstParagraph = blocks.find(block => block.type === 'paragraph');
    if (firstParagraph?.content) {
      const text = firstParagraph.content.map(segment => segment.text || '').join('');
      previewText = text.length > 160 ? text.slice(0, 157) + '...' : text;
    }
  }

  let previewImage = null;
  if (Array.isArray(blocks)) {
    const imageBlock = blocks.find(block => block.type === 'image');
    previewImage = imageBlock?.attrs?.src || null;
  }

  const mentionedRestaurantIds = (extractMentionedRestaurantIds(content) || []).map(
    id => new mongoose.Types.ObjectId(`${id}`)
  ); // Convert to ObjectIds

  const newPost = new BlogPost({
    body: content,
    title,
    date_posted: new Date(),
    user_id: userId,
    previewTitle: title.length > 50 ? title.slice(0, 33) + '...' : title,
    previewText: previewText,
    previewImage: previewImage,
    mentions: mentionedRestaurantIds,
  });

  await newPost.save();

  if (!newPost) return null;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $push: { myBlogPosts: newPost._id },
    },
    { new: true } // return the updated user
  );

  if (!user) return null;
  return newPost;
}

// Get user's Blog Posts by User ID
export async function getBlogPosts({ userId }) {
  await dbConnect();

  // newest first
  const posts = await BlogPost.find({ user_id: userId }).sort({ date_posted: -1 });

  return posts;
}

// Get Blog Post by Id
export async function getBlogPost({ id }) {
  await dbConnect();

  const post = await BlogPost.findOne({ _id: id });

  return post;
}

// Search for a Restaurant by Search Query (User Input)
export async function searchRestaurantsByQuery(query) {
  await dbConnect();
  const restaurants = await Restaurant.find({
    // $regex: query means partial matching
    // $options: 'i' makes it case-insensitive
    name: { $regex: query, $options: 'i' },
  }).limit(10);

  return restaurants;
}

// Search for a Restaurant (limit 20 searches per page)
export async function searchRestaurantsBySearchQuery(query, { page = 1, limit = 20 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;

  const [restaurants, totalCount] = await Promise.all([
    Restaurant.find({ name: { $regex: query, $options: 'i' } })
      .skip(skip)
      .limit(limit),
    Restaurant.countDocuments({ name: { $regex: query, $options: 'i' } }),
  ]);

  return { restaurants, totalCount };
}

// Search for a Posts by Search Query (User Input)
export async function searchBlogPostsByQuery(query, { page = 1, limit = 20 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;

  const [posts, totalCount] = await Promise.all([
    BlogPost.find({ title: { $regex: query, $options: 'i' } })
      .skip(skip)
      .limit(limit),
    BlogPost.countDocuments({ title: { $regex: query, $options: 'i' } }),
  ]);

  return { posts, totalCount };
}
// Search for a General Users by Search Query (User Input)
export async function searchUsersByQuery(query, { page = 1, limit = 20 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    User.find({ username: { $regex: query, $options: 'i' } })
      .skip(skip)
      .limit(limit),
    User.countDocuments({ username: { $regex: query, $options: 'i' } }),
  ]);

  return { users, totalCount };
}

export async function getBlogsMentioningRestaurant(restaurantId) {
  await dbConnect();

  const blogs = await BlogPost.find({
    mentions: { $in: [new mongoose.Types.ObjectId(`${restaurantId}`)] },
  })
    .populate('user_id', 'username userProfilePicture')
    .lean();

  return JSON.parse(JSON.stringify(blogs));
}

export async function getBusinessUsersAwaitingVerification() {
  try {
    await dbConnect();

    // Fetch all business users with verificationStatus false and populate restaurantId with necessary fields
    const users = await BusinessUser.find({ verificationStatus: false }).populate('restaurantId', '_id name location');
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error('Error fetching business users:', error);
    throw new Error('Failed to get business users');
  }
}

export async function approveBusinessUser(userId) {
  try {
    await dbConnect();
    const updatedUser = await BusinessUser.findByIdAndUpdate(userId, { verificationStatus: true }, { new: true });

    if (!updatedUser) {
      throw new Error('Business user not found');
    }
    return updatedUser.verificationStatus === true;
  } catch (error) {
    console.error('Error approving business user:', error);
    throw new Error('Failed to approve business user');
  }
}
