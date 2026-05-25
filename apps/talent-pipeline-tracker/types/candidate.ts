import type { Nota } from './note';

// Tipos para candidato y valores de dominio según CONTEXT.md

export type EstadoAPI = 'received' | 'in_progress' | 'selected' | 'discarded';
export type EtapaAPI =
  | 'pending'
  | 'review'
  | 'personal_interview'
  | 'technical_interview'
  | 'offer_presented';

export interface Candidato {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  puesto: string;
  linkedin?: string;
  enlace_cv?: string;
  anios_experiencia?: number;
  estado: EstadoAPI;
  etapa: EtapaAPI;
  fecha_aplicacion?: string;
  notas?: Nota[];
}

// Mapeos de etiquetas
export const ESTADO_LABELS: Record<EstadoAPI, string> = {
  received: 'Recibida',
  in_progress: 'En proceso',
  selected: 'Seleccionada',
  discarded: 'Descartada',
};

export const ETAPA_LABELS: Record<EtapaAPI, string> = {
  pending: 'Pendiente de revisión',
  review: 'En revisión',
  personal_interview: 'Entrevista personal',
  technical_interview: 'Entrevista técnica',
  offer_presented: 'Oferta presentada',
};
