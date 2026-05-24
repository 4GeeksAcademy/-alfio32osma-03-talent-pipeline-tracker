"use client";
import { useSearchParams } from 'next/navigation';
import CandidateList from '../components/CandidateList';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useCandidates } from '../hooks/useCandidates';

export default function HomePage() {
  // Filtros y búsqueda desde query params
  const searchParams = useSearchParams();
  const estado = searchParams.get('estado') || undefined;
  const etapa = searchParams.get('etapa') || undefined;
  const q = searchParams.get('q') || undefined;

  const { data, loading, error } = useCandidates({ estado, etapa, q });

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Candidaturas</h1>
      {/* Filtros y búsqueda (simplificado, puedes mejorar el UI) */}
      <form className="flex gap-2 mb-4">
        <input name="q" placeholder="Buscar por nombre o email" className="border p-2 rounded flex-1" defaultValue={q} />
        <select name="estado" className="border p-2 rounded" defaultValue={estado || ''}>
          <option value="">Todos los estados</option>
          <option value="received">Recibida</option>
          <option value="in_progress">En proceso</option>
          <option value="selected">Seleccionada</option>
          <option value="discarded">Descartada</option>
        </select>
        <select name="etapa" className="border p-2 rounded" defaultValue={etapa || ''}>
          <option value="">Todas las etapas</option>
          <option value="pending">Pendiente de revisión</option>
          <option value="review">En revisión</option>
          <option value="personal_interview">Entrevista personal</option>
          <option value="technical_interview">Entrevista técnica</option>
          <option value="offer_presented">Oferta presentada</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filtrar</button>
      </form>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && <CandidateList candidatos={data} />}
    </main>
  );
}
