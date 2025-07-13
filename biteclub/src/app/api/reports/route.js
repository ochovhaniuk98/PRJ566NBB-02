import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { Report } from '@/lib/model/dbSchema';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { contentType, reportedUserId, reporterType, reporterId, reason } = body;

    if (!contentType || !reportedUserId || !reporterType || !reporterId || !reason) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existing = await Report.findOne({
      contentType,
      reportedUserId,
      reporterType,
      reporterId,
      status: 'pending',
    });

    if (existing) {
      return NextResponse.json({ message: 'You have already reported this user/content.' }, { status: 409 });
    }

    const trimmedReason = reason?.trim();
    if (!trimmedReason) {
      return NextResponse.json({ message: 'Reason cannot be empty' }, { status: 400 });
    }

    const report = await Report.create({
      contentType,
      reportedUserId,
      reporterType,
      reporterId,
      reason: trimmedReason,
    });

    return NextResponse.json({ message: 'Report submitted', report }, { status: 201 });
  } catch (error) {
    console.error('[REPORT_POST_ERROR]: ', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const reports = await Report.find().sort({ createdAt: -1 }).populate('reporterId').populate('reportedUserId');

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('[REPORT_GET_ERROR]', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/*
NOTES:
.populate('reporterId') gives access to the full user or business user who made the report

Without populate:
{
  reporterId: '64fa76bc9d3a7e9230dfcbee',
  reporterType: 'User',
  reason: 'Inappropriate comment'
}

With populate('reporterId'):
{
  reporterType: 'User',
  reporterId: {
    _id: '64fa76bc9d3a7e9230dfcbee',
    username: 'cooluser123',
    email: 'cool@example.com',
    profilePic: '...'
  },
  reason: 'Inappropriate comment'
}
*/


