import { useEffect, useState } from 'react';
import { fetchCandidatos } from '../lib/api';
import { Candidato } from '../types/candidate';

export function useCandidates(params?: Record<string, string>) {
  const [data, setData] = useState<Candidato[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCandidatos(params)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}
