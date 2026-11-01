'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { UserSession } from '@/lib/types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: UserSession | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  onQuickSwitchRole: (role: 'admin' | 'faculty') => void;
  unreadAnnouncementsCount?: number;
}

export function Navbar({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenLogin,
  onQuickSwitchRole,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'directory', label: 'Staff Directory' },
    { id: 'schedule', label: 'Duty Schedule' },
    { id: 'responsibilities', label: 'Responsibilities' },
    { id: 'announcements', label: 'Notices' },
  ];

  if (isAdmin) {
    navItems.push({
      id: 'admin',
      label: 'Administration',
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#D8D5CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Title (One Line) */}
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 text-left shrink-0 whitespace-nowrap group cursor-pointer"
          >
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/images/iiserm_logo.png"
                alt="IISER Mohali Emblem"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#0D1B2A] group-hover:text-[#9E3B24] transition-colors">
              IISER Mohali <span className="font-normal text-stone-400 mx-1">/</span> Computer Centre
            </span>
          </button>

          {/* Zone 2: Primary Navigation Links (Clean Typography, No Pills or Icons) */}
          <nav className="hidden lg:flex items-center gap-7 h-full">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`relative h-full flex items-center text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'font-semibold text-[#0D1B2A] border-b-2 border-[#9E3B24]'
                      : 'font-medium text-stone-600 hover:text-[#0D1B2A]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action / Account Control */}
          <div className="hidden lg:flex items-center shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 py-1.5 px-3 border border-[#D8D5CD] bg-[#F7F6F2] hover:border-stone-400 transition-colors text-left cursor-pointer"
                >
                  <div className="text-xs">
                    <span className="font-semibold text-[#0D1B2A] whitespace-nowrap">
                      {currentUser.name.split('(')[0].trim()}
                    </span>
                    <span className="text-stone-400 mx-1.5">·</span>
                    <span className="text-stone-600 font-tabular">
                      {currentUser.role === 'admin' ? 'Head, CC' : 'Member'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-1 w-72 bg-white border border-[#182026] shadow-lg py-3 z-50 text-stone-800"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 pb-3 border-b border-[#E5E2DC]">
                      <p className="text-[11px] text-stone-500">Institutional Session</p>
                      <p className="text-xs font-semibold text-[#0D1B2A] font-tabular mt-0.5 truncate">
                        {currentUser.email}
                      </p>
                      <p className="text-[11px] text-stone-600 mt-1">
                        Role: {currentUser.role === 'admin' ? 'Administrator (Head of CC)' : 'Community Member (Read-Only)'}
                      </p>
                    </div>

                    <div className="px-4 py-2.5 border-b border-[#E5E2DC] bg-[#F7F6F2]">
                      <p className="text-[11px] font-medium text-stone-600 mb-2">
                        Switch Evaluation Persona
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onQuickSwitchRole('admin');
                            setUserDropdownOpen(false);
                          }}
                          className={`py-1.5 px-2 text-xs font-medium border transition-colors cursor-pointer ${
                            isAdmin
                              ? 'bg-[#0D1B2A] text-white border-[#0D1B2A]'
                              : 'bg-white text-stone-700 border-[#D8D5CD] hover:border-stone-400'
                          }`}
                        >
                          Head of CC
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onQuickSwitchRole('faculty');
                            setUserDropdownOpen(false);
                          }}
                          className={`py-1.5 px-2 text-xs font-medium border transition-colors cursor-pointer ${
                            !isAdmin
                              ? 'bg-[#0D1B2A] text-white border-[#0D1B2A]'
                              : 'bg-white text-stone-700 border-[#D8D5CD] hover:border-stone-400'
                          }`}
                        >
                          Community
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 px-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-2 py-1.5 text-xs font-medium text-[#9E3B24] hover:bg-stone-100 transition-colors text-left cursor-pointer"
                      >
                        Sign Out / Change Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-4 py-2 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
              >
                Institutional Sign-In
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-[#0D1B2A]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D8D5CD] bg-white px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-3 text-left text-sm ${
                    isActive
                      ? 'font-semibold text-[#9E3B24] bg-[#F7F6F2]'
                      : 'font-medium text-stone-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E5E2DC] space-y-2">
            {currentUser ? (
              <>
                <div className="text-xs text-stone-600 px-3">
                  Signed in as <strong className="text-[#0D1B2A]">{currentUser.email}</strong>
                </div>
                <div className="flex gap-2 px-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onQuickSwitchRole('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 text-xs border border-[#D8D5CD] bg-[#F7F6F2] text-[#0D1B2A] font-medium"
                  >
                    Head of CC
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onQuickSwitchRole('faculty');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 text-xs border border-[#D8D5CD] bg-[#F7F6F2] text-[#0D1B2A] font-medium"
                  >
                    Community Member
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-left text-xs font-semibold text-[#9E3B24]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-[#0D1B2A] text-white text-xs font-semibold text-center"
              >
                Institutional Sign-In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
