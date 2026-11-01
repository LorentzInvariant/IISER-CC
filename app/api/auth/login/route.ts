import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  validateInstitutionalEmail,
  resolveUserRole,
  formatNameFromEmail,
  DEMO_USERS,
  DEFAULT_HEAD_CC_EMAIL,
} from '@/lib/auth-rules';
import { SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { UserSession } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, demoRole, authType } = body;

    let sessionUser: UserSession;

    // Path A: Quick Demo Mode selection (e.g. 'admin', 'faculty', 'student')
    if (demoRole && DEMO_USERS[demoRole]) {
      const preset = DEMO_USERS[demoRole];
      sessionUser = {
        ...preset,
        lastLogin: new Date().toISOString(),
      };
    }
    // Path B: Direct institutional email entry
    else if (email) {
      const cleanEmail = email.trim().toLowerCase();

      // Enforce institutional domain check
      if (!validateInstitutionalEmail(cleanEmail)) {
        return NextResponse.json(
          {
            error: 'Access restricted. Please use a valid @iisermohali.ac.in institutional account.',
          },
          { status: 403 }
        );
      }

      // Check password if provided in demo mode (any demo password accepted for prototype, or check dummy)
      if (password && password.length < 4) {
        return NextResponse.json(
          { error: 'Password must be at least 4 characters long.' },
          { status: 400 }
        );
      }

      const role = resolveUserRole(cleanEmail);
      const isHead =
        cleanEmail === DEFAULT_HEAD_CC_EMAIL ||
        cleanEmail === 'head_cc@iisermohali.ac.in';

      sessionUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        email: cleanEmail,
        name: isHead
          ? 'Dr. Satyajit Jena (Head, Computer Centre)'
          : formatNameFromEmail(cleanEmail),
        role,
        authMethod: authType === 'sso' ? 'sso_simulation' : 'institutional_demo',
        designation: isHead
          ? 'Faculty In-Charge, Computer Centre & Associate Professor'
          : 'IISER Mohali Member',
        department: isHead
          ? 'Computer Centre / Dept. of Physical Sciences'
          : 'IISER Community',
        lastLogin: new Date().toISOString(),
      };
    } else {
      return NextResponse.json(
        { error: 'Institutional email or demo profile is required.' },
        { status: 400 }
      );
    }

    // Generate session token and store
    const sessionToken = `iiser_sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    db.setSession(sessionToken, sessionUser);

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      message: `Authenticated as ${sessionUser.role === 'admin' ? 'Head of Computer Centre (Administrator)' : 'IISER Community Member'}`,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error during authentication';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
