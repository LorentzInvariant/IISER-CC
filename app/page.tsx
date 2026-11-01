'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { CampusHero } from '@/components/CampusHero';
import { StaffCard } from '@/components/StaffCard';
import { StaffDirectoryView } from '@/components/StaffDirectoryView';
import { DutyScheduleView } from '@/components/DutyScheduleView';
import { ResponsibilitiesView } from '@/components/ResponsibilitiesView';
import { AnnouncementsView } from '@/components/AnnouncementsView';
import { AdminDashboard } from '@/components/AdminDashboard';
import { LoginModal } from '@/components/LoginModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import {
  StaffMember,
  Responsibility,
  DutyAssignment,
  Announcement,
  AuditLogEntry,
  UserSession,
  DayOfWeek,
} from '@/lib/types';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

  // Data states
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([]);
  const [duties, setDuties] = useState<DutyAssignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedTask, setSelectedTask] = useState<Responsibility | null>(null);

  // Load session from cookie
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          autoLoginDemo('faculty');
        }
      } else {
        autoLoginDemo('faculty');
      }
    } catch {
      autoLoginDemo('faculty');
    }
  }, []);

  async function autoLoginDemo(role: 'admin' | 'faculty') {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoRole: role }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error('Demo auto-login failed:', e);
    }
  }

  // Fetch all domain data
  const fetchData = useCallback(async () => {
    try {
      const [staffRes, respRes, dutiesRes, annRes] = await Promise.all([
        fetch('/api/staff'),
        fetch('/api/responsibilities'),
        fetch('/api/duties'),
        fetch('/api/announcements'),
      ]);

      if (staffRes.ok) {
        const data = await staffRes.json();
        setStaffList(data.staff || []);
      }
      if (respRes.ok) {
        const data = await respRes.json();
        setResponsibilities(data.responsibilities || []);
      }
      if (dutiesRes.ok) {
        const data = await dutiesRes.json();
        setDuties(data.duties || []);
      }
      if (annRes.ok) {
        const data = await annRes.json();
        setAnnouncements(data.announcements || []);
      }

      if (currentUser?.role === 'admin') {
        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setAuditLogs(logsData.logs || []);
        }
      }
    } catch (err) {
      console.error('Error fetching portal data:', err);
    }
  }, [currentUser?.role]);

  useEffect(() => {
    let active = true;
    const loadInitialState = async () => {
      await checkSession();
      if (active) {
        await fetchData();
      }
    };
    loadInitialState();
    return () => {
      active = false;
    };
  }, [checkSession, fetchData]);

  // Handle logout
  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setIsLoginModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  }

  // Switch role directly
  async function handleQuickSwitchRole(role: 'admin' | 'faculty') {
    await autoLoginDemo(role);
    fetchData();
  }

  // Admin Actions
  async function handleAddStaff(data: Partial<StaffMember>) {
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add staff');
    }
    fetchData();
  }

  async function handleUpdateStaff(id: string, data: Partial<StaffMember>) {
    const res = await fetch('/api/staff', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update staff');
    }
    fetchData();
  }

  async function handleArchiveStaff(id: string) {
    const res = await fetch(`/api/staff?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to archive staff');
    }
    fetchData();
  }

  async function handleAddDuty(data: Partial<DutyAssignment>) {
    const res = await fetch('/api/duties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to assign duty');
    }
    fetchData();
  }

  async function handleDeleteDuty(id: string) {
    const res = await fetch(`/api/duties?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to remove duty');
    }
    fetchData();
  }

  async function handleAddResponsibility(data: Partial<Responsibility>) {
    const res = await fetch('/api/responsibilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add responsibility');
    }
    fetchData();
  }

  async function handleUpdateResponsibility(id: string, data: Partial<Responsibility>) {
    const res = await fetch('/api/responsibilities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update responsibility');
    }
    fetchData();
  }

  async function handlePostAnnouncement(data: { title: string; content: string; priority: Announcement['priority'] }) {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to publish announcement');
    }
    fetchData();
  }

  async function handleDeleteAnnouncement(id: string) {
    const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete announcement');
    }
    fetchData();
  }

  // Head of Computer Centre profile
  const headStaff = staffList.find((s) => s.isHead);
  const otherStaff = staffList.filter((s) => !s.isHead && s.status !== 'archived');

  const todayDay: DayOfWeek = (['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as DayOfWeek[])[new Date().getDay()];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#182026]">
      {/* Top Masthead */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onQuickSwitchRole={handleQuickSwitchRole}
        unreadAnnouncementsCount={announcements.length}
      />

      {/* Architectural Masthead Hero on Overview */}
      {currentTab === 'dashboard' && (
        <CampusHero
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onSearchSubmit={() => setCurrentTab('directory')}
          activeStaffCount={staffList.filter((s) => s.status !== 'archived').length}
          totalServicesCount={responsibilities.length}
          onNavigateTab={setCurrentTab}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* TAB 1: Main Dashboard / Team Overview */}
        {currentTab === 'dashboard' && (
          <div className="space-y-12">
            {/* Official Circular Bulletin Strip */}
            {announcements.length > 0 && (
              <div
                onClick={() => setCurrentTab('announcements')}
                className="p-4 bg-white border border-[#D8D5CD] border-l-4 border-l-[#9E3B24] flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF9F5] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#9E3B24] font-semibold">
                      Official Advisory · Circular No. CC/2026/01
                    </span>
                    <span className="text-[#D8D5CD]">|</span>
                    <span className="text-[11px] font-mono text-[#6E7781]">
                      {announcements[0].authorName}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#0D1B2A]">
                    {announcements[0].title}:{' '}
                    <span className="font-normal text-[#4A5568]">
                      {announcements[0].content}
                    </span>
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#0D1B2A] hover:text-[#9E3B24] flex items-center gap-1 shrink-0">
                  Read Notice Register <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            )}

            {/* Section 1: Head of Computer Centre (Distinct Profile at Top as mandated by Section 4.C) */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-[#D8D5CD] gap-2">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#9E3B24] font-semibold">
                    Section I · Leadership & Administrative Escalation
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-[#0D1B2A] tracking-tight mt-0.5">
                    Head of Computer Centre
                  </h2>
                </div>
                <span className="text-xs text-[#6E7781] font-mono">
                  Informatics Centre · Room 201, First Floor
                </span>
              </div>

              {headStaff ? (
                <StaffCard
                  staff={headStaff}
                  isOnDutyToday={headStaff.workingDays.includes(todayDay)}
                  isAdmin={currentUser?.role === 'admin'}
                  onEdit={() => {
                    setCurrentTab('admin');
                  }}
                  onSelectResponsibility={(title) => {
                    setGlobalSearch(title);
                    setCurrentTab('directory');
                  }}
                />
              ) : (
                <div className="p-8 bg-white border border-[#D8D5CD] text-center">
                  <p className="text-sm font-semibold text-[#4A5568]">
                    Head of Computer Centre record not yet populated.
                  </p>
                </div>
              )}
            </section>

            {/* Section 2: Entire Staff Team Overview */}
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#D8D5CD]">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#9E3B24] font-semibold">
                    Section II · Systems, Networking & User Support Division
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-[#0D1B2A] tracking-tight mt-0.5">
                    Computer Centre Officers & Technical Staff
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4A5568] mt-0.5">
                    Scientific officers, network engineers, and systems administrators maintaining campus IT operations.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentTab('directory')}
                  className="text-xs font-semibold text-[#0D1B2A] hover:text-[#9E3B24] flex items-center gap-1.5 self-start sm:self-end pb-0.5 cursor-pointer"
                >
                  <span>Search & Filter by Technical Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherStaff.map((staff) => (
                  <StaffCard
                    key={staff.id}
                    staff={staff}
                    isOnDutyToday={staff.workingDays.includes(todayDay)}
                    isAdmin={currentUser?.role === 'admin'}
                    onEdit={() => setCurrentTab('admin')}
                    onSelectResponsibility={(title) => {
                      setGlobalSearch(title);
                      setCurrentTab('directory');
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Section 3: Institutional Index Ledger */}
            <section className="border-t border-[#D8D5CD] pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 border border-[#D8D5CD] bg-white divide-y md:divide-y-0 md:divide-x divide-[#D8D5CD]">
                <button
                  type="button"
                  onClick={() => setCurrentTab('schedule')}
                  className="p-6 text-left hover:bg-[#FAF9F5] transition-colors space-y-2 group cursor-pointer"
                >
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#9E3B24]">
                    Index 01 · Operational Roster
                  </p>
                  <h3 className="font-serif text-lg font-bold text-[#0D1B2A] group-hover:text-[#9E3B24] transition-colors flex items-center justify-between">
                    <span>Weekly & Daily Duty Schedule</span>
                    <ArrowRight className="w-4 h-4 text-[#6E7781] group-hover:text-[#9E3B24]" />
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Consult Monday–Sunday shift allocations, verify primary and backup engineering coverage, or print the official weekly roster.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('responsibilities')}
                  className="p-6 text-left hover:bg-[#FAF9F5] transition-colors space-y-2 group cursor-pointer"
                >
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#9E3B24]">
                    Index 02 · Technical Divisions
                  </p>
                  <h3 className="font-serif text-lg font-bold text-[#0D1B2A] group-hover:text-[#9E3B24] transition-colors flex items-center justify-between">
                    <span>Service & Task Catalogue</span>
                    <ArrowRight className="w-4 h-4 text-[#6E7781] group-hover:text-[#9E3B24]" />
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Detailed specifications for Campus Backbone &amp; Eduroam Wi-Fi, High Performance Computing (HPC), Academic ERP, and Linux Labs.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('announcements')}
                  className="p-6 text-left hover:bg-[#FAF9F5] transition-colors space-y-2 group cursor-pointer"
                >
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#9E3B24]">
                    Index 03 · Circulars & Downtime
                  </p>
                  <h3 className="font-serif text-lg font-bold text-[#0D1B2A] group-hover:text-[#9E3B24] transition-colors flex items-center justify-between">
                    <span>Maintenance & IT Advisories</span>
                    <ArrowRight className="w-4 h-4 text-[#6E7781] group-hover:text-[#9E3B24]" />
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Scheduled rack maintenance windows, firewall firmware upgrades, and security circulars issued by the Computer Centre.
                  </p>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: Searchable Staff Directory & Task Finder */}
        {currentTab === 'directory' && (
          <StaffDirectoryView
            staffList={staffList}
            responsibilities={responsibilities}
            duties={duties}
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
            onSelectTask={(task) => setSelectedTask(task)}
            isAdmin={currentUser?.role === 'admin'}
            onEditStaff={() => setCurrentTab('admin')}
          />
        )}

        {/* TAB 3: Duty Schedule (Weekly & Daily & Staff-Centric) */}
        {currentTab === 'schedule' && (
          <DutyScheduleView
            staffList={staffList}
            responsibilities={responsibilities}
            duties={duties}
            onSelectTask={(task) => setSelectedTask(task)}
            isAdmin={currentUser?.role === 'admin'}
            onOpenManageDuties={() => setCurrentTab('admin')}
          />
        )}

        {/* TAB 4: Responsibilities & Service Catalogue */}
        {currentTab === 'responsibilities' && (
          <ResponsibilitiesView
            responsibilities={responsibilities}
            staffList={staffList}
            duties={duties}
            onSelectTask={(task) => setSelectedTask(task)}
            isAdmin={currentUser?.role === 'admin'}
            onAddNewResponsibility={() => setCurrentTab('admin')}
            onEditResponsibility={() => setCurrentTab('admin')}
          />
        )}

        {/* TAB 5: Announcements & Bulletins */}
        {currentTab === 'announcements' && (
          <AnnouncementsView
            announcements={announcements}
            isAdmin={currentUser?.role === 'admin'}
            onPostAnnouncement={handlePostAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}

        {/* TAB 6: Administrator Console (Head of Computer Centre) */}
        {currentTab === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminDashboard
              staffList={staffList}
              responsibilities={responsibilities}
              duties={duties}
              auditLogs={auditLogs}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onArchiveStaff={handleArchiveStaff}
              onAddDuty={handleAddDuty}
              onDeleteDuty={handleDeleteDuty}
              onAddResponsibility={handleAddResponsibility}
              onUpdateResponsibility={handleUpdateResponsibility}
              onRefreshData={fetchData}
            />
          ) : (
            <div className="bg-white p-10 text-center border border-[#D8D5CD] max-w-lg mx-auto space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#9E3B24] font-semibold">
                Restricted Administrative Area
              </p>
              <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">
                Head of Computer Centre Authorization Required
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Access to staff roster mutations and duty scheduling is restricted to the verified{' '}
                <strong className="text-[#0D1B2A]">Head of Computer Centre</strong>. Regular campus accounts have read-only access.
              </p>
              <button
                type="button"
                onClick={() => handleQuickSwitchRole('admin')}
                className="px-5 py-2.5 bg-[#0D1B2A] hover:bg-[#1B2D42] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Switch to Head of Computer Centre Session
              </button>
            </div>
          )
        )}
      </main>

      {/* Formal Institutional Footer */}
      <footer className="bg-white text-[#4A5568] text-xs py-10 border-t-2 border-[#0D1B2A] no-print mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E5E2DC]">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/images/iiserm_logo.png"
                  alt="IISER Mohali Official Emblem"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-[#6E7781] text-[11px] tracking-wide">
                  भारतीय विज्ञान शिक्षा एवं अनुसंधान संस्थान मोहाली
                </p>
                <p className="font-serif font-bold text-[#0D1B2A] text-sm sm:text-base">
                  Indian Institute of Science Education and Research Mohali
                </p>
                <p className="text-xs text-[#4A5568]">
                  Computer Centre · Informatics Centre Building, Sector 81, Knowledge City, SAS Nagar, Punjab 140306
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-xs font-medium text-[#0D1B2A]">
              <a
                href="https://www.iisermohali.ac.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#9E3B24] transition-colors underline underline-offset-4 decoration-[#D8D5CD]"
              >
                Institute Main Portal
              </a>
              <a
                href="https://web.iisermohali.ac.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#9E3B24] transition-colors underline underline-offset-4 decoration-[#D8D5CD]"
              >
                Campus Intranet
              </a>
              <a
                href="https://webmail.iisermohali.ac.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#9E3B24] transition-colors underline underline-offset-4 decoration-[#D8D5CD]"
              >
                Institute Webmail
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-[#6E7781] gap-2">
            <p>
              © 2026 Computer Centre, IISER Mohali. Official Internal Staff Directory &amp; Duty Register.
            </p>
            <p className="font-mono font-tabular text-[#0D1B2A]">
              System Helpdesk: cc-support@iisermohali.ac.in · Internal Ext: +91-172-2240-1050 / 1054
            </p>
          </div>
        </div>
      </footer>

      {/* Task Detail Modal */}
      <TaskDetailModal
        responsibility={selectedTask}
        onClose={() => setSelectedTask(null)}
        staffList={staffList}
        duties={duties}
      />

      {/* Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          fetchData();
        }}
      />
    </div>
  );
}
