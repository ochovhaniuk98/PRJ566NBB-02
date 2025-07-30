// scripts/create-testing-challenges.js
import mongoose from 'mongoose';
import dbConnect from '../src/lib/db/dbConnect.js';
import { Restaurant } from '../src/lib/model/dbSchema.js';
import { Challenge } from '../src/lib/model/dbSchema.js';

async function getRestaurantsForChallenge1(restaurants, cuisines) {
  try {
    await dbConnect();

    for (let i = 0; i < cuisines.length; i++) {
      const cuisine = cuisines[i];

      const restaurant = await Restaurant.findOne({ cuisines: cuisine }).exec();

      if (restaurant) {
        restaurants.push(restaurant);
        console.log(`Got 1 ${cuisine} restaurant:`, restaurant.name);
      } else {
        console.log(`No restaurant found for cuisine: ${cuisine}`);
      }
    }

    console.log(
      'All selected restaurants:',
      restaurants.map(r => r.name)
    );
  } catch (err) {
    console.error('Could not get restaurants for challenge:', err);
  }
}

async function createChallenge1() {
  const cuisines = ['Indian', 'Italian', 'Hawaiian', 'Israeli', 'Japanese'];
  let restaurants = [];

  // get restaurants
  await getRestaurantsForChallenge1(restaurants, cuisines);

  // extract restaurant IDs
  const restaurantIds = restaurants.map(r => r._id);

  // create challenge 1
  const challenge = new Challenge({
    title: 'Around the World in 80 Days',
    description: 'See the world in Toronto! Try a cuisine from 5 different continents.',
    numberOfPoints: 300,
    // thumbnailImage: '/images/challenges/around-the-world.jpg',
    restaurants: restaurantIds,
    duration: 80, // in days
  });

  try {
    await challenge.save();
    console.log('Challenge created successfully:', challenge);
  } catch (err) {
    console.error('Error saving challenge:', err);
  } finally {
    mongoose.connection.close();
  }
}

async function getRestaurantsForChallenge2(restaurants, restaurantIds) {
  try {
    await dbConnect();

    for (let i = 0; i < restaurantIds.length; i++) {
      const id = restaurantIds[i];

      const restaurant = await Restaurant.findById(id).exec();

      if (restaurant) {
        restaurants.push(restaurant);
        console.log(`Got 1 ${restaurant.dietaryOptions} restaurant:`, restaurant.name);
      } else {
        console.log(`No restaurant found for dietaryOption Vegan`);
      }
    }

    console.log(
      'All selected restaurants:',
      restaurants.map(r => r.name)
    );
  } catch (err) {
    console.error('Could not get restaurants for challenge:', err);
  }
}

async function createChallenge2() {
  let restaurants = [];
  // vegan restaurants' ids
  const restaurantIds = ['682a2ec970221a179b692617', '682a2ece70221a179b69338d', '682a2ecf70221a179b69354f'];

  // get restaurants
  await getRestaurantsForChallenge2(restaurants, restaurantIds);

  //   create challenge 2
  const challenge = new Challenge({
    title: 'The Great Vegan Voyage',
    description: 'Greens, greens, eat your greens! Save the planet with your diet.',
    numberOfPoints: 500,
    // thumbnailImage: '/images/challenges/vegan.jpg',
    restaurants: restaurantIds,
    duration: 30, // in days
  });

  try {
    await challenge.save();
    console.log('Challenge created successfully:', challenge);
  } catch (err) {
    console.error('Error saving challenge:', err);
  } finally {
    mongoose.connection.close();
  }
}

async function getRestaurantsForChallenge3(restaurants, restaurantIds) {
  try {
    await dbConnect();

    for (let i = 0; i < restaurantIds.length; i++) {
      const id = restaurantIds[i];

      const restaurant = await Restaurant.findById(id).exec();

      if (restaurant) {
        restaurants.push(restaurant);
        console.log(`Got 1 ${restaurant.dietaryOptions} restaurant:`, restaurant.name);
      } else {
        console.log(`No restaurant found for taco`);
      }
    }

    console.log(
      'All selected restaurants:',
      restaurants.map(r => r.name)
    );
  } catch (err) {
    console.error('Could not get restaurants for challenge:', err);
  }
}

async function createChallenge3() {
  let restaurants = [];
  // taco restaurants' ids
  const restaurantIds = [
    '682a2ec970221a179b692874',
    '682a2ec970221a179b69276e',
    '682a2ec970221a179b69289a',
    '682a2ecc70221a179b692ac4',
    '682a2ec970221a179b6928ad',
  ];

  // get restaurants
  await getRestaurantsForChallenge3(restaurants, restaurantIds);

  //   create challenge 2
  const challenge = new Challenge({
    title: 'Taco Taco Taco',
    description: 'Eat tacos from 5 spots in the city.',
    numberOfPoints: 450,
    // thumbnailImage: '/images/challenges/taco.jpg',
    restaurants: restaurantIds,
    duration: 30, // in days
  });

  try {
    await challenge.save();
    console.log('Challenge created successfully:', challenge);
  } catch (err) {
    console.error('Error saving challenge:', err);
  } finally {
    mongoose.connection.close();
  }
}

createChallenge1();
createChallenge2();
createChallenge3();
