import test from 'node:test';
import assert from 'node:assert/strict';
import {
  timeOverlaps,
  detectSchedulingConflicts,
  searchPortalDirectory,
} from './duty-scheduler';
import {
  validateInstitutionalEmail,
  resolveUserRole,
  DEFAULT_HEAD_CC_EMAIL,
} from './auth-rules';
import { StaffMember, Responsibility, DutyAssignment } from './types';

test('validateInstitutionalEmail accepts valid IISER Mohali emails', () => {
  assert.equal(validateInstitutionalEmail('head_cc@iisermohali.ac.in'), true);
  assert.equal(validateInstitutionalEmail('arun.kumar@iisermohali.ac.in'), true);
  assert.equal(validateInstitutionalEmail('ms21045@iisermohali.ac.in'), true);
  assert.equal(validateInstitutionalEmail('HEAD_CC@IISERMOHALI.AC.IN'), true);
});

test('validateInstitutionalEmail rejects non-institutional or malformed emails', () => {
  assert.equal(validateInstitutionalEmail('user@gmail.com'), false);
  assert.equal(validateInstitutionalEmail('hacker@iitd.ac.in'), false);
  assert.equal(validateInstitutionalEmail('fake@iisermohali.ac.in.attacker.com'), false);
  assert.equal(validateInstitutionalEmail(''), false);
  assert.equal(validateInstitutionalEmail('iisermohali.ac.in'), false);
});

test('resolveUserRole grants admin exclusively to configured Head CC email', () => {
  assert.equal(resolveUserRole('head_cc@iisermohali.ac.in', DEFAULT_HEAD_CC_EMAIL), 'admin');
  assert.equal(resolveUserRole('HEAD_CC@IISERMOHALI.AC.IN', DEFAULT_HEAD_CC_EMAIL), 'admin');
  assert.equal(resolveUserRole('arun.kumar@iisermohali.ac.in', DEFAULT_HEAD_CC_EMAIL), 'member');
  assert.equal(resolveUserRole('student@iisermohali.ac.in', DEFAULT_HEAD_CC_EMAIL), 'member');
});

test('timeOverlaps correctly identifies overlapping and non-overlapping shifts', () => {
  assert.equal(timeOverlaps('09:00', '13:00', '12:00', '16:00'), true);
  assert.equal(timeOverlaps('09:00', '12:00', '12:00', '15:00'), false); // contiguous, no overlap
  assert.equal(timeOverlaps('09:00', '11:00', '14:00', '17:00'), false);
  assert.equal(timeOverlaps('10:00', '14:00', '09:00', '17:00'), true); // subset
});

test('detectSchedulingConflicts flags overlapping duties for same staff on same day', () => {
  const staff: StaffMember[] = [
    {
      id: 'staff-1',
      fullName: 'Rajesh Sharma',
      designation: 'Senior Technical Officer',
      department: 'Computer Centre',
      email: 'rajesh@iisermohali.ac.in',
      phone: '0172-229-1001',
      officeLocation: 'CC Room 101',
      status: 'active',
      joiningDate: '2015-08-01',
      workingDays: ['Monday', 'Tuesday', 'Wednesday'],
      workingHours: '09:00 - 17:30',
      primaryResponsibilities: ['Campus Wi-Fi'],
      secondaryResponsibilities: [],
    },
  ];

  const responsibilities: Responsibility[] = [
    {
      id: 'resp-wifi',
      title: 'Campus Wi-Fi',
      description: 'Access points and eduroam',
      category: 'Network & Security',
      escalationProcedure: 'Contact Head CC',
      status: 'active',
      keywords: ['wifi', 'wireless', 'internet'],
    },
    {
      id: 'resp-hpc',
      title: 'HPC Cluster',
      description: 'High performance compute nodes',
      category: 'HPC & Infrastructure',
      escalationProcedure: 'Contact Head CC',
      status: 'active',
      keywords: ['hpc', 'cluster', 'slurm'],
    },
  ];

  const duties: DutyAssignment[] = [
    {
      id: 'd1',
      staffId: 'staff-1',
      responsibilityId: 'resp-wifi',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '13:00',
      assignmentType: 'primary',
      effectiveFrom: '2026-01-01',
    },
    {
      id: 'd2',
      staffId: 'staff-1',
      responsibilityId: 'resp-hpc',
      dayOfWeek: 'Monday',
      startTime: '11:00',
      endTime: '15:00',
      assignmentType: 'primary',
      effectiveFrom: '2026-01-01',
    },
  ];

  const conflicts = detectSchedulingConflicts(duties, staff, responsibilities);
  const overlapConflict = conflicts.find((c) => c.type === 'overlap');
  assert.ok(overlapConflict, 'Should detect overlap conflict');
  assert.equal(overlapConflict?.staffId, 'staff-1');
});

test('searchPortalDirectory finds staff by keywords and technical terms', () => {
  const staff: StaffMember[] = [
    {
      id: 'staff-net',
      fullName: 'Amit Patel',
      designation: 'Network Engineer',
      department: 'Computer Centre',
      email: 'amit@iisermohali.ac.in',
      phone: '0172-229-1002',
      officeLocation: 'CC Room 104',
      status: 'active',
      joiningDate: '2018-03-15',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: '09:00 - 17:30',
      primaryResponsibilities: ['Campus Wi-Fi & Eduroam'],
      secondaryResponsibilities: [],
    },
  ];

  const responsibilities: Responsibility[] = [
    {
      id: 'resp-1',
      title: 'Campus Wi-Fi & Eduroam',
      description: 'Maintains 500+ APs across academic blocks and hostels.',
      category: 'Network & Security',
      escalationProcedure: 'Email net-admin@iisermohali.ac.in',
      status: 'active',
      keywords: ['wireless', 'internet', 'connectivity', 'eduroam', 'ssids'],
    },
  ];

  const duties: DutyAssignment[] = [
    {
      id: 'd-net-mon',
      staffId: 'staff-net',
      responsibilityId: 'resp-1',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '17:30',
      assignmentType: 'primary',
      effectiveFrom: '2026-01-01',
    },
  ];

  // Search by keyword "connectivity"
  const keywordResults = searchPortalDirectory('connectivity', 'all', 'all', responsibilities, staff, duties);
  assert.equal(keywordResults.length, 1);
  assert.equal(keywordResults[0].responsibility.title, 'Campus Wi-Fi & Eduroam');
  assert.equal(keywordResults[0].primaryStaff[0].fullName, 'Amit Patel');

  // Search by staff name "Amit"
  const nameResults = searchPortalDirectory('Amit', 'all', 'all', responsibilities, staff, duties);
  assert.equal(nameResults.length, 1);
});
