// /api/restaurants/cuisines/cuisinesOfTheWeek/route.js

import { getCuisinesOfTheWeek } from '@/lib/cuisinesOfTheWeek';

export async function GET() {
  const cuisines = await getCuisinesOfTheWeek();
  return Response.json({ cuisines });
}
