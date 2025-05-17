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
  BusinessHours,
  Restaurant,
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
