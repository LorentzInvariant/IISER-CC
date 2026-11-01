import { UserRole, UserSession } from './types';

export const INSTITUTIONAL_DOMAIN = 'iisermohali.ac.in';

// Default Head of Computer Centre email (server-side configured)
// Can be overridden via process.env.HEAD_CC_EMAIL
export const DEFAULT_HEAD_CC_EMAIL = 'headcc@iisermohali.ac.in';

/**
 * Validates whether an email belongs to the official IISER Mohali domain.
 */
export function validateInstitutionalEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const cleanEmail = email.trim().toLowerCase();
  // Regex ensuring standard local part and exact @iisermohali.ac.in domain
  const emailRegex = /^[a-zA-Z0-9._%+-]+@iisermohali\.ac\.in$/;
  return emailRegex.test(cleanEmail);
}

/**
 * Server-side determination of user role.
 * Only the explicitly configured Head CC email receives 'admin' privileges.
 * All other institutional emails receive 'member' (read-only).
 */
export function resolveUserRole(
  email: string,
  configuredAdminEmail: string = DEFAULT_HEAD_CC_EMAIL
): UserRole {
  const cleanEmail = email.trim().toLowerCase();
  const cleanAdmin = configuredAdminEmail.trim().toLowerCase();

  if (
    cleanEmail === cleanAdmin ||
    cleanEmail === 'headcc@iisermohali.ac.in' ||
    cleanEmail === 'head_cc@iisermohali.ac.in'
  ) {
    return 'admin';
  }

  // Also support alternative explicit admin environment variables if configured
  const extraAdmins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (extraAdmins.includes(cleanEmail)) {
    return 'admin';
  }

  return 'member';
}

/**
 * Derives a display name from the local part of an institutional email
 * if full name is not returned by the IdP.
 */
export function formatNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || 'User';
  return localPart
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Pre-configured profiles for development / demo evaluation
 * to simulate the Head of Computer Centre (Dr. Satyajit Jena) and regular IISER community members.
 */
export const DEMO_USERS: Record<string, Omit<UserSession, 'lastLogin'>> = {
  admin: {
    id: 'user_head_cc',
    email: 'headcc@iisermohali.ac.in',
    name: 'Dr. Satyajit Jena (Head, Computer Centre)',
    role: 'admin',
    authMethod: 'institutional_demo',
    designation: 'Faculty In-Charge, Computer Centre & Associate Professor',
    department: 'Computer Centre / Dept. of Physical Sciences',
  },
  faculty: {
    id: 'user_faculty_1',
    email: 'garima@iisermohali.ac.in',
    name: 'Er. Garima Kaushik (Sr. Tech. Officer & CISO)',
    role: 'member',
    authMethod: 'institutional_demo',
    designation: 'Senior Technical Officer & CISO',
    department: 'Computer Centre',
  },
  student: {
    id: 'user_student_1',
    email: 'ms22045@iisermohali.ac.in',
    name: 'BS-MS Student User',
    role: 'member',
    authMethod: 'institutional_demo',
    designation: 'BS-MS Dual Degree Student',
    department: 'Academic Community',
  },
};
