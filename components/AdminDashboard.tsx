'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
  StaffMember,
  Responsibility,
  DutyAssignment,
  AuditLogEntry,
  DayOfWeek,
  DAYS_OF_WEEK,
  ResponsibilityCategory,
} from '@/lib/types';
import { detectSchedulingConflicts } from '@/lib/duty-scheduler';

interface AdminDashboardProps {
  staffList: StaffMember[];
  responsibilities: Responsibility[];
  duties: DutyAssignment[];
  auditLogs: AuditLogEntry[];
  onAddStaff: (data: Partial<StaffMember>) => Promise<void>;
  onUpdateStaff: (id: string, data: Partial<StaffMember>) => Promise<void>;
  onArchiveStaff: (id: string) => Promise<void>;
  onAddDuty: (data: Partial<DutyAssignment>) => Promise<void>;
  onDeleteDuty: (id: string) => Promise<void>;
  onAddResponsibility: (data: Partial<Responsibility>) => Promise<void>;
  onUpdateResponsibility: (id: string, data: Partial<Responsibility>) => Promise<void>;
  onRefreshData: () => void;
}

export function AdminDashboard({
  staffList,
  responsibilities,
  duties,
  auditLogs,
  onAddStaff,
  onUpdateStaff,
  onArchiveStaff,
  onAddDuty,
  onDeleteDuty,
  onAddResponsibility,
  onUpdateResponsibility,
  onRefreshData,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'staff' | 'duties' | 'responsibilities' | 'audit'>(
    'duties'
  );

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    designation: '',
    department: 'Computer Centre',
    email: '',
    phone: '',
    officeLocation: 'Computer Centre Building',
    workingHours: '09:00 AM - 05:30 PM',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[],
    primaryResponsibilitiesText: '',
    notes: '',
  });

  const [dutyForm, setDutyForm] = useState({
    staffId: staffList[0]?.id || '',
    responsibilityId: responsibilities[0]?.id || '',
    dayOfWeek: 'Monday' as DayOfWeek,
    startTime: '09:00',
    endTime: '17:30',
    assignmentType: 'primary' as 'primary' | 'secondary',
    notes: '',
  });

  const [showAddRespModal, setShowAddRespModal] = useState(false);
  const [editingResp, setEditingResp] = useState<Responsibility | null>(null);
  const [respForm, setRespForm] = useState({
    title: '',
    description: '',
    category: 'Network & Security' as ResponsibilityCategory,
    escalationProcedure: 'Contact Computer Centre helpdesk',
    keywordsText: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const conflicts = detectSchedulingConflicts(duties, staffList, responsibilities);
  const staffMap = new Map(staffList.map((s) => [s.id, s]));
  const respMap = new Map(responsibilities.map((r) => [r.id, r]));

  function notify(msg: string) {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  }

  async function handleSaveStaff(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Partial<StaffMember> = {
        fullName: staffForm.fullName,
        designation: staffForm.designation,
        department: staffForm.department,
        email: staffForm.email,
        phone: staffForm.phone,
        officeLocation: staffForm.officeLocation,
        workingHours: staffForm.workingHours,
        workingDays: staffForm.workingDays,
        primaryResponsibilities: staffForm.primaryResponsibilitiesText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        notes: staffForm.notes,
      };

      if (editingStaff) {
        await onUpdateStaff(editingStaff.id, payload);
        notify(`Updated record for ${payload.fullName}`);
      } else {
        await onAddStaff(payload);
        notify(`Added staff member: ${payload.fullName}`);
      }
      setShowAddStaffModal(false);
      setEditingStaff(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDuty(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddDuty({
        staffId: dutyForm.staffId,
        responsibilityId: dutyForm.responsibilityId,
        dayOfWeek: dutyForm.dayOfWeek,
        startTime: dutyForm.startTime,
        endTime: dutyForm.endTime,
        assignmentType: dutyForm.assignmentType,
        notes: dutyForm.notes,
      });
      notify('Duty assignment recorded.');
      setDutyForm((prev) => ({ ...prev, notes: '' }));
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveResp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Partial<Responsibility> = {
        title: respForm.title,
        description: respForm.description,
        category: respForm.category,
        escalationProcedure: respForm.escalationProcedure,
        keywords: respForm.keywordsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingResp) {
        await onUpdateResponsibility(editingResp.id, payload);
        notify(`Updated service entry: ${payload.title}`);
      } else {
        await onAddResponsibility(payload);
        notify(`Created service entry: ${payload.title}`);
      }
      setShowAddRespModal(false);
      setEditingResp(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Administrative Header & Tabular Summary */}
      <div className="bg-white border border-[#182026] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E5E2DC]">
          <div>
            <div className="text-xs text-[#9E3B24] font-semibold">
              Head of Computer Centre · Administrative Control
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0D1B2A] mt-0.5">
              Portal Administration &amp; Duty Allocation Register
            </h2>
          </div>

          <div className="text-xs text-stone-600 font-tabular">
            Access Level: Administrator
          </div>
        </div>

        {/* Clean Tabular Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div>
            <div className="text-stone-500">Active Personnel</div>
            <div className="text-2xl font-bold font-tabular text-[#0D1B2A] mt-0.5">
              {staffList.filter((s) => s.status !== 'archived').length}
            </div>
          </div>
          <div className="sm:border-l sm:border-[#E5E2DC] sm:pl-6">
            <div className="text-stone-500">Service Catalogue</div>
            <div className="text-2xl font-bold font-tabular text-[#0D1B2A] mt-0.5">
              {responsibilities.length}
            </div>
          </div>
          <div className="sm:border-l sm:border-[#E5E2DC] sm:pl-6">
            <div className="text-stone-500">Weekly Duty Shifts</div>
            <div className="text-2xl font-bold font-tabular text-[#0D1B2A] mt-0.5">
              {duties.length}
            </div>
          </div>
          <div className="sm:border-l sm:border-[#E5E2DC] sm:pl-6">
            <div className="text-stone-500">Coverage Advisories</div>
            <div
              className={`text-2xl font-bold font-tabular mt-0.5 ${
                conflicts.length > 0 ? 'text-[#9E3B24]' : 'text-[#0D1B2A]'
              }`}
            >
              {conflicts.length}
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-white border border-[#0D1B2A] text-[#0D1B2A] text-xs font-semibold">
          {statusMessage}
        </div>
      )}

      {/* Sub-navigation Bar */}
      <div className="flex flex-wrap border-b border-[#D8D5CD] gap-6">
        {(
          [
            { id: 'duties', label: `Duty Allocations (${duties.length})` },
            { id: 'staff', label: `Staff Personnel (${staffList.length})` },
            { id: 'responsibilities', label: `Service Catalogue (${responsibilities.length})` },
            { id: 'audit', label: `Audit Log (${auditLogs.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#9E3B24] text-[#0D1B2A]'
                : 'border-transparent text-stone-500 hover:text-[#0D1B2A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Duty Allocations */}
      {activeTab === 'duties' && (
        <div className="space-y-6">
          {conflicts.length > 0 && (
            <div className="p-5 bg-white border border-[#9E3B24] space-y-2">
              <div className="text-xs font-semibold text-[#9E3B24]">
                Scheduling &amp; Coverage Advisories ({conflicts.length})
              </div>
              <ul className="space-y-1 text-xs text-stone-700">
                {conflicts.map((c, i) => (
                  <li key={i}>· {c.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* New Duty Assignment Form */}
          <div className="bg-white border border-[#D8D5CD] p-6 space-y-5">
            <h3 className="font-editorial text-xl font-bold text-[#0D1B2A]">
              Assign Responsibility or Shift
            </h3>

            <form
              onSubmit={handleSaveDuty}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Officer
                </label>
                <select
                  value={dutyForm.staffId}
                  onChange={(e) => setDutyForm({ ...dutyForm, staffId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs font-medium text-[#182026]"
                  required
                >
                  {staffList
                    .filter((s) => s.status !== 'archived')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Responsibility
                </label>
                <select
                  value={dutyForm.responsibilityId}
                  onChange={(e) => setDutyForm({ ...dutyForm, responsibilityId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs font-medium text-[#182026]"
                  required
                >
                  {responsibilities.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Day of Week
                </label>
                <select
                  value={dutyForm.dayOfWeek}
                  onChange={(e) =>
                    setDutyForm({ ...dutyForm, dayOfWeek: e.target.value as DayOfWeek })
                  }
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs font-medium text-[#182026]"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Assignment Role
                </label>
                <select
                  value={dutyForm.assignmentType}
                  onChange={(e) =>
                    setDutyForm({
                      ...dutyForm,
                      assignmentType: e.target.value as 'primary' | 'secondary',
                    })
                  }
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs font-medium text-[#182026]"
                >
                  <option value="primary">Primary Officer</option>
                  <option value="secondary">Reserve / Backup Officer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={dutyForm.startTime}
                  onChange={(e) => setDutyForm({ ...dutyForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs font-tabular text-[#182026]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={dutyForm.endTime}
                  onChange={(e) => setDutyForm({ ...dutyForm, endTime: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs font-tabular text-[#182026]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Operational Instructions
                </label>
                <input
                  type="text"
                  value={dutyForm.notes}
                  onChange={(e) => setDutyForm({ ...dutyForm, notes: e.target.value })}
                  placeholder="e.g., Weekly switch inspection, lab BIOS audit..."
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                />
              </div>

              <div className="lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Recording...' : 'Record Duty Assignment'}
                </button>
              </div>
            </form>
          </div>

          {/* Roster Table */}
          <div className="bg-white border border-[#D8D5CD] overflow-hidden">
            <div className="px-6 py-3.5 bg-[#F7F6F2] border-b border-[#D8D5CD] font-semibold text-xs text-[#0D1B2A] flex items-center justify-between">
              <span>Active Duty Roster ({duties.length})</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F6F2]/60 text-[#0D1B2A] border-b border-[#D8D5CD] font-semibold">
                    <th className="py-2.5 px-5">Day</th>
                    <th className="py-2.5 px-5">Officer</th>
                    <th className="py-2.5 px-5">Responsibility</th>
                    <th className="py-2.5 px-5">Hours</th>
                    <th className="py-2.5 px-5">Role</th>
                    <th className="py-2.5 px-5">Notes</th>
                    <th className="py-2.5 px-5 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2DC]">
                  {duties.map((duty) => {
                    const staff = staffMap.get(duty.staffId);
                    const resp = respMap.get(duty.responsibilityId);

                    return (
                      <tr key={duty.id} className="hover:bg-[#F7F6F2]/50">
                        <td className="py-3 px-5 font-semibold text-[#0D1B2A]">{duty.dayOfWeek}</td>
                        <td className="py-3 px-5 font-medium text-[#0D1B2A]">{staff?.fullName}</td>
                        <td className="py-3 px-5 text-stone-700">{resp?.title}</td>
                        <td className="py-3 px-5 font-tabular text-stone-600">
                          {duty.startTime} – {duty.endTime}
                        </td>
                        <td className="py-3 px-5 capitalize text-stone-700">
                          {duty.assignmentType}
                        </td>
                        <td className="py-3 px-5 text-stone-500 max-w-xs truncate">
                          {duty.notes || '—'}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              await onDeleteDuty(duty.id);
                              notify('Duty assignment removed.');
                            }}
                            className="p-1 text-stone-400 hover:text-[#9E3B24] transition-colors cursor-pointer"
                            title={`Remove ${resp?.title} shift on ${duty.dayOfWeek}`}
                            aria-label={`Remove ${resp?.title} shift on ${duty.dayOfWeek}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Staff Personnel */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-5 border border-[#D8D5CD]">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#0D1B2A]">
                Computer Centre Personnel Register
              </h3>
              <p className="text-xs text-stone-600">
                Add new officers, modify contact records, or archive departing staff.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingStaff(null);
                setStaffForm({
                  fullName: '',
                  designation: '',
                  department: 'Computer Centre',
                  email: '',
                  phone: '',
                  officeLocation: 'Computer Centre Building',
                  workingHours: '09:00 AM - 05:30 PM',
                  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  primaryResponsibilitiesText: '',
                  notes: '',
                });
                setShowAddStaffModal(true);
              }}
              className="px-4 py-2 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Officer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className="bg-white p-6 border border-[#D8D5CD] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h4 className="font-editorial text-xl font-bold text-[#0D1B2A]">
                        {staff.fullName}
                      </h4>
                      <p className="text-xs text-stone-600">{staff.designation}</p>
                    </div>
                    <span className="text-xs text-stone-500 capitalize">{staff.status}</span>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1 font-tabular pt-2 border-t border-[#E5E2DC]">
                    <div>{staff.email}</div>
                    <div>{staff.phone} · {staff.officeLocation}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E2DC]">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStaff(staff);
                      setStaffForm({
                        fullName: staff.fullName,
                        designation: staff.designation,
                        department: staff.department,
                        email: staff.email,
                        phone: staff.phone,
                        officeLocation: staff.officeLocation,
                        workingHours: staff.workingHours,
                        workingDays: staff.workingDays,
                        primaryResponsibilitiesText: staff.primaryResponsibilities.join(', '),
                        notes: staff.notes || '',
                      });
                      setShowAddStaffModal(true);
                    }}
                    className="px-3 py-1.5 border border-[#D8D5CD] hover:border-[#0D1B2A] text-xs font-medium text-[#0D1B2A] flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {!staff.isHead && staff.status === 'active' && (
                    <button
                      type="button"
                      onClick={async () => {
                        await onArchiveStaff(staff.id);
                        notify(`Archived officer: ${staff.fullName}`);
                      }}
                      className="px-3 py-1.5 border border-[#9E3B24] text-xs font-medium text-[#9E3B24] hover:bg-[#F7F6F2] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Form Dialog */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 overflow-y-auto">
          <div className="bg-white max-w-xl w-full p-6 space-y-4 shadow-2xl border border-[#182026] my-8">
            <h3 className="font-editorial text-xl font-bold text-[#0D1B2A]">
              {editingStaff ? `Modify Record: ${editingStaff.fullName}` : 'Add Computer Centre Officer'}
            </h3>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={staffForm.fullName}
                    onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                    Official Designation
                  </label>
                  <input
                    type="text"
                    value={staffForm.designation}
                    onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    placeholder="user@iisermohali.ac.in"
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                    Telephone / Extension
                  </label>
                  <input
                    type="text"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                    Room / Location
                  </label>
                  <input
                    type="text"
                    value={staffForm.officeLocation}
                    onChange={(e) => setStaffForm({ ...staffForm, officeLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={staffForm.workingHours}
                    onChange={(e) => setStaffForm({ ...staffForm, workingHours: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Primary Responsibilities (Comma separated)
                </label>
                <input
                  type="text"
                  value={staffForm.primaryResponsibilitiesText}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, primaryResponsibilitiesText: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={staffForm.notes}
                  onChange={(e) => setStaffForm({ ...staffForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Officer Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Service Catalogue */}
      {activeTab === 'responsibilities' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-5 border border-[#D8D5CD]">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#0D1B2A]">
                Service Catalogue Management
              </h3>
              <p className="text-xs text-stone-600">
                Maintain technical responsibility definitions, search keywords, and escalation
                contacts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingResp(null);
                setRespForm({
                  title: '',
                  description: '',
                  category: 'Network & Security',
                  escalationProcedure: 'Contact Computer Centre helpdesk',
                  keywordsText: '',
                });
                setShowAddRespModal(true);
              }}
              className="px-4 py-2 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service Entry</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {responsibilities.map((resp) => (
              <div key={resp.id} className="bg-white p-6 border border-[#D8D5CD] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#9E3B24]">{resp.category}</div>
                    <h4 className="font-editorial text-lg font-bold text-[#0D1B2A] mt-0.5">
                      {resp.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingResp(resp);
                      setRespForm({
                        title: resp.title,
                        description: resp.description,
                        category: resp.category,
                        escalationProcedure: resp.escalationProcedure,
                        keywordsText: resp.keywords.join(', '),
                      });
                      setShowAddRespModal(true);
                    }}
                    className="p-1 text-stone-500 hover:text-[#0D1B2A] cursor-pointer"
                    title={`Edit ${resp.title}`}
                    aria-label={`Edit ${resp.title}`}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{resp.description}</p>
                <div className="text-xs text-stone-600 pt-2 border-t border-[#E5E2DC]">
                  <strong>Escalation:</strong> {resp.escalationProcedure}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddRespModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 overflow-y-auto">
          <div className="bg-white max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#182026] my-8">
            <h3 className="font-editorial text-xl font-bold text-[#0D1B2A]">
              {editingResp ? `Modify Service: ${editingResp.title}` : 'New Service Entry'}
            </h3>

            <form onSubmit={handleSaveResp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={respForm.title}
                  onChange={(e) => setRespForm({ ...respForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Division
                </label>
                <select
                  value={respForm.category}
                  onChange={(e) =>
                    setRespForm({ ...respForm, category: e.target.value as ResponsibilityCategory })
                  }
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs font-medium text-[#182026]"
                >
                  <option value="Network & Security">Network &amp; Security</option>
                  <option value="HPC & Infrastructure">HPC &amp; Infrastructure</option>
                  <option value="End-User & Computer Labs">End-User &amp; Computer Labs</option>
                  <option value="Web & Academic Portals">Web &amp; Academic Portals</option>
                  <option value="Hardware & Classrooms">Hardware &amp; Classrooms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={respForm.description}
                  onChange={(e) => setRespForm({ ...respForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Escalation Procedure
                </label>
                <input
                  type="text"
                  value={respForm.escalationProcedure}
                  onChange={(e) =>
                    setRespForm({ ...respForm, escalationProcedure: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                  Search Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={respForm.keywordsText}
                  onChange={(e) => setRespForm({ ...respForm, keywordsText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs text-[#182026]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRespModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#D8D5CD] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC]">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#0D1B2A]">
                Administrative Change Register ({auditLogs.length})
              </h3>
              <p className="text-xs text-stone-600">
                Chronological audit log of staff modifications, duty assignments, and notices.
              </p>
            </div>
            <button
              type="button"
              onClick={onRefreshData}
              className="text-xs text-[#9E3B24] hover:underline font-semibold cursor-pointer"
            >
              Refresh Register
            </button>
          </div>

          <div className="divide-y divide-[#E5E2DC]">
            {auditLogs.map((log) => {
              const timeStr = new Date(log.timestamp).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <div
                  key={log.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div>
                      <span className="font-tabular font-semibold text-[#9E3B24] mr-2">
                        [{log.action}]
                      </span>
                      <span className="font-semibold text-[#0D1B2A]">{log.summary}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 font-tabular">
                      Administrator: {log.adminEmail} · Entity: {log.entityType} ({log.entityId})
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-stone-500 font-tabular shrink-0">
                    {timeStr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
