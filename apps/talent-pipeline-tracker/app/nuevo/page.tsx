"use client";
import { useState } from 'react';
import { createCandidato } from '../../lib/api';
import { Candidato } from '../../types/candidate';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

function normalizeLinkedIn(value: string) {
  const input = value.trim();
  if (!input) return '';
  if (/^https?:\/\//i.test(input)) return input;
  if (!input.includes('.') && !input.includes('/')) {
    return `https://www.linkedin.com/in/${input}`;
  }
  return `https://${input}`;
}

function normalizeUrl(value: string) {
  const input = value.trim();
  if (!input) return '';
  return /^https?:\/\//i.test(input) ? input : `https://${input}`;
}

function isValidUrl(value: string) {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function toOptionalString(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export default function NuevoCandidatoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const form = e.currentTarget;
    const linkedinNormalizado = normalizeLinkedIn(form.linkedin.value);
    const enlaceCVNormalizado = normalizeUrl(form.enlace_cv.value);

    if (!isValidUrl(linkedinNormalizado)) {
      setLoading(false);
      setError('El campo LinkedIn no tiene un formato de URL válido.');
      return;
    }

    if (!isValidUrl(enlaceCVNormalizado)) {
      setLoading(false);
      setError('El enlace de CV no tiene un formato de URL válido.');
      return;
    }

    const aniosExperienciaRaw = form.anios_experiencia.value.trim();
    const aniosExperiencia = aniosExperienciaRaw ? Number(aniosExperienciaRaw) : undefined;

    if (aniosExperienciaRaw && Number.isNaN(aniosExperiencia)) {
      setLoading(false);
      setError('Años de experiencia debe ser un número válido.');
      return;
    }

    const data: Partial<Candidato> = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      puesto: form.puesto.value.trim(),
      telefono: toOptionalString(form.telefono.value),
      linkedin: toOptionalString(linkedinNormalizado),
      enlace_cv: toOptionalString(enlaceCVNormalizado),
      anios_experiencia: aniosExperiencia,
      estado: form.estado.value,
      etapa: form.etapa.value,
    };
    try {
      await createCandidato(data);
      setSuccess(true);
      form.reset();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <a href="/" className="text-blue-600 underline mb-4 inline-block">← Volver al listado</a>
      <h1 className="text-2xl font-bold mb-4">Registrar nuevo candidato</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="nombre" required placeholder="Nombre completo" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" />
        <input name="email" required type="email" placeholder="Email" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" />
        <input name="puesto" required placeholder="Puesto" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" />
        <input name="telefono" placeholder="Teléfono" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" />
        <input name="linkedin" placeholder="LinkedIn" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" />
        <input name="enlace_cv" placeholder="Enlace al CV" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" />
        <input name="anios_experiencia" type="number" min="0" placeholder="Años de experiencia" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" />
        <select name="estado" required defaultValue="" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors">
          <option value="" disabled className="bg-[#1a1a1a] text-outline">Estado</option>
          <option value="received" className="bg-[#1a1a1a] text-smoke-gray">Recibida</option>
          <option value="in_progress" className="bg-[#1a1a1a] text-smoke-gray">En proceso</option>
          <option value="selected" className="bg-[#1a1a1a] text-smoke-gray">Seleccionada</option>
          <option value="discarded" className="bg-[#1a1a1a] text-smoke-gray">Descartada</option>
        </select>
        <select name="etapa" required defaultValue="" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors">
          <option value="" disabled className="bg-[#1a1a1a] text-outline">Etapa</option>
          <option value="pending" className="bg-[#1a1a1a] text-smoke-gray">Pendiente de revisión</option>
          <option value="review" className="bg-[#1a1a1a] text-smoke-gray">En revisión</option>
          <option value="personal_interview" className="bg-[#1a1a1a] text-smoke-gray">Entrevista personal</option>
          <option value="technical_interview" className="bg-[#1a1a1a] text-smoke-gray">Entrevista técnica</option>
          <option value="offer_presented" className="bg-[#1a1a1a] text-smoke-gray">Oferta presentada</option>
        </select>
        <button type="submit" className="bg-gourmet-gold text-charcoal-deep px-4 py-2 rounded-lg font-medium w-full hover:bg-gourmet-gold/90 transition-colors" disabled={loading}>Registrar</button>
      </form>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {success && <div className="p-4 text-green-700 bg-green-50 border border-green-200 rounded mt-4">¡Candidato registrado con éxito!</div>}
    </main>
  );
}
