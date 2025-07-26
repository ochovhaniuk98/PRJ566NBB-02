// this script was run to populate all the restaurants with their location coordinates (latitude and longitude)
// based on the restaurant's address, we can get coordinates (latitude and longitude)
// this is needed for distance filtering and user geolocation confirmation
import mongoose from 'mongoose';
import axios from 'axios';
import dbConnect from '../src/lib/db/dbConnect.js';
import { Restaurant } from '../src/lib/model/dbSchema.js';
import 'dotenv/config';

async function geocodeAddress(address) {
  try {
    const encoded = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=GOOGLE_API_KEY`;
    const res = await axios.get(url);

    const result = res.data.results[0];
    if (!result) return null;

    const { lat, lng } = result.geometry.location;
    return {
      latitude: lat,
      longitude: lng,
    };
  } catch (err) {
    console.error(`Failed to geocode ${address}:`, err.message);
    return null;
  }
}

async function main() {
  await dbConnect();

  // now get the restaurants where coordinates were set
  // const restaurants = await Restaurant.find({
  //   $or: [{ latitude: { $exists: true } }, { longitude: { $exists: true } }],
  // });

  // select restaurants that are missing coordinates
  const restaurants = await Restaurant.find({
    locationCoords: { $exists: false },
  });

  console.log(`Found ${restaurants.length} restaurants to geocode.`);

  for (const restaurant of restaurants) {
    if (!restaurant.location) continue;

    const coords = await geocodeAddress(restaurant.location);
    if (coords) {
      // restaurant.latitude = coords.latitude;
      // restaurant.longitude = coords.longitude;

      // saves the locationCoords as a valid GeoJSON Point, which is necessary for distance filtering via MongoDB's geospatial queries
      restaurant.locationCoords = {
        type: 'Point',
        coordinates: [coords.longitude, coords.latitude],
      };
      await restaurant.save();
      console.log(`Updated: ${restaurant.name}`);
    } else {
      console.warn(`No coordinates found for: ${restaurant.name}`);
    }

    // delay between requests
    await new Promise(r => setTimeout(r, 1000)); // 1 sec delay
  }

  mongoose.connection.close();
  console.log('Geocoding complete.');
}

main();
