import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { Restaurant } from '@/lib/model/dbSchema';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';

  await dbConnect();
  const regex = new RegExp(query, 'i');

  const results = await Restaurant.find(
    {
      $or: [
        { name: regex },
        { location: regex },
      ],
    },
    'name location'
  );

  return NextResponse.json(
    results.map(r => ({
      id: r._id,
      name: r.name,
      location: r.location.toUpperCase(),
    }))
  );
}
