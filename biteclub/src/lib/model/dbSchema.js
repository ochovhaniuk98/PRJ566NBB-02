import mongoose from 'mongoose';

// Photo subdocument
const PhotoSchema = new mongoose.Schema(
  {
    url: String,
    caption: String,
    updated_at: Date,
  },
  {
    _id: true, // ensure _id is created - needed for Cloudinary image retrieval
    strict: false, // allow additional fields to be added later
  }
);

// User
const UserSchema = new mongoose.Schema({
  supabaseId: String,
  username: String,
  userBio: String,
  userProfilePicture: PhotoSchema,
  strike: Number,
  numOfPoints: Number,
  pointsResetDate: Date,
  feedPersonalization: Boolean,
  personalization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Personalization' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users that following us. (sprint 2) newly added.
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users that we follow
  visitedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  favouriteRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  favouriteBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }],
  myBlogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }],
  displayVisitedPlaces: { type: mongoose.Schema.Types.Boolean },
  displayFavouriteRestaurants: { type: mongoose.Schema.Types.Boolean },
  displayFavouriteBlogPosts: { type: mongoose.Schema.Types.Boolean },
  creditCards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CreditCard' }],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  userType: String,
  joinedSince: Date, // (sprint 2) newly added. for user dashboard.
});

// TODO: Review if counts can be removed and be calculated through the users array
// Comment subdocument
const CommentSchema = new mongoose.Schema({
  body: String,
  author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  date_posted: Date,
  likes: {
    count: Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  dislikes: {
    count: Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
});

// used only by blog post schema
const CommentPostSchema = new mongoose.Schema({
  blogPost_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CommentPost', default: null },
  avatarURL: String,
  content: String,
  author: { type: String, required: true },
  date_posted: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  dislikes: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
});

// Instagram post subdocument
const InstagramPostSchema = new mongoose.Schema({
  embedLink: String,
});

// Blog post
const BlogPostSchema = new mongoose.Schema({
  body: {
    // stored as JSON
    type: Object,
    required: true,
  },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  title: String,
  date_posted: Date,
  likes: {
    count: Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  dislikes: {
    count: Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentPost' }], // comments will be stored separately in CommentPost collection
  Instagram_posts: [InstagramPostSchema], // no longer needed, it's part of post body
  photos: [PhotoSchema], // no longer needed, it's part of post body
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  previewTitle: String,
  previewText: String,
  previewImage: String, // src url
});

// Internal Review
const InternalReviewSchema = new mongoose.Schema({
  body: String,
  title: String,
  rating: Number,
  date_posted: Date,
  date_updated: Date,
  comments: [CommentSchema],
  photos: [PhotoSchema],
  user_type: {
    type: String,
    enum: ['User', 'BusinessUser'],
  },
  likes: {
    count: Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'user_type' }],
  },
  dislikes: {
    count: Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'user_type' }],
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
});

// External Review
const ExternalReviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  content: InstagramPostSchema,
  date_posted: { type: Date, default: Date.now },
});

// Credit Card
const CreditCardSchema = new mongoose.Schema({
  cardToken: String,
  lastFourDigits: Number,
  isDefaultCard: Boolean,
  isCardValid: Boolean,
});

// Payment
const PaymentSchema = new mongoose.Schema({
  creditCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditCard' },
  paymentStatus: String,
});

// Item Detail
const ItemDetailSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  quantity: Number,
});

// Order
const OrderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  orderedDate: Date,
  visitedDate: Date, // TODO: Review: Is this needed?
  items: [ItemDetailSchema],
  HST: Number,
  totalPrice: Number,
  payments: [PaymentSchema], // TODO: Review: Does this need to be an array?
  orderRating: Number,
});

// Challenge Step
const ChallengeStepSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  verificationStatus: Boolean,
});

// Available Challenge Detail - Can be removed
const AvailableChallengeDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Challenge
const ChallengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  numberOfPoints: Number,
  thumbnailImage: String,
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  duration: Number,
});

// Activated Challenge Detail - Track a user's progress in their active challenges
const ActivateChallengeDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  challengeSteps: [ChallengeStepSchema],
  completionStatus: String,
  startDate: Date,
  endDate: Date,
});

// Point value detail
const PointValueDetailSchema = new mongoose.Schema({
  pointLevel: Number,
  value: Number,
});

// Point
const PointSchema = new mongoose.Schema({
  details: [PointValueDetailSchema],
  start_date: Date,
  end_date: Date,
});

// Event
const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  description: String,
  organizingRestaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
});

// Announcement
const AnnouncementSchema = new mongoose.Schema({
  title: String,
  details: String,
  announcingRestaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
});

// Menu Item
const MenuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

// Business Hours
const BusinessHoursSchema = new mongoose.Schema({
  day: String,
  opening: String,
  closing: String,
});

