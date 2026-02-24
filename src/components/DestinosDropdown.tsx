'use client';

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
}

export default function DestinosDropdown({
  regiones,
  requestUrl,
  selectPlaceholder,
  foreignPopLabel,
}: DestinosDropdownProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    if (slug) {
      const url = `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}ciudad=${slug}`;
      window.location.href = url;
    }
  };

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="destinos-select" className="sr-only">
        {selectPlaceholder}
      </label>
      <select
        id="destinos-select"
        onChange={handleChange}
        defaultValue=""
        className="w-full px-4 py-3.5 text-base sm:text-lg border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none bg-white cursor-pointer"
      >
        <option value="" disabled>
          {selectPlaceholder}
        </option>
        {regiones.map((region) => (
          <optgroup key={region.label} label={region.label}>
            {region.ciudades.map((ciudad) => (
              <option key={ciudad.slug} value={ciudad.slug}>
                {ciudad.nombre}
                {ciudad.porcentaje_extranjeros != null
                  ? ` — ${ciudad.porcentaje_extranjeros}% ${foreignPopLabel}`
                  : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
