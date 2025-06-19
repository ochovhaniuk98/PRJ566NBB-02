import dbConnect from '@/lib/db/dbConnect';
import { InternalReview, ExternalReview } from '@/lib/model/dbSchema';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    await dbConnect();

    const [internalCount, externalCount] = await Promise.all([
      InternalReview.countDocuments({ user_id: userId }),
      ExternalReview.countDocuments({ user_id: userId }),
    ]);

    const total = internalCount + externalCount;

    return NextResponse.json({
      internal: internalCount,
      external: externalCount,
      total,
    });
  } catch (err) {
    console.error('Error counting reviews:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
