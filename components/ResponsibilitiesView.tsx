'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, ChevronRight } from 'lucide-react';
import {
  Responsibility,
  StaffMember,
  DutyAssignment,
  ResponsibilityCategory,
} from '@/lib/types';

interface ResponsibilitiesViewProps {
  responsibilities: Responsibility[];
  staffList: StaffMember[];
  duties: DutyAssignment[];
  onSelectTask: (resp: Responsibility) => void;
  isAdmin?: boolean;
  onAddNewResponsibility?: () => void;
  onEditResponsibility?: (resp: Responsibility) => void;
}

export function ResponsibilitiesView({
  responsibilities,
  staffList,
  duties,
  onSelectTask,
  isAdmin = false,
  onAddNewResponsibility,
  onEditResponsibility,
}: ResponsibilitiesViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const staffMap = new Map(staffList.map((s) => [s.id, s]));

  const filtered = responsibilities.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (searchTerm.trim().length > 0) {
      const q = searchTerm.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchKeyword = r.keywords.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchKeyword;
    }
    return true;
  });

  const categories: (ResponsibilityCategory | 'all')[] = [
    'all',
    'Network & Security',
    'HPC & Infrastructure',
    'End-User & Computer Labs',
    'Web & Academic Portals',
    'Hardware & Classrooms',
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8D5CD] p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-stone-500">Computer Centre · Service Catalogue</div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0D1B2A] mt-0.5">
            Technical Responsibilities &amp; Escalation Protocols
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Designated technical custodians, standard operating procedures, and support routes for
            campus IT infrastructure.
          </p>
        </div>

        {isAdmin && onAddNewResponsibility && (
          <button
            type="button"
            onClick={onAddNewResponsibility}
            className="px-4 py-2 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service Entry</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#D8D5CD] p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter services by keyword (e.g., Eduroam, firewall, Slurm, GPU, labs)..."
            aria-label="Filter responsibilities by keyword"
            className="w-full pl-10 pr-4 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs sm:text-sm text-[#182026] focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by service domain"
            className="w-full py-2 px-3 bg-[#F7F6F2] border border-[#D8D5CD] text-xs sm:text-sm font-medium text-[#182026] focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
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

      {/* Grid of Responsibilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((resp, idx) => {
          const respDuties = duties.filter((d) => d.responsibilityId === resp.id);
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
            .filter((s): s is StaffMember => Boolean(s));

          const secondaryStaff = secondaryStaffIds
            .map((id) => staffMap.get(id))
            .filter((s): s is StaffMember => Boolean(s));

          return (
            <article
              key={resp.id}
              onClick={() => onSelectTask(resp)}
              className="bg-white border border-[#D8D5CD] hover:border-stone-500 p-6 transition-colors cursor-pointer flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs text-stone-500 border-b border-[#E5E2DC] pb-2.5">
                  <div>
                    <span className="font-tabular text-stone-400 mr-1.5">
                      0{idx + 1}.
                    </span>
                    <span className="font-semibold text-[#9E3B24]">{resp.category}</span>
                  </div>
                  {isAdmin && onEditResponsibility && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditResponsibility(resp);
                      }}
                      className="text-stone-500 hover:text-[#0D1B2A]"
                      title={`Edit ${resp.title}`}
                      aria-label={`Edit ${resp.title}`}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#0D1B2A]">
                  {resp.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {resp.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-[#E5E2DC] text-xs">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-stone-500">Primary Custodian:</span>
                  <div className="text-right">
                    {primaryStaff.length > 0 ? (
                      primaryStaff.map((s) => (
                        <span key={s.id} className="font-semibold text-[#0D1B2A] block">
                          {s.fullName}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#9E3B24] font-medium">
                        Unassigned (Contact Head, CC)
                      </span>
                    )}
                  </div>
                </div>

                {secondaryStaff.length > 0 && (
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-stone-500">Reserve Officer:</span>
                    <span className="text-stone-700">
                      {secondaryStaff.map((s) => s.fullName).join(', ')}
                    </span>
                  </div>
                )}

                <div className="pt-2.5 flex items-center justify-between text-xs border-t border-[#E5E2DC]">
                  <span className="text-stone-600 truncate max-w-[260px]">
                    <strong className="font-semibold text-[#0D1B2A]">Escalation:</strong>{' '}
                    {resp.escalationProcedure}
                  </span>
                  <span className="text-[#9E3B24] font-semibold flex items-center gap-0.5 shrink-0">
                    Inspect <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
