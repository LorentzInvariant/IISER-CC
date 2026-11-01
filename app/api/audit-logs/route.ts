import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  const admin = requireAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Only the Head of Computer Centre can view audit logs.' },
      { status: 403 }
    );
  }

  const logs = db.getAuditLogs();
  return NextResponse.json({ logs });
}
