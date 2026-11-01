'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

interface CampusHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: () => void;
  activeStaffCount: number;
  totalServicesCount: number;
  onNavigateTab: (tab: string) => void;
}

export function CampusHero({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  activeStaffCount,
  totalServicesCount,
  onNavigateTab,
}: CampusHeroProps) {
  const [activePhoto, setActivePhoto] = useState<'exterior' | 'lab' | 'library'>('exterior');

  const photos = {
    exterior: {
      src: '/images/iiser_informatics_building.jpg',
      label: 'Informatics Centre Exterior',
      caption:
        'Informatics Centre Building, Sector 81, Knowledge City, SAS Nagar — Housing the Computer Centre and Central Library.',
    },
    lab: {
      src: '/images/iiser_computer_centre.webp',
      label: 'Central Computing Facility',
      caption:
        'First-floor student computing laboratory equipped with dual-boot Linux and Windows workstations.',
    },
    library: {
      src: '/images/iiser_library.webp',
      label: 'Central Library Reading Hall',
      caption:
        'Main reading atrium within the Informatics Centre served by high-density Eduroam wireless infrastructure.',
    },
  };

  const currentPhoto = photos[activePhoto];

  return (
    <section className="bg-white border-b border-[#D8D5CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Editorial Masthead & Task Lookup */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2 border-b border-[#E5E2DC] pb-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
                <span>भारतीय विज्ञान शिक्षा एवं अनुसंधान संस्थान मोहाली</span>
                <span aria-hidden="true">·</span>
                <span>Informatics Centre, Sector 81</span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#0D1B2A] leading-[1.15] tracking-tight">
                Computer Centre · Staff Directory &amp; Service Desk
              </h1>
            </div>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-2xl">
              Official directory of IISER Mohali Computer Centre personnel, technical divisions, and
              weekly duty schedules. Locate the designated staff member for Campus Network, Google
              Workspace, eSmarth ERP, Moodle LMS, KOHA/DSpace, Data Center (HPC), or Teaching Labs.
            </p>

            {/* Formal Institutional Search Bar */}
            <div className="pt-1 max-w-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSearchSubmit?.();
                }}
                className="flex flex-col sm:flex-row border border-[#182026] bg-white"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-stone-500 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by service or staff name (e.g., Moodle, eSmarth, Google Workspace, Network, KOHA)..."
                    aria-label="Search for a task, service, staff member or responsibility"
                    className="w-full pl-3 pr-4 py-3 text-sm text-[#182026] placeholder-stone-500 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white font-semibold text-sm transition-colors shrink-0 cursor-pointer border-t sm:border-t-0 sm:border-l border-[#182026]"
                >
                  Search Directory
                </button>
              </form>

              {/* Quiet Text Index Links (No Pill Enclosures) */}
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-600">
                <span className="font-semibold text-[#0D1B2A]">Quick filter:</span>
                {[
                  'Google Workspace',
                  'Campus Network',
                  'eSmarth ERP',
                  'Moodle LMS',
                  'KOHA & DSpace',
                  'Cyber Security',
                  'Website Updates',
                  'Teaching Labs',
                ].map((term, index, arr) => (
                  <React.Fragment key={term}>
                    <button
                      type="button"
                      onClick={() => {
                        onSearchChange(term);
                        onNavigateTab('directory');
                      }}
                      className="text-stone-700 hover:text-[#9E3B24] underline underline-offset-4 decoration-stone-300 hover:decoration-[#9E3B24] transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                    {index < arr.length - 1 && (
                      <span aria-hidden="true" className="text-stone-400">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Quiet Tabular Summary Ledger */}
            <div className="pt-4 border-t border-[#E5E2DC] grid grid-cols-3 gap-6 max-w-xl text-xs">
              <div>
                <div className="text-stone-500">CC Personnel</div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('directory')}
                  className="mt-0.5 text-base sm:text-lg font-bold font-tabular text-[#0D1B2A] hover:text-[#9E3B24] transition-colors cursor-pointer"
                >
                  {activeStaffCount} Staff Members
                </button>
              </div>
              <div>
                <div className="text-stone-500">IT Divisions</div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('responsibilities')}
                  className="mt-0.5 text-base sm:text-lg font-bold font-tabular text-[#0D1B2A] hover:text-[#9E3B24] transition-colors cursor-pointer"
                >
                  {totalServicesCount} Core Services
                </button>
              </div>
              <div>
                <div className="text-stone-500">Office Telefax</div>
                <div className="mt-0.5 text-base sm:text-lg font-bold font-tabular text-[#0D1B2A]">
                  0172-2240266
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Architectural Plate of IISER Mohali Informatics Centre */}
          <div className="lg:col-span-5">
            <div className="border border-[#D8D5CD] bg-[#F7F6F2] p-3">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900 border border-[#D8D5CD]">
                <Image
                  src={currentPhoto.src}
                  alt={currentPhoto.label}
                  fill
                  className="object-cover object-center transition-opacity duration-300"
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>

              {/* Architectural Plate Caption & View Selector */}
              <div className="pt-3 space-y-3">
                <p className="text-xs text-stone-700 leading-relaxed min-h-[2.25rem]">
                  <strong className="font-semibold text-[#0D1B2A]">{currentPhoto.label}:</strong>{' '}
                  {currentPhoto.caption}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#D8D5CD] text-xs">
                  <span className="text-stone-500 font-tabular text-[11px]">
                    Facility Views:
                  </span>
                  <div className="flex items-center gap-3">
                    {(
                      [
                        { id: 'exterior', label: 'Building Exterior' },
                        { id: 'lab', label: 'Computing Lab' },
                        { id: 'library', label: 'Library Atrium' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActivePhoto(tab.id)}
                        className={`text-xs transition-colors cursor-pointer ${
                          activePhoto === tab.id
                            ? 'font-semibold text-[#9E3B24] underline underline-offset-4'
                            : 'text-stone-600 hover:text-[#0D1B2A]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
