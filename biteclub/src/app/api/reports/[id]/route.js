// /api/reports/${report._id}
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { Report, User, BlogPost, CommentPost, InternalReview, ExternalReview } from '@/lib/model/dbSchema';

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

    // If approved, remove the reported content from DB
    if (status === 'Approved' || status === 'ApprovedAndBanned') {
      try {
        const contentId = report.contentId?._id || report.contentId; // handle populated or raw ID
        switch (report.contentType) {
          case 'BlogPost':
            await BlogPost.findByIdAndDelete(contentId);
            break;
          case 'CommentPost':
            await CommentPost.findByIdAndDelete(contentId);
            break;
          case 'InternalReview':
            await InternalReview.findByIdAndDelete(contentId);
            break;
          case 'ExternalReview':
            await ExternalReview.findByIdAndDelete(contentId);
            break;
          default:
            console.warn(`[WARN] No deletion logic for content type: ${report.contentType}`);
        }
      } catch (delErr) {
        console.error(`[DELETE_CONTENT_ERROR] Failed to delete content ${report.contentId}:`, delErr);
      }
    }

    return NextResponse.json({ message: 'Report updated', report });
  } catch (error) {
    console.error('[REPORT_PATCH_ERROR]', error);
    return NextResponse.json({ message: '(reports PATCH) Server error' }, { status: 500 });
  }
}
