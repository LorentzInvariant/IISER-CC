'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import {
  StaffMember,
  Responsibility,
  DutyAssignment,
  DayOfWeek,
  DAYS_OF_WEEK,
} from '@/lib/types';
import { searchPortalDirectory } from '@/lib/duty-scheduler';
import { StaffCard } from './StaffCard';

interface StaffDirectoryViewProps {
  staffList: StaffMember[];
  responsibilities: Responsibility[];
  duties: DutyAssignment[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTask?: (resp: Responsibility) => void;
  isAdmin?: boolean;
  onEditStaff?: (staff: StaffMember) => void;
}

export function StaffDirectoryView({
  staffList,
  responsibilities,
  duties,
  searchQuery,
  onSearchChange,
  onSelectTask,
  isAdmin = false,
  onEditStaff,
}: StaffDirectoryViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all_staff' | 'task_finder'>('all_staff');

  const currentDayOfWeek: DayOfWeek = useMemo(() => {
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

  const searchResults = useMemo(() => {
    return searchPortalDirectory(
      searchQuery,
      selectedDay,
      selectedCategory,
      responsibilities,
      staffList,
      duties,
      currentDayOfWeek
    );
  }, [
    searchQuery,
    selectedDay,
    selectedCategory,
    responsibilities,
    staffList,
    duties,
    currentDayOfWeek,
  ]);

  const filteredStaff = useMemo(() => {
    let list = staffList.filter((s) => s.status !== 'archived');

    if (selectedDay !== 'all') {
      list = list.filter((s) => s.workingDays.includes(selectedDay as DayOfWeek));
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.designation.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.primaryResponsibilities.some((r) => r.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => {
      if (a.isHead) return -1;
      if (b.isHead) return 1;
      return a.fullName.localeCompare(b.fullName);
    });
  }, [staffList, selectedDay, searchQuery]);

  const categories = [
    'All Categories',
    'Network & Security',
    'HPC & Infrastructure',
    'End-User & Computer Labs',
    'Web & Academic Portals',
    'Hardware & Classrooms',
  ];

  return (
    <div className="space-y-8">
      {/* Header & Filter Ledger */}
      <div className="bg-white border border-[#D8D5CD] p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#E5E2DC]">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0D1B2A]">
              Staff Directory &amp; Task Lookup
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Search by technical service, infrastructure task, or officer name to identify
              assigned personnel.
            </p>
          </div>

          {/* Clean Segmented Control */}
          <div className="flex items-center border border-[#D8D5CD] bg-[#F7F6F2] p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('all_staff')}
              className={`px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'all_staff'
                  ? 'bg-[#0D1B2A] text-white'
                  : 'text-stone-700 hover:text-[#0D1B2A]'
              }`}
            >
              Staff Register ({filteredStaff.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('task_finder')}
              className={`px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'task_finder'
                  ? 'bg-[#0D1B2A] text-white'
                  : 'text-stone-700 hover:text-[#0D1B2A]'
              }`}
            >
              Task Matches ({searchResults.length})
            </button>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search task, keyword, or officer (e.g., Wi-Fi, HPC, Eduroam, Lab, ERP)..."
              aria-label="Filter directory by keyword"
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F6F2] border border-[#D8D5CD] text-sm text-[#182026] placeholder-stone-500 focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as DayOfWeek | 'all')}
              aria-label="Filter by day of week"
              className="w-full py-2.5 px-3 bg-[#F7F6F2] border border-[#D8D5CD] text-xs sm:text-sm font-medium text-[#182026] focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
            >
              <option value="all">All Days (Monday – Sunday)</option>
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d} {d === currentDayOfWeek ? '(Today)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by service category"
              className="w-full py-2.5 px-3 bg-[#F7F6F2] border border-[#D8D5CD] text-xs sm:text-sm font-medium text-[#182026] focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
            >
              <option value="all">All Service Divisions</option>
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Area */}
      {activeTab === 'task_finder' || searchQuery.trim().length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8D5CD] pb-2">
            <h3 className="text-sm font-semibold text-[#0D1B2A]">
              Matching Technical Responsibilities ({searchResults.length})
            </h3>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-xs text-[#9E3B24] hover:underline font-medium cursor-pointer"
              >
                Reset Search Filter
              </button>
            )}
          </div>

          {searchResults.length === 0 ? (
            <div className="p-10 text-center bg-white border border-[#D8D5CD]">
              <p className="text-base font-editorial font-semibold text-[#0D1B2A]">
                No staff member currently assigned to this responsibility.
              </p>
              <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                Please contact the Head of the Computer Centre directly at{' '}
                <code className="font-tabular text-[#0D1B2A]">head_cc@iisermohali.ac.in</code>.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#D8D5CD] border border-[#D8D5CD] bg-white">
              {searchResults.map((item) => {
                const resp = item.responsibility;
                return (
                  <div
                    key={resp.id}
                    onClick={() => onSelectTask?.(resp)}
                    className="p-6 hover:bg-[#F7F6F2]/60 transition-colors cursor-pointer space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div>
                        <div className="text-xs text-stone-500">
                          <span className="font-medium text-[#9E3B24]">{resp.category}</span>
                          <span className="mx-1.5">·</span>
                          <span>
                            Scheduled Days:{' '}
                            {item.matchingDays.map((d) => d.slice(0, 3)).join(', ') || 'On-Call'}
                          </span>
                        </div>
                        <h4 className="font-editorial text-xl font-bold text-[#0D1B2A] mt-0.5">
                          {resp.title}
                        </h4>
                      </div>
                      <span className="text-xs font-medium text-[#9E3B24] inline-flex items-center gap-1 shrink-0">
                        Inspect Task Record <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <p className="text-sm text-stone-700 leading-relaxed max-w-4xl">
                      {resp.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E5E2DC] text-xs">
                      <div>
                        <div className="text-stone-500 mb-1">Primary Officer In-Charge</div>
                        {item.primaryStaff.length > 0 ? (
                          item.primaryStaff.map((s) => (
                            <div key={s.id} className="flex items-baseline justify-between gap-2">
                              <div>
                                <span className="font-semibold text-[#0D1B2A]">{s.fullName}</span>
                                <span className="text-stone-500 ml-1.5">({s.designation})</span>
                              </div>
                              <span className="font-tabular text-stone-700 shrink-0">{s.phone}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-stone-500 italic">
                            Unassigned — Escalate to Head, CC
                          </span>
                        )}
                      </div>

                      <div className="sm:border-l sm:border-[#E5E2DC] sm:pl-6">
                        <div className="text-stone-500 mb-1">Secondary / Reserve Officer</div>
                        {item.secondaryStaff.length > 0 ? (
                          item.secondaryStaff.map((s) => (
                            <div key={s.id} className="flex items-baseline justify-between gap-2">
                              <div>
                                <span className="font-semibold text-[#0D1B2A]">{s.fullName}</span>
                                <span className="text-stone-500 ml-1.5">({s.designation})</span>
                              </div>
                              <span className="font-tabular text-stone-700 shrink-0">{s.phone}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-stone-500 italic">No reserve officer assigned</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-stone-600">
                      <strong className="font-semibold text-[#0D1B2A]">Escalation Protocol:</strong>{' '}
                      {resp.escalationProcedure}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-[#D8D5CD] pb-2">
            <h3 className="text-sm font-semibold text-[#0D1B2A]">
              Computer Centre Personnel Register ({filteredStaff.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((staff) => {
              const isOnDuty = staff.workingDays.includes(currentDayOfWeek);
              return (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  isOnDutyToday={isOnDuty}
                  isAdmin={isAdmin}
                  onEdit={onEditStaff}
                  onSelectResponsibility={(title) => {
                    onSearchChange(title);
                    setActiveTab('task_finder');
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
