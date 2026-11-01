export type UserRole = 'admin' | 'member';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  authMethod: 'institutional_demo' | 'sso_production' | 'sso_simulation';
  designation?: string;
  department?: string;
  lastLogin: string;
}

export type StaffStatus = 'active' | 'on_leave' | 'archived';

export interface StaffMember {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  officeLocation: string;
  photographUrl?: string;
  status: StaffStatus;
  joiningDate: string;
  workingDays: DayOfWeek[];
  workingHours: string;
  primaryResponsibilities: string[];
  secondaryResponsibilities: string[];
  isHead?: boolean;
  notes?: string;
}

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export type ResponsibilityCategory =
  | 'Network & Security'
  | 'HPC & Infrastructure'
  | 'End-User & Computer Labs'
  | 'Web & Academic Portals'
  | 'Hardware & Classrooms';

export interface Responsibility {
  id: string;
  title: string;
  description: string;
  category: ResponsibilityCategory;
  escalationProcedure: string;
  status: 'active' | 'suspended' | 'archived';
  keywords: string[];
}

export type AssignmentType = 'primary' | 'secondary';

export interface DutyAssignment {
  id: string;
  staffId: string;
  responsibilityId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "17:30"
  assignmentType: AssignmentType;
  notes?: string;
  effectiveFrom: string;
  effectiveUntil?: string;
}

export interface SchedulingConflict {
  type: 'overlap' | 'unassigned_task' | 'no_backup_coverage';
  severity: 'warning' | 'error';
  message: string;
  responsibilityId?: string;
  responsibilityTitle?: string;
  staffId?: string;
  staffName?: string;
  dayOfWeek?: DayOfWeek;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  authorName: string;
  authorEmail: string;
  createdAt: string;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  adminEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ARCHIVE' | 'ASSIGN_DUTY' | 'UNASSIGN_DUTY';
  entityType: 'staff' | 'responsibility' | 'duty_assignment' | 'announcement';
  entityId: string;
  summary: string;
  timestamp: string;
  details?: Record<string, unknown>;
}
