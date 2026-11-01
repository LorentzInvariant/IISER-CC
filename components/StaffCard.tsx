'use client';

import React, { useState } from 'react';
import { Check, Copy, Edit } from 'lucide-react';
import { StaffMember, DayOfWeek } from '@/lib/types';

interface StaffCardProps {
  staff: StaffMember;
  isOnDutyToday?: boolean;
  onEdit?: (staff: StaffMember) => void;
  isAdmin?: boolean;
  onSelectResponsibility?: (respTitle: string) => void;
}

export function StaffCard({
  staff,
  isOnDutyToday = false,
  onEdit,
  isAdmin = false,
  onSelectResponsibility,
}: StaffCardProps) {
  const [copied, setCopied] = useState(false);

  function copyEmail(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(staff.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const initials = staff.fullName
    .replace(/^(Prof\.|Dr\.|Mr\.|Ms\.)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  const isHead = staff.isHead;

  if (isHead) {
    return (
      <article className="bg-white border border-[#182026] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#E5E2DC]">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-[#0D1B2A] text-white font-editorial text-xl font-bold flex items-center justify-center shrink-0 border border-[#0D1B2A]">
              {initials}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
                <span className="font-semibold text-[#9E3B24]">Head of Computer Centre</span>
                <span aria-hidden="true">·</span>
                <span>{staff.department}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#0D1B2A]">
                  {isOnDutyToday ? 'Scheduled on Campus Today' : 'Regular Office Schedule'}
                </span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#0D1B2A]">
                {staff.fullName}
              </h3>
              <p className="text-sm text-stone-700 font-medium">{staff.designation}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end justify-between gap-2 text-xs font-tabular border-t lg:border-t-0 pt-4 lg:pt-0 border-[#E5E2DC]">
            <div className="flex items-center gap-3">
              <span className="text-[#0D1B2A] font-medium">{staff.email}</span>
              <button
                type="button"
                onClick={copyEmail}
                className="text-xs font-sans font-medium text-[#9E3B24] hover:underline flex items-center gap-1 cursor-pointer"
                title="Copy institutional email"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
              {isAdmin && onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(staff)}
                  className="text-xs font-sans font-medium text-stone-600 hover:text-[#0D1B2A] flex items-center gap-1 ml-2 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            <div className="text-stone-600">
              Tel: {staff.phone} <span className="mx-1.5">·</span> {staff.officeLocation}
            </div>
            <div className="text-stone-500">
              Hours: {staff.workingHours} ({staff.workingDays.map((d) => d.slice(0, 3)).join(', ')})
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 text-xs">
          <div className="md:col-span-7 space-y-2">
            <h4 className="font-semibold text-[#0D1B2A]">
              Administrative &amp; Technical Oversight
            </h4>
            <ul className="space-y-1.5 text-stone-700">
              {staff.primaryResponsibilities.map((resp, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  <span className="text-stone-400 font-tabular">0{i + 1}.</span>
                  <button
                    type="button"
                    onClick={() => onSelectResponsibility?.(resp)}
                    className="text-left hover:text-[#9E3B24] hover:underline cursor-pointer"
                  >
                    {resp}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {staff.notes && (
            <div className="md:col-span-5 space-y-1.5 border-t md:border-t-0 md:border-l border-[#E5E2DC] pt-4 md:pt-0 md:pl-6">
              <h4 className="font-semibold text-[#0D1B2A]">Office &amp; Escalation Note</h4>
              <p className="text-stone-600 leading-relaxed">{staff.notes}</p>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white border border-[#D8D5CD] hover:border-stone-500 transition-colors p-6 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top Metadata Line (Clean Unboxed Text) */}
        <div className="flex items-center justify-between gap-2 text-xs text-stone-500 pb-3 border-b border-[#E5E2DC]">
          <span className="truncate">{staff.department.replace('Computer Centre — ', '')}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className={isOnDutyToday ? 'text-[#0D1B2A] font-medium' : 'text-stone-500'}>
              {isOnDutyToday ? 'On Duty Today' : 'Scheduled Rota'}
            </span>
            {isAdmin && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(staff)}
                className="text-stone-500 hover:text-[#0D1B2A] cursor-pointer"
                title={`Edit ${staff.fullName}`}
                aria-label={`Edit ${staff.fullName}`}
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Name & Designation */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 bg-[#F7F6F2] border border-[#D8D5CD] text-[#0D1B2A] font-editorial font-bold text-base flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-editorial text-xl font-bold text-[#0D1B2A] leading-snug truncate">
              {staff.fullName}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5 leading-normal">{staff.designation}</p>
          </div>
        </div>

        {/* Tabular Contact Details */}
        <div className="pt-2 space-y-1.5 text-xs border-t border-[#E5E2DC]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-tabular text-[#0D1B2A] truncate">{staff.email}</span>
            <button
              type="button"
              onClick={copyEmail}
              className="text-[11px] font-medium text-[#9E3B24] hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-stone-600 font-tabular flex items-center justify-between">
            <span>{staff.phone}</span>
            <span className="text-stone-500 font-sans truncate max-w-[150px]">{staff.officeLocation}</span>
          </div>
        </div>

        {/* Primary Responsibilities */}
        {staff.primaryResponsibilities.length > 0 && (
          <div className="pt-3 border-t border-[#E5E2DC] space-y-1.5">
            <div className="text-xs font-semibold text-[#0D1B2A]">Assigned Responsibilities</div>
            <ul className="space-y-1 text-xs text-stone-700">
              {staff.primaryResponsibilities.map((resp, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  <span className="text-stone-400">·</span>
                  <button
                    type="button"
                    onClick={() => onSelectResponsibility?.(resp)}
                    className="text-left hover:text-[#9E3B24] hover:underline leading-snug cursor-pointer"
                  >
                    {resp}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Schedule Line (Unboxed Text) */}
      <div className="mt-5 pt-3 border-t border-[#E5E2DC] flex items-center justify-between text-[11px] text-stone-500">
        <span>
          Days:{' '}
          <strong className="font-medium text-stone-700">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
              .filter((d) => staff.workingDays.includes(d as DayOfWeek))
              .map((d) => d.slice(0, 3))
              .join(', ')}
          </strong>
        </span>
        <span className="font-tabular">{staff.workingHours}</span>
      </div>
    </article>
  );
}
