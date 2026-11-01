import {
  DutyAssignment,
  StaffMember,
  Responsibility,
  SchedulingConflict,
  DayOfWeek,
  DAYS_OF_WEEK,
} from './types';

/**
 * Checks if two time intervals [startA, endA] and [startB, endB] overlap.
 * Time format is HH:MM in 24h format.
 */
export function timeOverlaps(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && startB < endA;
}

/**
 * Detects scheduling conflicts across staff, responsibilities, and duty assignments.
 */
export function detectSchedulingConflicts(
  duties: DutyAssignment[],
  staffList: StaffMember[],
  responsibilities: Responsibility[],
  checkDays: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
): SchedulingConflict[] {
  const conflicts: SchedulingConflict[] = [];
  const staffMap = new Map(staffList.map((s) => [s.id, s]));
  const respMap = new Map(responsibilities.map((r) => [r.id, r]));

  // 1. Check for staff assigned to overlapping times on the same day
  const dutiesByStaffAndDay = new Map<string, DutyAssignment[]>();

  for (const duty of duties) {
    const key = `${duty.staffId}_${duty.dayOfWeek}`;
    const list = dutiesByStaffAndDay.get(key) || [];
    list.push(duty);
    dutiesByStaffAndDay.set(key, list);
  }

  for (const [key, staffDuties] of dutiesByStaffAndDay.entries()) {
    if (staffDuties.length < 2) continue;
    const [staffId, day] = key.split('_');
    const staff = staffMap.get(staffId);
    const staffName = staff?.fullName || 'Unknown Staff';

    for (let i = 0; i < staffDuties.length; i++) {
      for (let j = i + 1; j < staffDuties.length; j++) {
        const d1 = staffDuties[i];
        const d2 = staffDuties[j];

        if (timeOverlaps(d1.startTime, d1.endTime, d2.startTime, d2.endTime)) {
          const r1Title = respMap.get(d1.responsibilityId)?.title || 'Task 1';
          const r2Title = respMap.get(d2.responsibilityId)?.title || 'Task 2';

          conflicts.push({
            type: 'overlap',
            severity: 'warning',
            dayOfWeek: day as DayOfWeek,
            staffId,
            staffName,
            message: `${staffName} has overlapping duties on ${day} (${d1.startTime}-${d1.endTime}: "${r1Title}" and ${d2.startTime}-${d2.endTime}: "${r2Title}").`,
          });
        }
      }
    }
  }

  // 2. Check for active responsibilities that have no primary staff assigned on weekdays
  const activeResponsibilities = responsibilities.filter((r) => r.status === 'active');

  for (const resp of activeResponsibilities) {
    const respDuties = duties.filter((d) => d.responsibilityId === resp.id);

    // Check if completely unassigned
    if (respDuties.length === 0) {
      conflicts.push({
        type: 'unassigned_task',
        severity: 'error',
        responsibilityId: resp.id,
        responsibilityTitle: resp.title,
        message: `Responsibility "${resp.title}" has no staff assigned on any day.`,
      });
      continue;
    }

    // Check if missing primary coverage on weekdays
    const daysWithPrimary = new Set(
      respDuties.filter((d) => d.assignmentType === 'primary').map((d) => d.dayOfWeek)
    );

    const missingDays = checkDays.filter((d) => !daysWithPrimary.has(d));
    if (missingDays.length > 0) {
      conflicts.push({
        type: 'unassigned_task',
        severity: 'warning',
        responsibilityId: resp.id,
        responsibilityTitle: resp.title,
        message: `"${resp.title}" lacks primary staff coverage on: ${missingDays.join(', ')}.`,
      });
    }

    // Check backup coverage
    const hasBackup = respDuties.some((d) => d.assignmentType === 'secondary');
    if (!hasBackup && respDuties.length > 0) {
      conflicts.push({
        type: 'no_backup_coverage',
        severity: 'warning',
        responsibilityId: resp.id,
        responsibilityTitle: resp.title,
        message: `"${resp.title}" has no secondary / backup staff assigned.`,
      });
    }
  }

  return conflicts;
}

/**
 * Advanced search across tasks, services, keywords, and staff
 */
export interface SearchResultItem {
  responsibility: Responsibility;
  primaryStaff: StaffMember[];
  secondaryStaff: StaffMember[];
  onDutyToday: StaffMember[];
  matchingDays: DayOfWeek[];
}

export function searchPortalDirectory(
  query: string,
  selectedDay: DayOfWeek | 'all',
  selectedCategory: string | 'all',
  responsibilities: Responsibility[],
  staffList: StaffMember[],
  duties: DutyAssignment[],
  currentDayOfWeek?: DayOfWeek
): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  const staffMap = new Map(staffList.map((s) => [s.id, s]));

  const results: SearchResultItem[] = [];

  for (const resp of responsibilities) {
    if (resp.status === 'archived') continue;

    // Filter by category
    if (selectedCategory !== 'all' && resp.category !== selectedCategory) {
      continue;
    }

    // Duties for this responsibility
    const respDuties = duties.filter((d) => d.responsibilityId === resp.id);

    // Filter by day if selected
    if (selectedDay !== 'all') {
      const assignedOnSelectedDay = respDuties.some((d) => d.dayOfWeek === selectedDay);
      if (!assignedOnSelectedDay) continue;
    }

    // Gather staff assigned
    const primaryStaffIds = Array.from(
      new Set(
        respDuties
          .filter((d) => d.assignmentType === 'primary')
          .map((d) => d.staffId)
      )
    );
    const secondaryStaffIds = Array.from(
      new Set(
        respDuties
          .filter((d) => d.assignmentType === 'secondary')
          .map((d) => d.staffId)
      )
    );

    const primaryStaff = primaryStaffIds
      .map((id) => staffMap.get(id))
      .filter((s): s is StaffMember => Boolean(s && s.status !== 'archived'));

    const secondaryStaff = secondaryStaffIds
      .map((id) => staffMap.get(id))
      .filter((s): s is StaffMember => Boolean(s && s.status !== 'archived'));

    // Staff on duty today (or target day)
    const effectiveDay = currentDayOfWeek || 'Monday';
    const todayDuties = respDuties.filter((d) => d.dayOfWeek === effectiveDay);
    const onDutyToday = Array.from(new Set(todayDuties.map((d) => d.staffId)))
      .map((id) => staffMap.get(id))
      .filter((s): s is StaffMember => Boolean(s && s.status === 'active'));

    const matchingDays = Array.from(new Set(respDuties.map((d) => d.dayOfWeek))) as DayOfWeek[];

    // If there is a text query, verify match
    if (q.length > 0) {
      const titleMatch = resp.title.toLowerCase().includes(q);
      const descMatch = resp.description.toLowerCase().includes(q);
      const catMatch = resp.category.toLowerCase().includes(q);
      const keywordMatch = resp.keywords?.some((k) => k.toLowerCase().includes(q));

      const staffNameMatch = [...primaryStaff, ...secondaryStaff].some(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.designation.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );

      if (!titleMatch && !descMatch && !catMatch && !keywordMatch && !staffNameMatch) {
        continue;
      }
    }

    results.push({
      responsibility: resp,
      primaryStaff,
      secondaryStaff,
      onDutyToday,
      matchingDays,
    });
  }

  return results;
}
