import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth-server';
import { Announcement } from '@/lib/types';

export async function GET() {
  const announcements = db.getAnnouncements();
  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can post announcements.' },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Announcement title and content are required.' },
        { status: 400 }
      );
    }

    const newAnn: Announcement = {
      id: `ann_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      title: data.title,
      content: data.content,
      priority: data.priority || 'normal',
      authorName: admin.name,
      authorEmail: admin.email,
      createdAt: new Date().toISOString(),
      active: true,
    };

    const added = db.addAnnouncement(newAnn, admin.email);
    return NextResponse.json({ success: true, announcement: added });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to publish announcement';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can delete announcements.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Announcement ID is required.' }, { status: 400 });
    }

    const success = db.deleteAnnouncement(id, admin.email);
    if (!success) {
      return NextResponse.json({ error: 'Announcement not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Announcement deleted.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete announcement';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
