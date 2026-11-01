'use client';

import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Responsibility, StaffMember, DutyAssignment } from '@/lib/types';

interface TaskDetailModalProps {
  responsibility: Responsibility | null;
  onClose: () => void;
  staffList: StaffMember[];
  duties: DutyAssignment[];
}

export function TaskDetailModal({
  responsibility,
  onClose,
  staffList,
  duties,
}: TaskDetailModalProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  if (!responsibility) return null;

  const staffMap = new Map(staffList.map((s) => [s.id, s]));
  const respDuties = duties.filter((d) => d.responsibilityId === responsibility.id);

  const primaryDuties = respDuties.filter((d) => d.assignmentType === 'primary');
  const secondaryDuties = respDuties.filter((d) => d.assignmentType === 'secondary');

  const primaryStaff = Array.from(new Set(primaryDuties.map((d) => d.staffId)))
    .map((id) => staffMap.get(id))
    .filter((s): s is StaffMember => Boolean(s));

  const secondaryStaff = Array.from(new Set(secondaryDuties.map((d) => d.staffId)))
    .map((id) => staffMap.get(id))
    .filter((s): s is StaffMember => Boolean(s));

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white border border-[#182026] shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#0D1B2A] text-white p-6 relative border-b border-[#182026]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-xs text-stone-300">
            <span>{responsibility.category}</span>
            <span className="mx-1.5">·</span>
            <span className="font-tabular">Catalogue Ref: {responsibility.id}</span>
          </div>

          <h2 className="font-editorial text-2xl font-bold text-white mt-1">
            {responsibility.title}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Scope */}
          <div className="space-y-1.5">
            <h3 className="font-semibold text-[#0D1B2A]">Service Scope &amp; Description</h3>
            <p className="text-sm text-stone-700 leading-relaxed">{responsibility.description}</p>
          </div>

          {primaryStaff.length === 0 && secondaryStaff.length === 0 ? (
            <div className="p-4 bg-[#F7F6F2] border border-[#9E3B24] text-[#0D1B2A] space-y-1">
              <p className="font-semibold">
                No staff member currently assigned to this responsibility. Please contact the Head
                of the Computer Centre.
              </p>
              <p className="text-stone-600">
                Direct escalation:{' '}
                <code className="font-tabular font-semibold">head_cc@iisermohali.ac.in</code>
              </p>
            </div>
          ) : (
            <>
              {/* Primary Custodian */}
              <div className="space-y-2 pt-4 border-t border-[#E5E2DC]">
                <h3 className="font-semibold text-[#0D1B2A]">Primary Officer(s) In-Charge</h3>
                <div className="divide-y divide-[#E5E2DC] border border-[#D8D5CD] bg-[#F7F6F2]">
                  {primaryStaff.map((staff) => (
                    <div
                      key={staff.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-[#0D1B2A]">{staff.fullName}</div>
                        <div className="text-stone-600">{staff.designation}</div>
                        <div className="text-stone-500 mt-0.5">{staff.officeLocation}</div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1 font-tabular">
                        <div className="flex items-center gap-2">
                          <span className="text-[#0D1B2A] font-medium">{staff.email}</span>
                          <button
                            type="button"
                            onClick={() => copyText(staff.email)}
                            className="font-sans text-[#9E3B24] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedEmail === staff.email ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <span className="text-stone-600">{staff.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Support */}
              {secondaryStaff.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="font-semibold text-[#0D1B2A]">Reserve / Backup Officer</h3>
                  <div className="divide-y divide-[#E5E2DC] border border-[#D8D5CD]">
                    {secondaryStaff.map((staff) => (
                      <div key={staff.id} className="p-3.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#0D1B2A]">{staff.fullName}</div>
                          <div className="text-stone-600">{staff.designation}</div>
                        </div>
                        <div className="text-right font-tabular text-stone-600">
                          <div>{staff.email}</div>
                          <div>{staff.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scheduled Shifts Table */}
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-[#0D1B2A]">Weekly Scheduled Coverage</h3>
                <table className="w-full text-left border-collapse border border-[#D8D5CD]">
                  <thead>
                    <tr className="bg-[#F7F6F2] border-b border-[#D8D5CD] text-[#0D1B2A] font-semibold">
                      <th className="py-2 px-3">Day</th>
                      <th className="py-2 px-3">Shift Hours</th>
                      <th className="py-2 px-3">Coverage Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DC]">
                    {respDuties.map((d) => (
                      <tr key={d.id}>
                        <td className="py-2 px-3 font-medium text-[#0D1B2A]">{d.dayOfWeek}</td>
                        <td className="py-2 px-3 font-tabular text-stone-700">
                          {d.startTime} – {d.endTime}
                        </td>
                        <td className="py-2 px-3 text-stone-600 capitalize">{d.assignmentType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Escalation */}
          <div className="p-4 bg-[#F7F6F2] border border-[#D8D5CD] space-y-1">
            <h4 className="font-semibold text-[#0D1B2A]">Escalation Procedure</h4>
            <p className="text-stone-700 leading-relaxed">{responsibility.escalationProcedure}</p>
          </div>
        </div>

        <div className="p-4 bg-[#F7F6F2] border-t border-[#D8D5CD] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}
