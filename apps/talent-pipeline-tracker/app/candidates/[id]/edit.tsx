"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { updateCandidato, fetchCandidato } from '../../../lib/api';
import { Candidato } from '../../../types/candidate';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';

export default function EditarCandidatoPage() {
  const params = useParams();
  const id = params?.id as string;
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar datos actuales
  useEffect(() => {
    fetchCandidato(id)
      .then(setCandidato)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

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
      await updateCandidato(id, data);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!candidato) return null;

  return (
    <main className="max-w-xl mx-auto p-4">
      <a href={`/candidates/${id}`} className="text-blue-600 underline mb-4 inline-block">← Volver al detalle</a>
      <h1 className="text-2xl font-bold mb-4">Editar candidato</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="nombre" required placeholder="Nombre completo" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" defaultValue={candidato.nombre} />
        <input name="email" required type="email" placeholder="Email" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" defaultValue={candidato.email} />
        <input name="puesto" required placeholder="Puesto" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" defaultValue={candidato.puesto} />
        <input name="telefono" placeholder="Teléfono" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" defaultValue={candidato.telefono} />
        <input name="linkedin" placeholder="LinkedIn" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" defaultValue={candidato.linkedin} />
        <input name="enlace_cv" placeholder="Enlace al CV" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" defaultValue={candidato.enlace_cv} />
        <input name="anios_experiencia" type="number" min="0" placeholder="Años de experiencia" className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" defaultValue={candidato.anios_experiencia} />
        <select name="estado" required className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" defaultValue={candidato.estado}>
          <option value="received" className="bg-[#1a1a1a] text-smoke-gray">Recibida</option>
          <option value="in_progress" className="bg-[#1a1a1a] text-smoke-gray">En proceso</option>
          <option value="selected" className="bg-[#1a1a1a] text-smoke-gray">Seleccionada</option>
          <option value="discarded" className="bg-[#1a1a1a] text-smoke-gray">Descartada</option>
        </select>
        <select name="etapa" required className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" defaultValue={candidato.etapa}>
          <option value="pending" className="bg-[#1a1a1a] text-smoke-gray">Pendiente de revisión</option>
          <option value="review" className="bg-[#1a1a1a] text-smoke-gray">En revisión</option>
          <option value="personal_interview" className="bg-[#1a1a1a] text-smoke-gray">Entrevista personal</option>
          <option value="technical_interview" className="bg-[#1a1a1a] text-smoke-gray">Entrevista técnica</option>
          <option value="offer_presented" className="bg-[#1a1a1a] text-smoke-gray">Oferta presentada</option>
        </select>
        <button type="submit" className="bg-gourmet-gold text-charcoal-deep px-4 py-2 rounded-lg font-medium w-full hover:bg-gourmet-gold/90 transition-colors" disabled={loading}>Guardar cambios</button>
      </form>
      {success && <div className="p-4 text-green-700 bg-green-50 border border-green-200 rounded mt-4">¡Candidato actualizado con éxito!</div>}
    </main>
  );
}
