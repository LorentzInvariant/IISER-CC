'use client';

import React, { useState, useMemo } from 'react';
import { Printer, AlertTriangle } from 'lucide-react';
import {
  StaffMember,
  Responsibility,
  DutyAssignment,
  DayOfWeek,
  DAYS_OF_WEEK,
} from '@/lib/types';
import { detectSchedulingConflicts } from '@/lib/duty-scheduler';

interface DutyScheduleViewProps {
  staffList: StaffMember[];
  responsibilities: Responsibility[];
  duties: DutyAssignment[];
  onSelectTask?: (resp: Responsibility) => void;
  isAdmin?: boolean;
  onOpenManageDuties?: () => void;
}

export function DutyScheduleView({
  staffList,
  responsibilities,
  duties,
  onSelectTask,
  isAdmin = false,
  onOpenManageDuties,
}: DutyScheduleViewProps) {
  const [viewMode, setViewMode] = useState<'weekly' | 'daily' | 'staff_centric'>('weekly');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');

  const staffMap = useMemo(() => new Map(staffList.map((s) => [s.id, s])), [staffList]);
  const respMap = useMemo(() => new Map(responsibilities.map((r) => [r.id, r])), [responsibilities]);

  const conflicts = useMemo(() => {
    return detectSchedulingConflicts(duties, staffList, responsibilities);
  }, [duties, staffList, responsibilities]);

  const todayDay: DayOfWeek = useMemo(() => {
    const days: DayOfWeek[] = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[new Date().getDay()];
  }, []);

  function handlePrint() {
    window.print();
  }

  const dailyDuties = useMemo(() => {
    return duties.filter((d) => d.dayOfWeek === selectedDay);
  }, [duties, selectedDay]);

  const staffDuties = useMemo(() => {
    return duties.filter((d) => d.staffId === selectedStaffId);
  }, [duties, selectedStaffId]);

  const activeStaff = staffMap.get(selectedStaffId);

  return (
    <div className="space-y-6">
      {/* Header Ledger */}
      <div className="bg-white border border-[#D8D5CD] p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-stone-500">
            Computer Centre · Weekly Operational Schedule
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0D1B2A] mt-0.5">
            Duty Roster &amp; Shift Allocations
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Official Monday through Sunday technical duty schedule approved by the Head of the
            Computer Centre.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <div className="flex items-center border border-[#D8D5CD] bg-[#F7F6F2] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'weekly'
                  ? 'bg-[#0D1B2A] text-white'
                  : 'text-stone-700 hover:text-[#0D1B2A]'
              }`}
            >
              Weekly Ledger
            </button>
            <button
              type="button"
              onClick={() => setViewMode('daily')}
              className={`px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-[#0D1B2A] text-white'
                  : 'text-stone-700 hover:text-[#0D1B2A]'
              }`}
            >
              Daily Roster
            </button>
            <button
              type="button"
              onClick={() => setViewMode('staff_centric')}
              className={`px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'staff_centric'
                  ? 'bg-[#0D1B2A] text-white'
                  : 'text-stone-700 hover:text-[#0D1B2A]'
              }`}
            >
              By Officer
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 border border-[#D8D5CD] bg-white hover:bg-[#F7F6F2] text-[#0D1B2A] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Schedule</span>
          </button>

          {isAdmin && onOpenManageDuties && (
            <button
              type="button"
              onClick={onOpenManageDuties}
              className="px-4 py-2 bg-[#9E3B24] hover:bg-[#822F1C] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Modify Allocations
            </button>
          )}
        </div>
      </div>

      {/* Scheduling Notices */}
      {conflicts.length > 0 && (
        <div className="p-5 bg-white border border-[#9E3B24] no-print space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9E3B24]">
            <AlertTriangle className="w-4 h-4" />
            <span>Scheduling &amp; Coverage Advisories ({conflicts.length})</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-stone-700 pt-1">
            {conflicts.slice(0, 4).map((c, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span className="text-[#9E3B24] font-tabular">·</span>
                <span>{c.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weekly Ledger Table */}
      {viewMode === 'weekly' && (
        <div className="bg-white border border-[#D8D5CD] overflow-hidden print-area">
          <div className="px-6 py-4 border-b border-[#D8D5CD] bg-[#F7F6F2] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#0D1B2A]">
                Weekly Operational Roster (Monday – Sunday)
              </h3>
            </div>
            <span className="text-xs text-stone-600 font-tabular">
              {duties.length} Scheduled Shifts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F6F2] text-[#0D1B2A] font-semibold border-b border-[#D8D5CD]">
                  <th className="py-3 px-5 w-36 border-r border-[#E5E2DC]">Day</th>
                  <th className="py-3 px-5 w-40">Shift Hours</th>
                  <th className="py-3 px-5">Officer Assigned</th>
                  <th className="py-3 px-5">Technical Responsibility</th>
                  <th className="py-3 px-5 w-28">Role</th>
                  <th className="py-3 px-5">Operational Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DC]">
                {DAYS_OF_WEEK.map((day) => {
                  const dayDuties = duties.filter((d) => d.dayOfWeek === day);
                  if (dayDuties.length === 0) {
                    return (
                      <tr key={day}>
                        <td className="py-3.5 px-5 font-semibold text-[#0D1B2A] bg-[#F7F6F2]/50 border-r border-[#E5E2DC]">
                          {day} {day === todayDay ? '(Today)' : ''}
                        </td>
                        <td colSpan={5} className="py-3.5 px-5 text-stone-500 italic">
                          No fixed shifts scheduled. Emergency on-call support via Ext. 1050.
                        </td>
                      </tr>
                    );
                  }

                  return dayDuties.map((duty, idx) => {
                    const staff = staffMap.get(duty.staffId);
                    const resp = respMap.get(duty.responsibilityId);

                    return (
                      <tr key={duty.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                        {idx === 0 ? (
                          <td
                            rowSpan={dayDuties.length}
                            className="py-3.5 px-5 font-semibold text-[#0D1B2A] bg-[#F7F6F2]/50 align-top border-r border-[#E5E2DC]"
                          >
                            <div>
                              <span>{day}</span>
                              {day === todayDay && (
                                <span className="block text-[11px] font-normal text-[#9E3B24] mt-0.5">
                                  Current Day
                                </span>
                              )}
                              <span className="block text-[11px] text-stone-500 font-normal font-tabular mt-1">
                                {dayDuties.length} shifts
                              </span>
                            </div>
                          </td>
                        ) : null}

                        <td className="py-3.5 px-5 font-tabular text-stone-700 whitespace-nowrap">
                          {duty.startTime} – {duty.endTime}
                        </td>

                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-[#0D1B2A]">
                            {staff?.fullName || 'Unassigned'}
                          </div>
                          <div className="text-[11px] text-stone-500 font-tabular">
                            {staff?.email}
                          </div>
                        </td>

                        <td className="py-3.5 px-5">
                          <button
                            type="button"
                            onClick={() => resp && onSelectTask?.(resp)}
                            className="font-semibold text-[#0D1B2A] hover:text-[#9E3B24] hover:underline text-left cursor-pointer"
                          >
                            {resp?.title || 'Unspecified Task'}
                          </button>
                          <span className="text-[11px] text-stone-500 block">
                            {resp?.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-5">
                          <span
                            className={
                              duty.assignmentType === 'primary'
                                ? 'font-semibold text-[#0D1B2A]'
                                : 'text-stone-600'
                            }
                          >
                            {duty.assignmentType === 'primary' ? 'Primary' : 'Reserve'}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 text-stone-600 leading-relaxed">
                          {duty.notes || 'Standard monitoring and user support.'}
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Daily Roster View */}
      {viewMode === 'daily' && (
        <div className="space-y-5">
          <div className="flex flex-wrap border border-[#D8D5CD] bg-white no-print">
            {DAYS_OF_WEEK.map((d) => {
              const count = duties.filter((item) => item.dayOfWeek === d).length;
              const isSelected = selectedDay === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className={`flex-1 min-w-[110px] py-3 px-3 text-xs border-r last:border-r-0 border-[#E5E2DC] transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D1B2A] text-white font-semibold'
                      : 'bg-white text-stone-700 hover:bg-[#F7F6F2]'
                  }`}
                >
                  <div>{d}</div>
                  <div className="text-[11px] opacity-75 font-tabular mt-0.5">
                    {count} shifts
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white border border-[#D8D5CD] p-6 space-y-4">
            <div className="pb-4 border-b border-[#E5E2DC]">
              <h3 className="font-editorial text-xl font-bold text-[#0D1B2A]">
                Scheduled Assignments for {selectedDay}
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                {dailyDuties.length} duty allocations active on {selectedDay}.
              </p>
            </div>

            {dailyDuties.length === 0 ? (
              <p className="text-sm text-stone-600 py-8 text-center">
                No fixed duties assigned on {selectedDay}.
              </p>
            ) : (
              <div className="divide-y divide-[#E5E2DC]">
                {dailyDuties.map((duty) => {
                  const staff = staffMap.get(duty.staffId);
                  const resp = respMap.get(duty.responsibilityId);

                  return (
                    <div
                      key={duty.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="text-xs text-stone-500">
                          <span className="font-medium text-[#9E3B24]">{resp?.category}</span>
                          <span className="mx-1.5">·</span>
                          <span>
                            {duty.assignmentType === 'primary'
                              ? 'Primary Officer'
                              : 'Reserve Officer'}
                          </span>
                        </div>
                        <h4 className="font-editorial text-lg font-bold text-[#0D1B2A]">
                          {resp?.title}
                        </h4>
                        {duty.notes && <p className="text-xs text-stone-600">{duty.notes}</p>}
                      </div>

                      <div className="sm:text-right text-xs space-y-0.5 shrink-0">
                        <div className="font-semibold text-[#0D1B2A]">{staff?.fullName}</div>
                        <div className="text-stone-600">{staff?.designation}</div>
                        <div className="font-tabular text-stone-500">
                          {duty.startTime} – {duty.endTime} · {staff?.phone}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Staff-Centric View */}
      {viewMode === 'staff_centric' && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2 bg-white border border-[#D8D5CD] p-3 no-print">
            {staffList
              .filter((s) => s.status !== 'archived')
              .map((s) => {
                const count = duties.filter((d) => d.staffId === s.id).length;
                const isSelected = selectedStaffId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStaffId(s.id)}
                    className={`px-3.5 py-2 text-xs border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0D1B2A] text-white border-[#0D1B2A] font-semibold'
                        : 'bg-[#F7F6F2] text-stone-700 border-[#D8D5CD] hover:border-stone-400'
                    }`}
                  >
                    {s.fullName} <span className="font-tabular opacity-75">({count})</span>
                  </button>
                );
              })}
          </div>

          {activeStaff && (
            <div className="bg-white border border-[#D8D5CD] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-[#E5E2DC] gap-2">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#0D1B2A]">
                    {activeStaff.fullName}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {activeStaff.designation} · {activeStaff.department}
                  </p>
                </div>
                <div className="text-xs text-stone-600 font-tabular">
                  {activeStaff.email} · {activeStaff.phone}
                </div>
              </div>

              {staffDuties.length === 0 ? (
                <p className="text-sm text-stone-600 py-6">
                  No specific weekly shift entries recorded for {activeStaff.fullName}.
                </p>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#D8D5CD] text-[#0D1B2A] font-semibold">
                      <th className="py-2.5 pr-4">Day</th>
                      <th className="py-2.5 px-4">Hours</th>
                      <th className="py-2.5 px-4">Responsibility</th>
                      <th className="py-2.5 px-4">Assignment</th>
                      <th className="py-2.5 pl-4">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DC]">
                    {staffDuties.map((duty) => {
                      const resp = respMap.get(duty.responsibilityId);
                      return (
                        <tr key={duty.id}>
                          <td className="py-3 pr-4 font-semibold text-[#0D1B2A]">
                            {duty.dayOfWeek}
                          </td>
                          <td className="py-3 px-4 font-tabular text-stone-700">
                            {duty.startTime} – {duty.endTime}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#0D1B2A]">{resp?.title}</td>
                          <td className="py-3 px-4 text-stone-600 capitalize">
                            {duty.assignmentType}
                          </td>
                          <td className="py-3 pl-4 text-stone-600">{duty.notes || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
