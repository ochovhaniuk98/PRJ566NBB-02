import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { Report, User } from '@/lib/model/dbSchema';

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params
    const reportId = id;

    const body = await req.json();
    const { status, resolvedAt, incrementStrike } = body;

    if (!['Approved', 'Rejected', 'ApprovedAndBanned'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }

    report.status = status;
    report.resolvedAt = resolvedAt ? new Date(resolvedAt) : new Date(); // new Date() ensures it's stored correctly as a Date in MongoDB
    await report.save();

    // User get one strike upon "Approved"
    if (incrementStrike) {
      const user = await User.findById(report.reportedUserId);
      if (user) {
        user.strike = (user.strike || 0) + 1;
        await user.save();
      } else {
        console.warn(`[WARN] Reported user not found for report ${reportId}`);
      }
    }

    // ***[TODO?]***: (Not required in Sprint 3)
    // IF APPROVED, REMOVE THE REPORTED CONTENT FROM DB (or add a status for the content e.g. status: reported)

    return NextResponse.json({ message: 'Report updated', report });
  } catch (error) {
    console.error('[REPORT_PATCH_ERROR]', error);
    return NextResponse.json({ message: '(reports PATCH) Server error' }, { status: 500 });
  }
}
