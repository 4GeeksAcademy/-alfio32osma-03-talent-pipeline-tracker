import Link from 'next/link';
import { Candidato, ESTADO_LABELS, ETAPA_LABELS } from '../types/candidate';

interface Props {
  candidatos: Candidato[];
}

export default function CandidateList({ candidatos }: Props) {
  if (!candidatos.length) {
    return <div className="p-4 text-center text-gray-500">No hay candidaturas.</div>;
  }
  return (
    <table className="min-w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Nombre</th>
          <th className="p-2">Puesto</th>
          <th className="p-2">Estado</th>
          <th className="p-2">Etapa</th>
        </tr>
      </thead>
      <tbody>
        {candidatos.map((c) => (
          <tr key={c.id} className="border-b hover:bg-gray-50">
            <td className="p-2">
              <Link href={`/candidates/${c.id}`} className="text-blue-600 underline">
                {c.nombre}
              </Link>
            </td>
            <td className="p-2">{c.puesto}</td>
            <td className="p-2">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                {ESTADO_LABELS[c.estado]}
              </span>
            </td>
            <td className="p-2">
              <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">
                {ETAPA_LABELS[c.etapa]}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
