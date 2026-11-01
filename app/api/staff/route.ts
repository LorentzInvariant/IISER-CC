import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth-server';
import { StaffMember } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeArchived = searchParams.get('includeArchived') === 'true';
  const staff = db.getStaff(includeArchived);
  return NextResponse.json({ staff });
}

export async function POST(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can add staff.' },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    if (!data.fullName || !data.designation || !data.email) {
      return NextResponse.json(
        { error: 'Full name, designation, and institutional email are required.' },
        { status: 400 }
      );
    }

    const newStaff: StaffMember = {
      id: `staff_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      fullName: data.fullName,
      designation: data.designation,
      department: data.department || 'Computer Centre',
      email: data.email,
      phone: data.phone || 'N/A',
      officeLocation: data.officeLocation || 'Computer Centre Building',
      status: 'active',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      workingDays: data.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: data.workingHours || '09:00 AM - 05:30 PM',
      primaryResponsibilities: data.primaryResponsibilities || [],
      secondaryResponsibilities: data.secondaryResponsibilities || [],
      notes: data.notes || '',
    };

    const added = db.addStaff(newStaff, admin.email);
    return NextResponse.json({ success: true, staff: added });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add staff member';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can modify staff records.' },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    const { id, ...updates } = data;
    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required.' }, { status: 400 });
    }

    const updated = db.updateStaff(id, updates, admin.email);
    if (!updated) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, staff: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update staff member';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can archive staff.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required.' }, { status: 400 });
    }

    const success = db.archiveStaff(id, admin.email);
    if (!success) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Staff archived successfully.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to archive staff member';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
