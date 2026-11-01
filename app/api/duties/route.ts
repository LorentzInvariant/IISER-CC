import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth-server';
import { DutyAssignment } from '@/lib/types';

export async function GET() {
  const duties = db.getDuties();
  return NextResponse.json({ duties });
}

export async function POST(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can assign duties.' },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    if (!data.staffId || !data.responsibilityId || !data.dayOfWeek) {
      return NextResponse.json(
        { error: 'Staff, responsibility, and day of week are required.' },
        { status: 400 }
      );
    }

    const newDuty: DutyAssignment = {
      id: `duty_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      staffId: data.staffId,
      responsibilityId: data.responsibilityId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime || '09:00',
      endTime: data.endTime || '17:30',
      assignmentType: data.assignmentType || 'primary',
      notes: data.notes || '',
      effectiveFrom: data.effectiveFrom || new Date().toISOString().split('T')[0],
      effectiveUntil: data.effectiveUntil,
    };

    const added = db.addDuty(newDuty, admin.email);
    return NextResponse.json({ success: true, duty: added });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to assign duty';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can update duties.' },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    const { id, ...updates } = data;
    if (!id) {
      return NextResponse.json({ error: 'Duty ID is required.' }, { status: 400 });
    }

    const updated = db.updateDuty(id, updates, admin.email);
    if (!updated) {
      return NextResponse.json({ error: 'Duty assignment not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, duty: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update duty';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can remove duty assignments.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Duty ID is required.' }, { status: 400 });
    }

    const success = db.deleteDuty(id, admin.email);
    if (!success) {
      return NextResponse.json({ error: 'Duty assignment not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Duty assignment removed.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete duty';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
