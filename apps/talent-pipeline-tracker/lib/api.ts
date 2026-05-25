// Funciones de acceso a la API de candidatos y notas
import { Candidato, Nota } from '../types/candidate';

const API_BASE = '/api/tracker';
const RESOURCE_CANDIDATES = ['records', 'candidates'] as const;
const RETRY_STATUS = new Set([404, 405]);

function removeEmptyFields<T extends Record<string, unknown>>(payload: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (typeof value === 'number' && Number.isNaN(value)) return false;
      return true;
    })
  ) as Partial<T>;
}

async function getApiErrorMessage(res: Response, fallback: string) {
  const jsonRes = res.clone();
  const textRes = res.clone();

  try {
    const data = await jsonRes.json();
    if (typeof data?.detail === 'string' && data.detail.trim()) return data.detail;
    if (typeof data?.message === 'string' && data.message.trim()) return data.message;
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.map((err: unknown) => String(err)).join(', ');
    }
  } catch {
    try {
      const text = await textRes.text();
      if (text.trim()) return text;
    } catch {
      // no-op
    }
  }
  return fallback;
}

function pickString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return '';
}

function pickOptionalString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return undefined;
}

function pickNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return undefined;
}

function toEstado(value: unknown): Candidato['estado'] {
  if (value === 'received' || value === 'in_progress' || value === 'selected' || value === 'discarded') {
    return value;
  }
  return 'received';
}

function toEtapa(value: unknown): Candidato['etapa'] {
  if (
    value === 'pending' ||
    value === 'review' ||
    value === 'personal_interview' ||
    value === 'technical_interview' ||
    value === 'offer_presented'
  ) {
    return value;
  }
  return 'pending';
}

function normalizeNota(raw: unknown): Nota {
  const note = (raw ?? {}) as Record<string, unknown>;
  return {
    id: pickString(note.id, note.note_id, note.uuid),
    contenido: pickString(note.contenido, note.content, note.note),
    fecha: pickString(note.fecha, note.created_at, note.date),
  };
}

function normalizeCandidato(raw: unknown): Candidato {
  const item = (raw ?? {}) as Record<string, unknown>;
  const notesRaw = item.notas ?? item.notes;

  return {
    id: pickString(item.id, item.record_id, item.uuid),
    nombre: pickString(item.nombre, item.name, item.full_name),
    email: pickString(item.email),
    telefono: pickOptionalString(item.telefono, item.phone, item.phone_number),
    puesto: pickString(item.puesto, item.position, item.role),
    linkedin: pickOptionalString(item.linkedin, item.linkedin_url),
    enlace_cv: pickOptionalString(item.enlace_cv, item.cv_url, item.cv_link),
    anios_experiencia: pickNumber(item.anios_experiencia, item.years_experience, item.experience_years),
    estado: toEstado(item.estado ?? item.status ?? item.candidate_status),
    etapa: toEtapa(item.etapa ?? item.stage ?? item.pipeline_stage),
    fecha_aplicacion: pickOptionalString(item.fecha_aplicacion, item.application_date, item.created_at),
    notas: Array.isArray(notesRaw) ? notesRaw.map(normalizeNota) : undefined,
  };
}

async function requestByResource(buildUrl: (resource: string) => string, init?: RequestInit) {
  const errors: string[] = [];

  for (const resource of RESOURCE_CANDIDATES) {
    const res = await fetch(buildUrl(resource), init);
    if (!RETRY_STATUS.has(res.status)) return res;
    errors.push(await getApiErrorMessage(res, `No se encontró recurso ${resource}`));
  }

  throw new Error(errors.filter(Boolean).join(' | ') || 'No se pudo conectar con la API');
}

function extractCollection(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  const obj = data as Record<string, unknown>;
  const candidates = [obj.results, obj.items, obj.records, obj.data];

  for (const value of candidates) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const nested = value as Record<string, unknown>;
      if (Array.isArray(nested.results)) return nested.results;
      if (Array.isArray(nested.items)) return nested.items;
      if (Array.isArray(nested.records)) return nested.records;
    }
  }

  return [];
}

function buildApiParams(params?: Record<string, string>) {
  const apiParams: Record<string, string> = {
    page: '1',
    limit: '20',
  };

  if (!params) return apiParams;

  if (params.page?.trim()) apiParams.page = params.page.trim();
  if (params.limit?.trim()) apiParams.limit = params.limit.trim();

  if (params.estado?.trim()) apiParams.status = params.estado.trim();
  if (params.etapa?.trim()) apiParams.stage = params.etapa.trim();

  if (params.status?.trim()) apiParams.status = params.status.trim();
  if (params.stage?.trim()) apiParams.stage = params.stage.trim();

  return apiParams;
}

