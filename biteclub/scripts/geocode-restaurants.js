// this script was run to populate all the restaurants with their location coordinates (latitude and longitude)
// based on the restaurant's address, we can get coordinates (latitude and longitude)
// this is needed for distance filtering and user geolocation confirmation
import mongoose from 'mongoose';
import axios from 'axios';
import dbConnect from '../src/lib/db/dbConnect.js';
import { Restaurant } from '../src/lib/model/dbSchema.js';

async function geocodeAddress(address) {
  try {
    const encoded = encodeURIComponent(address); // takes the address string and encodes it for safe use in a URL query parameter ("test?" -> "?x=test%3F")
    // request to OpenStreetMap Nominatim geocoding API to get geo coordinates for the address provided
    const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`, {
      headers: { 'User-Agent': 'Biteclub/1.0' },
    });
    const result = res.data[0];
    if (!result) return null;

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
  } catch (err) {
    console.error(`Failed to geocode ${address}:`, err.message);
    return null;
  }
}

async function main() {
  await dbConnect();

  // now get the restaurants where coordinates were set
  const restaurants = await Restaurant.find({
    $or: [{ latitude: { $exists: true } }, { longitude: { $exists: true } }],
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
