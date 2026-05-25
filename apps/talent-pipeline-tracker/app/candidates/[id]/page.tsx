"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import CandidateDetail from '../../../components/CandidateDetail';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';
import { useCandidateDetail } from '../../../hooks/useCandidateDetail';

export default function CandidateDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, notas, loading, error } = useCandidateDetail(id);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <Link href="/" className="text-blue-600 underline mb-4 inline-block">← Volver al listado</Link>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && <CandidateDetail candidato={data} notas={notas} />}
    </main>
  );
}
