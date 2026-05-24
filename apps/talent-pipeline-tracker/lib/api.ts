// Funciones de acceso a la API de candidatos y notas
import { Candidato, Nota } from '../types/candidate';

const API_BASE = 'https://playground.4geeks.com/tracker/api/v1';

export async function fetchCandidatos(params?: Record<string, string>) {
  const url = new URL(`${API_BASE}/records`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Error al cargar candidatos');
  return res.json() as Promise<Candidato[]>;
}

export async function fetchCandidato(id: string) {
  const res = await fetch(`${API_BASE}/records/${id}`);
  if (!res.ok) throw new Error('Error al cargar candidato');
  return res.json() as Promise<Candidato>;
}

export async function createCandidato(data: Partial<Candidato>) {
  const res = await fetch(`${API_BASE}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear candidato');
  return res.json() as Promise<Candidato>;
}

export async function updateCandidato(id: string, data: Partial<Candidato>) {
  const res = await fetch(`${API_BASE}/records/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar candidato');
  return res.json() as Promise<Candidato>;
}

export async function patchCandidato(id: string, data: Partial<Candidato>) {
  const res = await fetch(`${API_BASE}/records/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar candidato');
  return res.json() as Promise<Candidato>;
}

export async function fetchNotas(id: string) {
  const res = await fetch(`${API_BASE}/records/${id}/notes`);
  if (!res.ok) throw new Error('Error al cargar notas');
  return res.json() as Promise<Nota[]>;
}

export async function addNota(id: string, contenido: string) {
  const res = await fetch(`${API_BASE}/records/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contenido }),
  });
  if (!res.ok) throw new Error('Error al añadir nota');
  return res.json() as Promise<Nota>;
}

export async function deleteNota(id: string, noteId: string) {
  const res = await fetch(`${API_BASE}/records/${id}/notes/${noteId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar nota');
  return res.json();
}