export async function fetchCandidatos(params?: Record<string, string>) {
  const res = await requestByResource((resource) => {
    const mergedParams = buildApiParams(params);
    const query = new URLSearchParams(mergedParams).toString();
    return `${API_BASE}/${resource}${query ? `?${query}` : ''}`;
  });

  if (!res.ok) throw new Error(await getApiErrorMessage(res, 'Error al cargar candidatos'));
  const data = await res.json();
  const rawItems = extractCollection(data);

  return rawItems.map(normalizeCandidato);
}

export async function fetchCandidato(id: string) {
  const res = await requestByResource((resource) => `${API_BASE}/${resource}/${id}`);
  if (!res.ok) throw new Error(await getApiErrorMessage(res, 'Error al cargar candidato'));
  return normalizeCandidato(await res.json());
}

export async function createCandidato(data: Partial<Candidato>) {
  const uiPayload = removeEmptyFields({
    ...data,
    anios_experiencia:
      typeof data.anios_experiencia === 'number' && !Number.isNaN(data.anios_experiencia)
        ? data.anios_experiencia
        : undefined,
  });

  const altPayload1 = removeEmptyFields({
    name: data.nombre,
    email: data.email,
    phone: data.telefono,
    position: data.puesto,
    linkedin_url: data.linkedin,
    cv_url: data.enlace_cv,
    years_experience: data.anios_experiencia,
    status: data.estado,
    stage: data.etapa,
  });

  const altPayload2 = removeEmptyFields({
    full_name: data.nombre,
    email: data.email,
    phone_number: data.telefono,
    role: data.puesto,
    linkedin: data.linkedin,
    cv_link: data.enlace_cv,
    experience_years: data.anios_experiencia,
    candidate_status: data.estado,
    pipeline_stage: data.etapa,
  });

  const payloads = [uiPayload, altPayload1, altPayload2];
  const errors: string[] = [];

  for (const resource of RESOURCE_CANDIDATES) {
    for (const payload of payloads) {
      const res = await fetch(`${API_BASE}/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return normalizeCandidato(await res.json());
      }

      errors.push(await getApiErrorMessage(res, 'Error al crear candidato'));
      if (RETRY_STATUS.has(res.status)) break;
    }
  }

  throw new Error(errors.filter(Boolean).join(' | ') || 'Error al crear candidato');
}

export async function updateCandidato(id: string, data: Partial<Candidato>) {
  const res = await requestByResource((resource) => `${API_BASE}/${resource}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(removeEmptyFields(data)),
  });

  if (!res.ok) throw new Error(await getApiErrorMessage(res, 'Error al actualizar candidato'));
  return normalizeCandidato(await res.json());
}

export async function patchCandidato(id: string, data: Partial<Candidato>) {
  const res = await requestByResource((resource) => `${API_BASE}/${resource}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(removeEmptyFields(data)),
  });

  if (!res.ok) throw new Error(await getApiErrorMessage(res, 'Error al actualizar candidato'));
  return normalizeCandidato(await res.json());
}

export async function fetchNotas(id: string) {
  const res = await requestByResource((resource) => `${API_BASE}/${resource}/${id}/notes`);
  if (!res.ok) throw new Error(await getApiErrorMessage(res, 'Error al cargar notas'));

  const data = await res.json();
  const rawItems = extractCollection(data);

  return rawItems.map(normalizeNota);
}

export async function addNota(id: string, contenido: string) {
  const payloads = [{ contenido }, { content: contenido }, { note: contenido }];
  const errors: string[] = [];

  for (const resource of RESOURCE_CANDIDATES) {
    for (const payload of payloads) {
      const res = await fetch(`${API_BASE}/${resource}/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return normalizeNota(await res.json());
      }

      errors.push(await getApiErrorMessage(res, 'Error al añadir nota'));
      if (RETRY_STATUS.has(res.status)) break;
    }
  }

  throw new Error(errors.filter(Boolean).join(' | ') || 'Error al añadir nota');
}

export async function deleteNota(id: string, noteId: string) {
  const res = await requestByResource((resource) => `${API_BASE}/${resource}/${id}/notes/${noteId}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error(await getApiErrorMessage(res, 'Error al eliminar nota'));
  return;
}
