'use client';

import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Announcement } from '@/lib/types';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  isAdmin?: boolean;
  onPostAnnouncement?: (data: {
    title: string;
    content: string;
    priority: Announcement['priority'];
  }) => Promise<void>;
  onDeleteAnnouncement?: (id: string) => Promise<void>;
}

export function AnnouncementsView({
  announcements,
  isAdmin = false,
  onPostAnnouncement,
  onDeleteAnnouncement,
}: AnnouncementsViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Announcement['priority']>('normal');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await onPostAnnouncement?.({ title, content, priority });
      setTitle('');
      setContent('');
      setShowAddForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  const priorityLabels: Record<Announcement['priority'], string> = {
    urgent: 'Urgent Service Impact',
    high: 'Scheduled Maintenance',
    normal: 'Operational Notice',
    low: 'General Advisory',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8D5CD] p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-stone-500">Computer Centre · Official Circulars</div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0D1B2A] mt-0.5">
            Maintenance Notices &amp; IT Advisories
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Official bulletins regarding campus network maintenance windows, HPC cluster downtime,
            and security updates.
          </p>
        </div>

        {isAdmin && onPostAnnouncement && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancel Circular' : 'Publish Circular'}</span>
          </button>
        )}
      </div>

      {/* Admin Post Form */}
      {isAdmin && showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 border border-[#182026] space-y-4"
        >
          <h3 className="font-editorial text-lg font-bold text-[#0D1B2A]">
            Publish Official Computer Centre Circular
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                Circular Subject / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Optical Fibre Maintenance in Central Library"
                className="w-full px-3.5 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-sm text-[#182026] focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
                Classification
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Announcement['priority'])}
                className="w-full px-3.5 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs sm:text-sm font-medium text-[#182026] focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
              >
                <option value="low">General Advisory</option>
                <option value="normal">Operational Notice</option>
                <option value="high">Scheduled Maintenance</option>
                <option value="urgent">Urgent Service Impact</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">
              Notice Text
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide affected buildings, maintenance window timings, and contact extension..."
              className="w-full px-3.5 py-2 bg-[#F7F6F2] border border-[#D8D5CD] text-xs sm:text-sm text-[#182026] focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold bg-[#0D1B2A] text-white hover:bg-[#1E3A5F] transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Circular'}
            </button>
          </div>
        </form>
      )}

      {/* Announcements Ledger */}
      <div className="divide-y divide-[#D8D5CD] border border-[#D8D5CD] bg-white">
        {announcements.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-[#0D1B2A]">No active notices posted.</p>
            <p className="text-xs text-stone-500 mt-1">
              All campus network and compute infrastructure is operating on normal schedule.
            </p>
          </div>
        ) : (
          announcements.map((ann) => {
            const dateStr = new Date(ann.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <article key={ann.id} className="p-6 space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-stone-500">
                      <span
                        className={
                          ann.priority === 'urgent' || ann.priority === 'high'
                            ? 'font-semibold text-[#9E3B24]'
                            : 'font-medium text-stone-600'
                        }
                      >
                        {priorityLabels[ann.priority]}
                      </span>
                      <span className="mx-1.5">·</span>
                      <span className="font-tabular">{dateStr}</span>
                      <span className="mx-1.5">·</span>
                      <span>Issued by {ann.authorName}</span>
                    </div>
                    <h3 className="font-editorial text-xl font-bold text-[#0D1B2A]">
                      {ann.title}
                    </h3>
                  </div>

                  {isAdmin && onDeleteAnnouncement && (
                    <button
                      type="button"
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      className="text-stone-400 hover:text-[#9E3B24] p-1 transition-colors shrink-0 cursor-pointer"
                      title={`Delete ${ann.title}`}
                      aria-label={`Delete ${ann.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-stone-700 leading-relaxed max-w-4xl whitespace-pre-line">
                  {ann.content}
                </p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
