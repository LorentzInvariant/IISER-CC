import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  const session = getCurrentSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  return NextResponse.json({ authenticated: true, user: session });
}
