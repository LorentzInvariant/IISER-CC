'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, X } from 'lucide-react';
import { UserSession } from '@/lib/types';
import { DEFAULT_HEAD_CC_EMAIL } from '@/lib/auth-rules';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserSession) => void;
  isMandatoryLogin?: boolean;
}

export function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  isMandatoryLogin = false,
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'sso_diagnostics'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleDirectLogin(customEmail?: string, customRole?: string) {
    setLoading(true);
    setError(null);

    const payload = customRole
      ? { demoRole: customRole }
      : { email: customEmail || email, password };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user);
      onClose?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSimulateSSO() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'head_cc@iisermohali.ac.in',
          authType: 'sso',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'SSO assertion failed');
      onLoginSuccess(data.user);
      onClose?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'SSO simulation failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xl bg-white border border-[#182026] shadow-2xl overflow-hidden my-8"
      >
        {/* Header with Informatics Centre Image Scrim */}
        <div className="relative bg-[#0D1B2A] text-white p-6 sm:p-7 overflow-hidden border-b border-[#182026]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/iiser_informatics_building.jpg"
              alt="IISER Mohali Informatics Centre"
              fill
              className="object-cover object-center brightness-[0.22] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/80 to-transparent" />
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white p-1 border border-[#D8D5CD] shrink-0">
                <Image
                  src="/images/iiserm_logo.png"
                  alt="IISER Mohali Emblem"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-xs text-stone-300">
                  IISER Mohali · Computer Centre
                </div>
                <h2 className="font-editorial text-2xl font-bold text-white">
                  Institutional Sign-In
                </h2>
              </div>
            </div>
            {!isMandatoryLogin && onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sign-in dialog"
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-stone-300 relative z-10">
            An internal portal for the IISER Mohali community. Access restricted to authorised
            members of IISER Mohali (<code className="font-tabular">@iisermohali.ac.in</code>).
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#D8D5CD] bg-[#F7F6F2]">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-3 px-4 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'signin'
                ? 'border-[#9E3B24] text-[#0D1B2A] bg-white'
                : 'border-transparent text-stone-600 hover:text-[#0D1B2A]'
            }`}
          >
            Institutional Account Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sso_diagnostics')}
            className={`flex-1 py-3 px-4 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'sso_diagnostics'
                ? 'border-[#9E3B24] text-[#0D1B2A] bg-white'
                : 'border-transparent text-stone-600 hover:text-[#0D1B2A]'
            }`}
          >
            SSO Service Provider Metadata
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7">
          {error && (
            <div className="mb-5 p-3.5 bg-[#F7F6F2] border border-[#9E3B24] text-[#9E3B24] text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Rejected</p>
                <p className="text-stone-800">{error}</p>
              </div>
            </div>
          )}

          {activeTab === 'signin' ? (
            <div className="space-y-6">
              {/* Evaluation Persona Switcher */}
              <div className="bg-[#F7F6F2] border border-[#D8D5CD] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0D1B2A]">
                    Development / Evaluation Profiles
                  </span>
                  <span className="text-stone-500">Role Verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDirectLogin(undefined, 'admin')}
                    disabled={loading}
                    className="p-3 text-left bg-white border border-[#D8D5CD] hover:border-[#0D1B2A] transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#0D1B2A]">
                      Head of Computer Centre
                    </div>
                    <div className="text-[11px] text-[#9E3B24] font-tabular mt-0.5">
                      head_cc@iisermohali.ac.in
                    </div>
                    <div className="text-[11px] text-stone-600 mt-1">
                      Administrator — Add/edit staff, duties &amp; circulars
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectLogin(undefined, 'faculty')}
                    disabled={loading}
                    className="p-3 text-left bg-white border border-[#D8D5CD] hover:border-[#0D1B2A] transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#0D1B2A]">
                      Regular Community Member
                    </div>
                    <div className="text-[11px] text-stone-600 font-tabular mt-0.5">
                      arun.kumar@iisermohali.ac.in
                    </div>
                    <div className="text-[11px] text-stone-600 mt-1">
                      Member — Read-only directory &amp; schedule access
                    </div>
                  </button>
                </div>
              </div>

              {/* Direct Institutional Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDirectLogin();
                }}
                className="space-y-4 pt-2 border-t border-[#E5E2DC]"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    Institutional Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@iisermohali.ac.in"
                    className="w-full px-3.5 py-2.5 bg-[#F7F6F2] border border-[#D8D5CD] text-sm text-[#182026] placeholder-stone-500 focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    Institutional Access Token / Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#F7F6F2] border border-[#D8D5CD] text-sm text-[#182026] placeholder-stone-500 focus:bg-white focus:outline-none focus:border-[#0D1B2A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Verifying Credentials...' : 'Sign In'}
                </button>
              </form>

              <p className="text-[11px] text-stone-500 leading-relaxed border-t border-[#E5E2DC] pt-3">
                Role permissions are determined strictly server-side. Only{' '}
                <code className="font-tabular text-stone-800">{DEFAULT_HEAD_CC_EMAIL}</code>{' '}
                receives administrative authority.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs text-stone-700">
              <p className="leading-relaxed">
                For production deployment on IISER Mohali infrastructure, connect this Service
                Provider (SP) to the institute&apos;s OpenID Connect or SAML 2.0 Identity Provider:
              </p>

              <div className="divide-y divide-[#E5E2DC] border border-[#D8D5CD] bg-[#F7F6F2] font-tabular text-[11px]">
                <div className="p-3">
                  <div className="text-stone-500 font-sans">SP Entity ID / Audience URI</div>
                  <div className="text-[#0D1B2A] font-medium mt-0.5">
                    https://iisermohali.ac.in/cc-portal/sp
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-stone-500 font-sans">
                    Assertion Consumer Service (Callback URL)
                  </div>
                  <div className="text-[#0D1B2A] font-medium mt-0.5">
                    /api/auth/callback/sso
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-stone-500 font-sans">Required Identity Claims</div>
                  <div className="text-[#0D1B2A] font-medium mt-0.5">
                    email (@iisermohali.ac.in), fullName, designation, department
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateSSO}
                disabled={loading}
                className="w-full py-2.5 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Simulate Verified SSO Assertion (Head of CC)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
