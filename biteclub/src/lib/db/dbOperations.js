'use server';
import dbConnect from './dbConnect';

import {
  User,
  Photo,
  Comment,
  CommentPost,
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

  const [reviews, externalReviews] = await Promise.all([
    InternalReview.find({ restaurant_id: id }).populate('user_id', '_id username userProfilePicture').lean(),
    ExternalReview.find({ restaurant_id: id }).populate('user_id', '_id username').lean(),
  ]);

  return {
    internalReviews: reviews,
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

export async function getExternalReviewsByTheRestaurantId(restaurantId) {
  await dbConnect();

  if (!restaurantId) {
    throw new Error('Restaurant ID is required to fetch external reviews');
  }

  const reviews = await ExternalReview.find({ user_id: restaurantId, restaurant_id: restaurantId }).lean();
  return reviews ? JSON.parse(JSON.stringify(reviews)) : [];
}

export async function removeExternalReview(reviewId) {
  await dbConnect();

  const deletedReview = await ExternalReview.findByIdAndDelete(reviewId);
  if (!deletedReview) {
    throw new Error('External review not found');
  }
  return true;
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

export async function updateInternalReview(data) {
  await dbConnect();
  const { reviewId, userId, title, body, rating, photos } = data;
  const updated = await InternalReview.findOneAndUpdate(
    { _id: reviewId, user_id: userId },
    {
      title,
      body,
      rating,
      photos: photos || [],
      date_updated: new Date(),
    },
    { new: true }
  );
  return updated ? JSON.parse(JSON.stringify(updated)) : null;
}

export async function updateReviewEngagement(reviewId, userId, like = false, dislike = false) {
  try {
    await dbConnect();

    const review = await InternalReview.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    const alreadyLiked = review.likes.users.includes(userId);
    const alreadyDisliked = review.dislikes.users.includes(userId);

    if (like) {
      if (alreadyLiked) {
        // Toggle off like
        review.likes.users.pull(userId);
        review.likes.count = Math.max(0, review.likes.count - 1);
      } else {
        // Remove dislike if any
        if (alreadyDisliked) {
          review.dislikes.users.pull(userId);
          review.dislikes.count = Math.max(0, review.dislikes.count - 1);
        }
        // Add like
        review.likes.users.push(userId);
        review.likes.count += 1;
      }
    } else if (dislike) {
      if (alreadyDisliked) {
        // Toggle off dislike
        review.dislikes.users.pull(userId);
        review.dislikes.count = Math.max(0, review.dislikes.count - 1);
      } else {
        // Remove like if any
        if (alreadyLiked) {
          review.likes.users.pull(userId);
          review.likes.count = Math.max(0, review.likes.count - 1);
        }
        // Add dislike
        review.dislikes.users.push(userId);
        review.dislikes.count += 1;
      }
    }

    await review.save();

    return JSON.parse(JSON.stringify(review));
  } catch (err) {
    console.error('Error adding like/dislike:', err);
    throw err;
  }
}

export async function addCommentToReview(reviewId, commentData, userId) {
  try {
    await dbConnect();

    const review = await InternalReview.findById(reviewId);
    if (!review) throw new Error('Review not found');

    console.log('Adding comment to review:', reviewId, commentData, userId);

    const comment = {
      content: commentData.content,
      user_type: commentData.user_type,
      author_id: commentData.author_id || userId,
      author_name: commentData.author_name,
      avatarURL: commentData.avatarURL || null,
      date_posted: new Date(),
      likes: { count: 0, users: [] },
      dislikes: { count: 0, users: [] },
    };

    review.comments.push(comment);

    await review.save();

    const savedComment = review.comments[review.comments.length - 1];

    return {
      success: true,
      comment: JSON.parse(JSON.stringify(savedComment)),
      updatedCount: review.comments.length,
    };
  } catch (err) {
    console.error('Error in addCommentToReview:', err);
    throw new Error(err.message || 'Failed to add comment');
  }
}

export async function deleteCommentFromReview(reviewId, commentId, userId) {
  try {
    await dbConnect();

    const review = await InternalReview.findById(reviewId);
    if (!review) throw new Error('Review not found');

    const commentIndex = review.comments.findIndex(c => c._id.toString() === commentId.toString());
    if (commentIndex === -1) throw new Error('Comment not found in review');

    review.comments.splice(commentIndex, 1);
    await review.save();

    return {
      success: true,
      deletedCommentId: commentId,
      updatedCount: review.comments.length,
    };
  } catch (err) {
    console.error('Error in deleteCommentFromReview:', err);
    throw new Error(err.message || 'Failed to delete comment');
  }
}

export async function updateReviewCommentEngagement(reviewId, userId, like = false, dislike = false, commentId) {
  try {
    await dbConnect();

    const review = await InternalReview.findById(reviewId);
    if (!review) throw new Error('Review not found');
    if (!review.comments) throw new Error('No comments found in this review');

    const commentIndex = review.comments.findIndex(c => c._id.toString() === commentId.toString());
    if (commentIndex === -1) throw new Error('Comment not found in review');

    const comment = review.comments[commentIndex];
    const alreadyLiked = comment.likes.users.includes(userId);
    const alreadyDisliked = comment.dislikes.users.includes(userId);

    if (like) {
      if (alreadyLiked) {
        // Toggle off like
        comment.likes.users.pull(userId);
        comment.likes.count = Math.max(0, comment.likes.count - 1);
      } else {
        // Remove dislike if any
        if (alreadyDisliked) {
          comment.dislikes.users.pull(userId);
          comment.dislikes.count = Math.max(0, comment.dislikes.count - 1);
        }
        // Add like
        comment.likes.users.push(userId);
        comment.likes.count += 1;
      }
    } else if (dislike) {
      if (alreadyDisliked) {
        // Toggle off dislike
        comment.dislikes.users.pull(userId);
        comment.dislikes.count = Math.max(0, comment.dislikes.count - 1);
      } else {
        // Remove like if any
        if (alreadyLiked) {
          comment.likes.users.pull(userId);
          comment.likes.count = Math.max(0, comment.likes.count - 1);
        }
        // Add dislike
        comment.dislikes.users.push(userId);
        comment.dislikes.count += 1;
      }
    }

    review.comments[commentIndex] = comment;
    await review.save();
    return JSON.parse(JSON.stringify(review.comments[commentIndex]));
  } catch (err) {
    console.error('Error in updateReviewCommentEngagement:', err);
    throw new Error(err.message || 'Failed to update comment engagement');
  }
}

export async function getBusinessUserRestaurantId({ supabaseId }) {
  await dbConnect();
  const user = await BusinessUser.findOne({ supabaseId });
  if (!user) return null;
  // return { restaurantId: user.restaurantId.toString() ?? null };
  return { restaurantId: user.restaurantId ? user.restaurantId.toString() : null }; // safe version
}

export async function addAnnouncement(restaurantId, data) {
  try {
    await dbConnect();

    console.log('Adding announcement for restaurantId:', restaurantId, 'with data:', data);
    const newAnnouncement = new Announcement({
      ...data,
      announcingRestaurant: restaurantId,
    });

    const savedAnnouncement = await newAnnouncement.save();
    return JSON.parse(JSON.stringify(savedAnnouncement));
  } catch (error) {
    console.error('Error adding announcement:', error);
    throw error;
  }
}

export async function getAnnouncementsByRestaurantId(restaurantId) {
  try {
    await dbConnect();

    const announcements = await Announcement.find({ announcingRestaurant: restaurantId }).sort({ date_posted: -1 });
    return JSON.parse(JSON.stringify(announcements));
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
}

export async function deleteAnnouncement(announcementId) {
  try {
    await dbConnect();

    const result = await Announcement.findByIdAndDelete(announcementId);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
}

export async function addEvent(restaurantId, data) {
  try {
    await dbConnect();

    const newEvent = new Event({
      ...data,
      organizingRestaurant: restaurantId,
    });

    const savedEvent = await newEvent.save();
    return JSON.parse(JSON.stringify(savedEvent));
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
}

export async function getEventsByRestaurantId(restaurantId) {
  try {
    await dbConnect();

    const events = await Event.find({ organizingRestaurant: restaurantId }).sort({ date_posted: -1 });
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function deleteEvent(eventId) {
  try {
    await dbConnect();
    const result = await Event.findByIdAndDelete(eventId);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

// Update license for Business User
export async function updateLicenseForBusinessUser(data) {
  await dbConnect();

  const user = await BusinessUser.findOneAndUpdate(
    { supabaseId: data.supabaseId },
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

// Get business user profile
export async function getBusinessUserProfileBySupabaseId({ supabaseId }) {
  await dbConnect();
  const user = await BusinessUser.findOne({ supabaseId }).populate('restaurantId', 'name');
  if (!user) return null;
  return user; // Returns entire User document
}

export async function getBusinessUserProfileByMongoId(mongoId) {
  await dbConnect();
  // const user = await User.findOne({ _id: mongoId });
  const user = await BusinessUser.findById(mongoId).populate('restaurantId', 'name'); // Use findById for _id
  if (!user) return null;
  return user; // Returns entire User document
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
      feedPersonalization: data.feedPersonalization,
    },
    { new: true } // returns the updated user
  );

  return user;
}

// Update the points of a user
export async function updatePoints(data) {
  await dbConnect();

  const user = await User.findOneAndUpdate(
    { supabaseId: data.supabaseId },
    {
      numOfPoints: data.numOfPoints,
    },
    { new: true } // returns the updated user
  );

  return user;
}

// Get the whole general user profile
export async function getGeneralUserProfileBySupabaseId({ supabaseId }) {
  await dbConnect();
  const user = await User.findOne({ supabaseId });
  if (!user) return null;
  return user; // return the whole user object instead
  /*
  return {
    username: user.username,
    userBio: user.userBio,
    displayFavouriteRestaurants: user.displayFavouriteRestaurants,
    displayFavouriteBlogPosts: user.displayFavouriteBlogPosts,
    displayVisitedPlaces: user.displayVisitedPlaces,
    feedPersonalization: user.feedPersonalization,
    numOfPoints: user.numOfPoints,
  };
  */
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

// Only deleting external reviews for a single user
export async function deleteAllExternalReviewsByUser(userId) {
  try {
    const result = await ExternalReview.deleteMany({ user_id: userId });

    return {
      deletedExternal: result.deletedCount,
    };
  } catch (error) {
    throw new Error('Failed to delete external reviews: ' + error.message);
  }
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
export async function createBlogPost({ title, content, images, userId }) {
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
    images: images || [],
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

// Add Likes/Dislikes to a Post
export async function addLikeOrDislikeToPost({ postId, like = false, dislike = false, userId }) {
  try {
    await dbConnect();
    const post = await BlogPost.findById(postId);
    if (!post) return null;
    if (!post.likes.count) post.likes.count = 0;
    if (!post.dislikes.count) post.dislikes.count = 0;

    const alreadyLiked = post.likes.users.includes(userId);
    const alreadyDisliked = post.dislikes.users.includes(userId);

    if (like && !alreadyLiked) {
      // remove dislike if it exists
      if (alreadyDisliked) {
        post.dislikes.users.pull(userId);
        post.dislikes.count -= 1;
      }

      post.likes.users.push(userId);
      post.likes.count += 1;
    }

    if (dislike && !alreadyDisliked) {
      // remove like if it exists
      if (alreadyLiked) {
        post.likes.users.pull(userId);
        post.likes.count -= 1;
      }

      post.dislikes.users.push(userId);
      post.dislikes.count += 1;
    }

    await post.save();
    return post;
  } catch (err) {
    console.error('Error adding like/dislike:', err);
    throw err;
  }
}

// get Exploring Blog Posts (popular + new)
export async function getListOfExploringBlogPosts(page = 1, limit = 20) {
  await dbConnect();
  const skip = (page - 1) * (limit / 2);

  const popularFilter = {
    $or: [
      { 'likes.count': { $gte: 1 } },
      {
        $expr: {
          $gte: [{ $size: { $ifNull: ['$comments', []] } }, 1],
        },
      },
    ],
  };

  const [popularPosts, newPosts, totalCount] = await Promise.all([
    BlogPost.find(popularFilter)
      .skip(skip)
      .limit(limit / 2),
    BlogPost.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit / 2),
    BlogPost.countDocuments({}),
  ]);

  return {
    posts: [...popularPosts, ...newPosts],
    totalCount,
  };
}

// get Following Blog Posts (posts posted by people user follows)
export async function getListOfFollowingBlogPosts(userId, page = 1, limit = 20) {
  await dbConnect();
  const skip = (page - 1) * (limit / 2);

  console.log('UserId: ', userId);
  // get array of users' posts the current user is following
  const currentUser = await User.findById(userId);
  console.log('Im here');
  if (!currentUser) {
    throw new Error('User not found');
  }

  const followings = currentUser.followings;

  // when user is not following anyone - return 0 posts
  if (!followings || followings.length === 0) {
    return {
      posts: [],
      totalCount: 0,
    };
  }

  // find blog posts where user_id is in followings[]
  const [posts, totalCount] = await Promise.all([
    BlogPost.find({ user_id: { $in: followings } })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit),
    BlogPost.countDocuments({ user_id: { $in: followings } }),
  ]);

  return {
    posts,
    totalCount,
  };
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

// Search and Filter for the Restaurants (limit 20 searches per page)
export async function searchRestaurantsBySearchQuery(
  query,
  {
    page = 1,
    limit = 20,
    cuisines = [],
    dietary = [],
    rating = 0,
    price,
    distance = 0,
    lat = '',
    lng = '',
    isOpenNow = false,
  } = {}
) {
  await dbConnect();
  const skip = (page - 1) * limit;

  const filter = {
    name: { $regex: query, $options: 'i' },
  };

  // Filter by rating
  if (rating) {
    filter.rating = { $gte: rating };
  }

  // Filter by price
  if (price) {
    filter.priceRange = price;
  }

  // Filter by cuisines
  if (cuisines.length > 0) {
    filter.cuisines = { $in: cuisines };
  }

  // Filter by dietary options
  if (dietary.length > 0) {
    filter.dietaryOptions = { $in: dietary };
  }

  // Filter by distance
  // when distance is 10+, we do want to include all results and do not filter by distance
  if (!isNaN(lat) && !isNaN(lng) && distance > 0 && distance < 10) {
    console.log(`Coordinates lng: ${lng} and lat: ${lat} and distance ${distance}`);

    filter.locationCoords = {
      // finds within a specified geometry
      $geoWithin: {
        // specifies a circular area on the earth’s surface
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)], // the center point
          distance / 6371, // convert from kilometers to radians (distance in km / Earth’s mean radius)
        ],
      },
    };
  }

  // Filter by "Open Now"
  if (isOpenNow) {
    const dayName = new Date().toLocaleDateString('en-CA', {
      weekday: 'long',
      timeZone: 'America/Toronto',
    });

    const now = new Date().toLocaleTimeString('en-CA', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Toronto',
    });

    console.log({ dayName, now });

    filter.BusinessHours = {
      $elemMatch: {
        day: dayName,
        opening: { $lte: now },
        closing: { $gte: now },
      },
    };
  }

  const [restaurants, totalCount] = await Promise.all([
    Restaurant.find(filter).skip(skip).limit(limit),
    Restaurant.countDocuments(filter),
  ]);

  return { restaurants, totalCount };
}

// Get a list of restaurants (popular + new)
export async function getListOfRestaurants(page = 1, limit = 20) {
  await dbConnect();
  const skip = (page - 1) * (limit / 2);

  // get popular restaurants
  const popularRestaurants = await Restaurant.find({
    rating: { $gte: 4.5 },
    numReviews: { $gte: 100 },
  })
    .skip(skip)
    .limit(limit / 2);

  // get new restaurants
  const newRestaurants = await Restaurant.find({})
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit / 2);

  return [...popularRestaurants, ...newRestaurants];
}

export async function getAllCuisines() {
  await dbConnect();
  const allCuisines = await Restaurant.distinct('cuisines');

  return allCuisines;
}

// Search for a Posts by Search Query (User Input)
export async function searchBlogPostsByQuery(query, { page = 1, limit = 20 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;

  const [posts, totalCount] = await Promise.all([
    BlogPost.find({ title: { $regex: query, $options: 'i' } })
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'username userProfilePicture')
      .lean(),
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

// Post Comments
// author (MongoDB user _id)
export async function createPostComment({
  blogPostId,
  parent_id = null,
  avatarURL,
  content,
  author,
  date_posted = Date.now(),
  user,
}) {
  try {
    await dbConnect();

    const comment = new CommentPost({
      blogPost_id: blogPostId,
      parent_id,
      avatarURL,
      content,
      author,
      date_posted,
      user,
    });

    const savedComment = await comment.save();

    // update blog post comments
    await BlogPost.findByIdAndUpdate(blogPostId, { $push: { comments: savedComment._id } }, { new: true });

    return savedComment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// Get Post Comments By Post Id
export async function getPostCommentsByPostId({ postId }) {
  try {
    await dbConnect();
    const comments = await CommentPost.find({
      blogPost_id: postId,
    }).sort({ date_posted: 1 }); // sort in ascending order

    return comments;
  } catch (err) {
    console.error('Error getting post comments by post id:', err);
    throw err;
  }
}

// Add Likes/Dislikes to a Post Comment/Reply
export async function addLikeOrDislikeToComment({ commentId, like = false, dislike = false, userId }) {
  try {
    await dbConnect();
    const comment = await CommentPost.findById(commentId);
    if (!comment) return null;

    const alreadyLiked = comment.likes.users.includes(userId);
    const alreadyDisliked = comment.dislikes.users.includes(userId);

    if (like && !alreadyLiked) {
      // remove dislike if it exists
      if (alreadyDisliked) {
        comment.dislikes.users.pull(userId);
        comment.dislikes.count -= 1;
      }

      comment.likes.users.push(userId);
      comment.likes.count += 1;
    }

    if (dislike && !alreadyDisliked) {
      // remove like if it exists
      if (alreadyLiked) {
        comment.likes.users.pull(userId);
        comment.likes.count -= 1;
      }

      comment.dislikes.users.push(userId);
      comment.dislikes.count += 1;
    }

    await comment.save();
    return comment;
  } catch (err) {
    console.error('Error adding like/dislike:', err);
    throw err;
  }
}

// Delete BP Comment
export async function deletePostComment({ commentId }) {
  try {
    await dbConnect();
    const deletedComment = await CommentPost.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new Error(`Comment with ID ${commentId} not found`);
    }

    // Remove the reference from the blog post's comments array
    await BlogPost.findByIdAndUpdate(deletedComment.blogPost_id, { $pull: { comments: commentId } });

    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

// Get BP Comment
export async function getPostComment({ commentId }) {
  try {
    await dbConnect();
    const comment = await CommentPost.findById(commentId);

    if (!comment) {
      throw new Error(`Comment with ID ${commentId} not found`);
    }

    return comment;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

// CHALLENGES
// Get Active Challenges by User Id
export async function getActiveChallengesByUserId({ userId }) {
  try {
    await dbConnect();

    const activeChallenges = (await ActivateChallengeDetail.find({ userId })) || [];

    if (activeChallenges.length === 0) {
      console.log(`No active challenges found for userId: ${userId}`);
    }

    return activeChallenges;
  } catch (error) {
    console.error('Error retrieving active challenges:', error);
    throw error;
  }
}

// Get Active Challenge Detail by Challenge Id and User ID
export async function getActiveChallengeDetailByIds({ challengeId, userId }) {
  try {
    await dbConnect();

    const activeChallengeDetail = await ActivateChallengeDetail.findOne({ challengeId: challengeId, userId: userId });

    if (activeChallengeDetail.length === 0) {
      console.log(`No active challenge found for ids: Challenge: ${challengeId} User: ${userId}`);
    }

    return activeChallengeDetail;
  } catch (error) {
    console.error('Error retrieving active challenge:', error);
    throw error;
  }
}

// Get Challenge by Challenge Id
export async function getChallengeByChallengeId({ challengeId }) {
  try {
    await dbConnect();

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      throw new Error(`Could not find challenge by id: ${challengeId}`);
    }

    return challenge;
  } catch (error) {
    console.error('Error finding a challenge by challenge id:', error);
    throw error;
  }
}

// Update Active Challenge Detail (Challenge Step)
export async function updateActiveChallengeDetail({ activeChallengeDetailId, challengeSteps, completionStatus }) {
  try {
    await dbConnect();

    const updatedChallenge = await ActivateChallengeDetail.findByIdAndUpdate(
      activeChallengeDetailId,
      { challengeSteps, completionStatus },
      { new: true } // return the updated document
    );

    if (!updatedChallenge) {
      throw new Error('ActiveChallengeDetail not found');
    }
    console.log('updatedChallenge', updatedChallenge);

    return updatedChallenge;
  } catch (error) {
    console.error('Error updating active challenge detail:', error);
    throw error;
  }
}

export async function dropActiveChallenge(activeChallengeId) {
  try {
    await dbConnect();

    const deletedChallenge = await ActivateChallengeDetail.findByIdAndDelete(activeChallengeId);

    if (!deletedChallenge) {
      throw new Error('ActiveChallengeDetail not found');
    }

    return true;
  } catch (error) {
    console.error('Error deleting active challenge detail:', error);
    return false;
  }
}