// Restaurant
const RestaurantSchema = new mongoose.Schema({
  name: String,
  cuisines: [String],
  rating: Number,
  numReviews: Number,
  priceRange: String,
  dietaryOptions: [String],
  BusinessHours: [BusinessHoursSchema],
  bannerImages: [PhotoSchema],
  images: [PhotoSchema],
  location: String,
  longitude: Number,
  latitude: Number,
  locationCoords: {
    // https://www.mongodb.com/docs/manual/reference/geojson/#point
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
});
RestaurantSchema.index({ locationCoords: '2dsphere' }); // 2dsphere index for locationCoords

// Business User Schema
const BusinessUserSchema = new mongoose.Schema({
  supabaseId: String,
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  userType: String,
  licenseFileUrl: String,
  verificationStatus: Boolean, // String,
});

// Temporary Collection for Testing Purposes
// TestCloudinaryImageSchema
const TestCloudinaryImageSchema = new mongoose.Schema({
  url: String,
  caption: String,
  updated_at: Date,
});

// Stores user's answers to the Questionnaire
const PersonalizationSchema = new mongoose.Schema({
  favouriteCuisines: [mongoose.Schema.Types.String],
  dietaryPreferences: [mongoose.Schema.Types.String],
  likelinessToTryFood: mongoose.Schema.Types.Int32,
  restaurantFrequency: mongoose.Schema.Types.Int32,
  decisionDifficulty: mongoose.Schema.Types.Int32,
  openToDiversity: mongoose.Schema.Types.Int32,
});

const ReportSchema = new mongoose.Schema({
  contentType: {
    type: String,
    enum: ['InternalReview', 'ExternalReview', 'CommentPost', 'BlogPost', 'User'],
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'contentType',
    validate: {
      validator: function (v) {
        // If contentType is NOT 'user', then contentId is required
        if (this.contentType !== 'User') {
          return v != null;
        }
        // Otherwise, if it's 'user', contentId should be null or undefined
        return true;
      },
      message: 'contentId is required for content (non-user) reports',
    },
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporterType: {
    type: String,
    required: true,
    enum: ['User', 'BusinessUser'],
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'reporterType',
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'ApprovedAndBanned'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: Date,
});

// Auto-nullify contentId when contentType === 'User'
ReportSchema.pre('validate', function (next) {
  if (this.contentType === 'User') {
    this.contentId = undefined; // Removes the field entirely from MongoDB
  }
  next();
});

// Export models
export const User = mongoose.models?.User || mongoose.model('User', UserSchema);
export const Photo = mongoose.models?.Photo || mongoose.model('Photo', PhotoSchema);
export const Comment = mongoose.models?.Comment || mongoose.model('Comment', CommentSchema);
export const CommentPost = mongoose.models?.CommentPost || mongoose.model('CommentPost', CommentPostSchema);
export const InstagramPost = mongoose.models?.InstagramPost || mongoose.model('InstagramPost', InstagramPostSchema);
export const BlogPost = mongoose.models?.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
export const InternalReview = mongoose.models?.InternalReview || mongoose.model('InternalReview', InternalReviewSchema);
export const ExternalReview = mongoose.models?.ExternalReview || mongoose.model('ExternalReview', ExternalReviewSchema);
export const CreditCard = mongoose.models?.CreditCard || mongoose.model('CreditCard', CreditCardSchema);
export const Payment = mongoose.models?.Payment || mongoose.model('Payment', PaymentSchema);
export const ItemDetail = mongoose.models?.ItemDetail || mongoose.model('ItemDetail', ItemDetailSchema);
export const Order = mongoose.models?.Order || mongoose.model('Order', OrderSchema);
export const ChallengeStep = mongoose.models?.ChallengeStep || mongoose.model('ChallengeStep', ChallengeStepSchema);
export const AvailableChallengeDetail =
  mongoose.models?.AvailableChallengeDetail ||
  mongoose.model('AvailableChallengeDetail', AvailableChallengeDetailSchema);
export const ActivateChallengeDetail =
  mongoose.models?.ActivateChallengeDetail || mongoose.model('ActivateChallengeDetail', ActivateChallengeDetailSchema);
export const Challenge = mongoose.models?.Challenge || mongoose.model('Challenge', ChallengeSchema);
export const PointValueDetail =
  mongoose.models?.PointValueDetail || mongoose.model('PointValueDetail', PointValueDetailSchema);
export const Point = mongoose.models?.Point || mongoose.model('Point', PointSchema);
export const Event = mongoose.models?.Event || mongoose.model('Event', EventSchema);
export const Announcement = mongoose.models?.Announcement || mongoose.model('Announcement', AnnouncementSchema);
export const MenuItem = mongoose.models?.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
export const BusinessHours = mongoose.models?.BusinessHours || mongoose.model('BusinessHours', BusinessHoursSchema);
export const Restaurant = mongoose.models?.Restaurant || mongoose.model('Restaurant', RestaurantSchema);
export const BusinessUser = mongoose.models?.BusinessUser || mongoose.model('BusinessUser', BusinessUserSchema);
export const TestCloudinaryImage =
  mongoose.models?.TestCloudinaryImage || mongoose.model('TestCloudinaryImage', TestCloudinaryImageSchema);
export const Personalization =
  mongoose.models?.Personalization || mongoose.model('Personalization', PersonalizationSchema);
export const Report = mongoose.models?.Report || mongoose.model('Report', ReportSchema);
