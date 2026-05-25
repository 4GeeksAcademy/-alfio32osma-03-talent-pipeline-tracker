import Link from 'next/link';
import { Candidato, ESTADO_LABELS, ETAPA_LABELS } from '../types/candidate';

function IconForum({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6 7h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5l-4 3v-3H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Props {
  candidatos: Candidato[];
}

function getEstadoStyles(estado: string) {
  switch (estado) {
    case 'received':
      return 'bg-surface-variant/10 text-outline border border-outline/20';
    case 'in_progress':
      return 'bg-gourmet-gold/10 text-gourmet-gold border border-gourmet-gold/20';
    case 'selected':
      return 'bg-gourmet-gold/20 text-gourmet-gold border border-gourmet-gold/30';
    case 'discarded':
      return 'bg-steak-red/10 text-steak-red border border-steak-red/20';
    default:
      return 'bg-outline/10 text-outline border border-outline/20';
  }
}

function getCardBorder(estado: string) {
  switch (estado) {
    case 'in_progress':
    case 'selected':
      return 'border-l-4 border-l-gourmet-gold';
    case 'discarded':
      return 'border-l-4 border-l-steak-red opacity-75 hover:opacity-100';
    default:
      return 'border-l-4 border-l-outline';
  }
}

export default function CandidateList({ candidatos }: Props) {
  if (!candidatos.length) {
    return <div className="p-4 text-center text-neutral-500">No hay candidaturas.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {candidatos.map((c) => (
        <div
          key={c.id}
          className={`pipeline-card bg-[#1a1a1a] border border-outline/20 p-6 rounded-xl flex flex-col gap-4 group hover:border-gourmet-gold/50 ${getCardBorder(c.estado)}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-surface-variant/10 flex items-center justify-center font-headline-lg ${c.estado === 'discarded' ? 'text-steak-red' : c.estado === 'in_progress' || c.estado === 'selected' ? 'text-gourmet-gold' : 'text-outline'}`}>{c.nombre.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
              <div>
                <h3 className={`font-headline-lg text-headline-lg-mobile text-paper-white group-hover:${c.estado === 'discarded' ? 'text-steak-red' : c.estado === 'in_progress' || c.estado === 'selected' ? 'text-gourmet-gold' : 'text-outline'} transition-colors`}>{c.nombre}</h3>
                <p className="font-body-sm text-body-sm text-outline">{c.puesto}</p>
              </div>
            </div>
            <span className={`font-label-caps text-label-caps px-3 py-1.5 rounded-full ${getEstadoStyles(c.estado)}`}>{ESTADO_LABELS[c.estado]}</span>
          </div>
          <div className="flex items-center gap-3 py-3 border-y border-outline/20">
            <IconForum className="h-5 w-5 text-outline" />
            <span className="font-body-sm text-body-sm text-outline">Etapa: <span className="text-smoke-gray font-medium">{ETAPA_LABELS[c.etapa]}</span></span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="font-data-tabular text-data-tabular text-outline italic">—</span>
            <Link href={`/candidates/${c.id}`} className={`font-label-caps text-label-caps ${c.estado === 'discarded' ? 'text-outline hover:text-smoke-gray' : 'text-gourmet-gold hover:text-gourmet-gold/80'} transition-colors flex items-center gap-1`}>Ver Perfil <IconArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      ))}
    </div>
  );
}
