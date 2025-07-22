// /api/restaurants/cuisines/cuisineOfTheWeek/route.js

import { getCuisinesOfTheWeek } from '@/lib/cuisinesOfTheWeek';

export async function GET() {
  const cuisines = await getCuisinesOfTheWeek(1);
  return Response.json({ cuisines });
}
