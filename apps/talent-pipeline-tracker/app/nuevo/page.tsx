"use client";
import { useState } from 'react';
import { createCandidato } from '../../lib/api';
import { Candidato } from '../../types/candidate';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

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
    const data: Partial<Candidato> = {
      nombre: form.nombre.value,
      email: form.email.value,
      puesto: form.puesto.value,
      telefono: form.telefono.value,
      linkedin: form.linkedin.value,
      enlace_cv: form.enlace_cv.value,
      anios_experiencia: Number(form.anios_experiencia.value),
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
        <input name="nombre" required placeholder="Nombre completo" className="border p-2 rounded w-full" />
        <input name="email" required type="email" placeholder="Email" className="border p-2 rounded w-full" />
        <input name="puesto" required placeholder="Puesto" className="border p-2 rounded w-full" />
        <input name="telefono" placeholder="Teléfono" className="border p-2 rounded w-full" />
        <input name="linkedin" placeholder="LinkedIn" className="border p-2 rounded w-full" />
        <input name="enlace_cv" placeholder="Enlace al CV" className="border p-2 rounded w-full" />
        <input name="anios_experiencia" type="number" min="0" placeholder="Años de experiencia" className="border p-2 rounded w-full" />
        <select name="estado" required className="border p-2 rounded w-full">
          <option value="">Estado</option>
          <option value="received">Recibida</option>
          <option value="in_progress">En proceso</option>
          <option value="selected">Seleccionada</option>
          <option value="discarded">Descartada</option>
        </select>
        <select name="etapa" required className="border p-2 rounded w-full">
          <option value="">Etapa</option>
          <option value="pending">Pendiente de revisión</option>
          <option value="review">En revisión</option>
          <option value="personal_interview">Entrevista personal</option>
          <option value="technical_interview">Entrevista técnica</option>
          <option value="offer_presented">Oferta presentada</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={loading}>Registrar</button>
      </form>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {success && <div className="p-4 text-green-700 bg-green-50 border border-green-200 rounded mt-4">¡Candidato registrado con éxito!</div>}
    </main>
  );
}
