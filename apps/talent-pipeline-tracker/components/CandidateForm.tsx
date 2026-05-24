import { useState } from 'react';
import { Candidato } from '../types/candidate';

interface Props {
  initial?: Partial<Candidato>;
  onSubmit: (data: Partial<Candidato>) => Promise<void>;
  loading: boolean;
  success?: boolean;
  error?: string | null;
}

export default function CandidateForm({ initial = {}, onSubmit, loading, success, error }: Props) {
  const [form, setForm] = useState<Partial<Candidato>>(initial);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="nombre" required placeholder="Nombre completo" className="border p-2 rounded w-full" value={form.nombre || ''} onChange={handleChange} />
      <input name="email" required type="email" placeholder="Email" className="border p-2 rounded w-full" value={form.email || ''} onChange={handleChange} />
      <input name="puesto" required placeholder="Puesto" className="border p-2 rounded w-full" value={form.puesto || ''} onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" className="border p-2 rounded w-full" value={form.telefono || ''} onChange={handleChange} />
      <input name="linkedin" placeholder="LinkedIn" className="border p-2 rounded w-full" value={form.linkedin || ''} onChange={handleChange} />
      <input name="enlace_cv" placeholder="Enlace al CV" className="border p-2 rounded w-full" value={form.enlace_cv || ''} onChange={handleChange} />
      <input name="anios_experiencia" type="number" min="0" placeholder="Años de experiencia" className="border p-2 rounded w-full" value={form.anios_experiencia || ''} onChange={handleChange} />
      <select name="estado" required className="border p-2 rounded w-full" value={form.estado || ''} onChange={handleChange}>
        <option value="">Estado</option>
        <option value="received">Recibida</option>
        <option value="in_progress">En proceso</option>
        <option value="selected">Seleccionada</option>
        <option value="discarded">Descartada</option>
      </select>
      <select name="etapa" required className="border p-2 rounded w-full" value={form.etapa || ''} onChange={handleChange}>
        <option value="">Etapa</option>
        <option value="pending">Pendiente de revisión</option>
        <option value="review">En revisión</option>
        <option value="personal_interview">Entrevista personal</option>
        <option value="technical_interview">Entrevista técnica</option>
        <option value="offer_presented">Oferta presentada</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={loading}>Guardar</button>
      {loading && <div className="text-blue-600">Guardando...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-700">¡Guardado con éxito!</div>}
    </form>
  );
}
