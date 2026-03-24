'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CiudadItem {
  nombre: string;
  slug: string;
  porcentaje_extranjeros?: number;
}

interface RegionGroup {
  label: string;
  ciudades: CiudadItem[];
}

interface DestinosDropdownProps {
  regiones: RegionGroup[];
  requestUrl: string;
  selectPlaceholder: string;
  foreignPopLabel: string;
  requestLabel: string;
}

export default function DestinosDropdown({
  regiones,
  requestUrl,
  foreignPopLabel,
  requestLabel,
}: DestinosDropdownProps) {
  const [openRegion, setOpenRegion] = useState<number>(0);

  const buildUrl = (slug: string) =>
    `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}ciudad=${slug}`;

  return (
    <div className="space-y-4">
      {regiones.map((region, idx) => {
        const isOpen = openRegion === idx;

        return (
          <div key={region.label}>
            <button
              type="button"
              onClick={() => setOpenRegion(isOpen ? -1 : idx)}
              className="w-full flex items-center justify-between py-4 border-b-2 border-accent text-left group"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-bold m-0">
                  {region.label}
                </h2>
                <span className="text-sm text-gray-400 font-normal">
                  {region.ciudades.length}
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? 'grid-rows-[1fr] opacity-100 mt-4'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {region.ciudades.map((ciudad) => (
                    <Link
                      key={ciudad.slug}
                      href={buildUrl(ciudad.slug)}
                      className="group/card border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-accent hover:bg-white transition-all duration-200"
                    >
                      <span className="block font-semibold text-sm sm:text-base text-gray-900 group-hover/card:text-black mb-1">
                        {ciudad.nombre}
                      </span>
                      {ciudad.porcentaje_extranjeros != null && (
                        <span className="block text-xs text-gray-400">
                          {ciudad.porcentaje_extranjeros}% {foreignPopLabel}
                        </span>
                      )}
                      <span className="block text-xs font-semibold text-gray-300 mt-2 group-hover/card:text-accent transition-colors">
                        {requestLabel} →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
