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
  fullWidth?: boolean;
}

export function StaffCard({
  staff,
  isOnDutyToday = false,
  onEdit,
  isAdmin = false,
  onSelectResponsibility,
  fullWidth = false,
}: StaffCardProps) {
  const [copied, setCopied] = useState(false);

  function copyEmail(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(staff.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const initials = staff.fullName
    .replace(/^(Prof\.|Dr\.|Er\.|Mrs\.|Mr\.|Ms\.)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  const isHead = staff.isHead;

  if (isHead || fullWidth) {
    return (
      <article
        className={`bg-white p-6 sm:p-7 ${
          isHead ? 'border border-[#182026]' : 'border border-[#D8D5CD]'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-5 border-b border-[#E5E2DC]">
          <div className="flex items-start gap-4 sm:gap-5">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 font-editorial text-lg sm:text-xl font-bold flex items-center justify-center shrink-0 border ${
                isHead
                  ? 'bg-[#0D1B2A] text-white border-[#0D1B2A]'
                  : 'bg-[#F7F6F2] text-[#0D1B2A] border-[#D8D5CD]'
              }`}
            >
              {initials}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
                <span className="font-semibold text-[#9E3B24] uppercase tracking-wider font-mono text-[11px]">
                  {isHead
                    ? 'Faculty In-Charge (Head, Computer Centre)'
                    : 'Senior Technical Officer & CISO'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{staff.department}</span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#0D1B2A]">
                {staff.fullName}
              </h3>
              <p className="text-sm text-stone-700 font-medium">{staff.designation}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end justify-between gap-1.5 text-xs font-tabular border-t lg:border-t-0 pt-4 lg:pt-0 border-[#E5E2DC]">
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${staff.email}`}
                className="text-[#0D1B2A] font-semibold hover:text-[#9E3B24] underline underline-offset-4 decoration-stone-300"
              >
                {staff.email}
              </a>
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
                    <span>Copy</span>
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
            <div className="text-stone-600">Tel: {staff.phone}</div>
            <div className="text-stone-500">
              {staff.officeLocation} · {staff.workingHours}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 text-xs">
          <div className="md:col-span-7 space-y-2">
            <h4 className="font-semibold text-[#0D1B2A]">
              {isHead ? 'Administrative & Technical Oversight' : 'Assigned Core Responsibilities'}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-stone-700">
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
              <h4 className="font-semibold text-[#0D1B2A]">
                {isHead ? 'Office & Escalation Note' : 'Portfolio & CISO Mandate'}
              </h4>
              <p className="text-stone-600 leading-relaxed">{staff.notes}</p>
            </div>
          )}
        </div>
      </article>
    );
  }

  const compactLocation = staff.officeLocation
    .replace('Computer Centre, Informatics Centre Building', 'Informatics Centre Bldg')
    .replace(', Informatics Centre', '');

  return (
    <article className="bg-white border border-[#D8D5CD] hover:border-stone-500 transition-colors p-6 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top Metadata Line (Clean Unboxed Text) */}
        <div className="flex items-center justify-between gap-2 text-xs text-stone-500 pb-3 border-b border-[#E5E2DC]">
          <span className="truncate font-medium text-[#9E3B24]">
            {staff.department.replace('Computer Centre — ', '')}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className={isOnDutyToday ? 'text-[#0D1B2A] font-medium' : 'text-stone-500'}>
              {isOnDutyToday ? 'On Duty Today' : 'Mon–Fri'}
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
            <a
              href={`mailto:${staff.email}`}
              className="font-tabular font-semibold text-[#0D1B2A] hover:text-[#9E3B24] truncate"
            >
              {staff.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="text-[11px] font-medium text-[#9E3B24] hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-stone-600 font-tabular flex items-center justify-between gap-2">
            <span>{staff.phone}</span>
            <span className="text-stone-500 font-sans text-right shrink-0">{compactLocation}</span>
          </div>
        </div>

        {/* Primary Responsibilities */}
        {staff.primaryResponsibilities.length > 0 && (
          <div className="pt-3 border-t border-[#E5E2DC] space-y-1.5">
            <div className="text-xs font-semibold text-[#0D1B2A]">Key Responsibilities</div>
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
