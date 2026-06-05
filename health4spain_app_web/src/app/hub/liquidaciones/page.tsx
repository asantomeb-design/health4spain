'use client';

import { useEffect, useState } from 'react';
import { useHubUser } from '@/hooks/useHubUser';
import { formatEuros } from '@/lib/hub/commissions';

interface Company {
  id: string;
  slug: string;
  nombre: string;
  parser_key: string;
  regimen_default: string;
}

interface UploadResult {
  upload_id: string;
  company: string;
  periodo: string;
  n_total: number;
  n_validas: number;
  n_error: number;
  total_comision_bruta: number;
  errores_muestra: { fila: number; poliza: string | null; errores: string[] }[];
}

export default function LiquidacionesPage() {
  const { fetchWithAuth, can } = useHubUser();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [fileName, setFileName] = useState('');
  const [csvContent, setCsvContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWithAuth('/api/hub/companies')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setCompanies(j.data);
      })
      .catch(() => {});
  }, [fetchWithAuth]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    setCsvContent(await file.text());
    setResult(null);
    setError('');
  };

  const handleUpload = async () => {
    setError('');
    setResult(null);
    if (!companyId) return setError('Selecciona la compañía.');
    if (!csvContent) return setError('Selecciona un fichero CSV.');
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/hub/liquidaciones/upload', {
        method: 'POST',
        body: JSON.stringify({
          company_id: companyId,
          csv_content: csvContent,
          periodo: periodo.trim() || undefined,
          filename: fileName,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Error al cargar el CSV');
      } else {
        setResult(json.data);
      }
    } catch {
      setError('Error de red al cargar el CSV');
    } finally {
      setLoading(false);
    }
  };

  if (!can('liquidaciones.upload_csv')) {
    return <div className="p-10 text-gray-600">No tienes permiso para cargar liquidaciones.</div>;
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cargar liquidación</h1>
        <p className="text-gray-600 mt-2">
          Sube el CSV de comisiones de la aseguradora. Se valida, se deduplica por contenido y se
          normaliza para su asignación a cada closer.
        </p>
      </header>

      <div className="border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compañía</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[accent]"
            >
              <option value="">— Selecciona —</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.regimen_default})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periodo (MM-YYYY) <span className="text-gray-400 font-normal">— opcional</span>
            </label>
            <input
              type="text"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              placeholder="Se detecta del CSV si se deja vacío"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[accent]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fichero CSV</label>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:font-medium hover:file:bg-accent-600"
          />
          {fileName && <p className="text-xs text-gray-500 mt-2">{fileName}</p>}
        </div>

        {error && (
          <div className="p-3 bg-accent-50 border border-accent-200 text-accent-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 transition disabled:opacity-50"
        >
          {loading ? 'Procesando…' : 'Cargar y procesar'}
        </button>
      </div>

      {result && (
        <div className="mt-8 border border-green-200 bg-green-50 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 text-green-800">Carga completada</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <Stat label="Compañía" value={result.company} />
            <Stat label="Periodo" value={result.periodo} />
            <Stat label="Líneas válidas" value={`${result.n_validas} / ${result.n_total}`} />
            <Stat label="Comisión bruta" value={formatEuros(result.total_comision_bruta)} />
          </div>
          {result.n_error > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-amber-700 mb-2">
                {result.n_error} línea(s) con error (no importadas):
              </p>
              <ul className="text-xs text-gray-700 space-y-1">
                {result.errores_muestra.map((e, i) => (
                  <li key={i}>
                    Fila {e.fila} {e.poliza ? `(póliza ${e.poliza})` : ''}: {e.errores.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <a href="/hub/asignacion" className="inline-block mt-5 text-accent font-medium hover:underline">
            Ir a asignar líneas →
          </a>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-base font-bold mt-1">{value}</p>
    </div>
  );
}
