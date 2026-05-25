"use client";
import { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CandidateList from '../components/CandidateList';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useCandidates } from '../hooks/useCandidates';
import GlobalSearchInput from '../components/GlobalSearchInput';

const estados = [
  { value: '', label: 'Todos' },
  { value: 'received', label: 'Recibida' },
  { value: 'in_progress', label: 'En proceso' },
  { value: 'selected', label: 'Seleccionada' },
  { value: 'discarded', label: 'Descartada' },
];

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const estado = searchParams.get('estado') || '';
  const q = searchParams.get('q') || '';
  // Filtros y búsqueda
  const params: Record<string, string> = {};
  if (estado) params.estado = estado;
  const { data, loading, error } = useCandidates(params);

  const filteredData = useMemo(() => {
    if (!data) return null;
    const term = q.trim().toLowerCase();
    if (!term) return data;

    return data.filter((candidate) => {
      const nombre = candidate.nombre.toLowerCase();
      const email = candidate.email.toLowerCase();
      return nombre.includes(term) || email.includes(term);
    });
  }, [data, q]);

  function handleChipClick(value: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set('estado', value);
    } else {
      params.delete('estado');
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex-1">
      {/* Header y búsqueda */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-outline">Filtrar por Estado</h2>
          <span className="font-data-tabular text-data-tabular text-outline">{filteredData ? `${filteredData.length} Candidatos Encontrados` : ''}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-6">
          {estados.map((e) => (
            <button
              key={e.value}
              className={`whitespace-nowrap px-5 py-2.5 font-label-caps text-label-caps rounded-full transition-colors ${estado === e.value ? 'bg-gourmet-gold text-charcoal-deep font-medium' : 'bg-[#1a1a1a] text-smoke-gray border border-outline/30 hover:border-gourmet-gold'}`}
              onClick={() => handleChipClick(e.value)}
              type="button"
            >
              {e.label}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-lg mb-8">
          <GlobalSearchInput
            className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg pl-11 pr-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors font-body-sm"
            placeholder="Buscar por nombre o email..."
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </section>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {filteredData && <CandidateList candidatos={filteredData} />}
    </main>
  );
}
