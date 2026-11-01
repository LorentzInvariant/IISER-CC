import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth-server';
import { Responsibility } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeArchived = searchParams.get('includeArchived') === 'true';
  const responsibilities = db.getResponsibilities(includeArchived);
  return NextResponse.json({ responsibilities });
}

export async function POST(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can add responsibilities.' },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    if (!data.title || !data.category) {
      return NextResponse.json(
        { error: 'Responsibility title and category are required.' },
        { status: 400 }
      );
    }

    const newResp: Responsibility = {
      id: `resp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      title: data.title,
      description: data.description || '',
      category: data.category,
      escalationProcedure: data.escalationProcedure || 'Contact Computer Centre Helpdesk',
      status: 'active',
      keywords: data.keywords || [],
    };

    const added = db.addResponsibility(newResp, admin.email);
    return NextResponse.json({ success: true, responsibility: added });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add responsibility';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can modify responsibilities.' },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    const { id, ...updates } = data;
    if (!id) {
      return NextResponse.json({ error: 'Responsibility ID is required.' }, { status: 400 });
    }

    const updated = db.updateResponsibility(id, updates, admin.email);
    if (!updated) {
      return NextResponse.json({ error: 'Responsibility not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, responsibility: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update responsibility';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
