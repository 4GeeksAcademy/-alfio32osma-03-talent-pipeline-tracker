import { useEffect, useState } from 'react';
import { fetchCandidato, fetchNotas } from '../lib/api';
import { Candidato } from '../types/candidate';
import { Nota } from '../types/note';

export function useCandidateDetail(id: string) {
  const [data, setData] = useState<Candidato | null>(null);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchCandidato(id), fetchNotas(id)])
      .then(([candidato, notas]) => {
        setData(candidato);
        setNotas(notas);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, notas, loading, error };
}
