import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { User, InternalReview, ExternalReview } from '@/lib/model/dbSchema';

export async function POST(req) {
  try {
    const { internalReviewIds = [], externalReviewIds = [], userId } = await req.json();

    if (!userId || (internalReviewIds.length === 0 && externalReviewIds.length === 0)) {
      return NextResponse.json({ error: 'Missing review IDs or user ID' }, { status: 400 });
    }

    await dbConnect();

    const result = {};

    // Delete internal reviews
    if (internalReviewIds.length > 0) {
      const res = await InternalReview.deleteMany({ _id: { $in: internalReviewIds }, user_id: userId });
      result.internalDeleted = res.deletedCount;
    }

    // Delete external reviews (Instagram)
    if (externalReviewIds.length > 0) {
      const res = await ExternalReview.deleteMany({ _id: { $in: externalReviewIds }, user_id: userId });
      result.externalDeleted = res.deletedCount;
    }

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (err) {
    console.error('Error deleting reviews:', err);
    return NextResponse.json({ error: 'Failed to delete reviews' }, { status: 500 });
  }
}
