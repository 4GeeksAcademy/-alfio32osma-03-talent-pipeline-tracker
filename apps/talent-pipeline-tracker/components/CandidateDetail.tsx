import { useState } from 'react';
import { Candidato, ESTADO_LABELS, ETAPA_LABELS, EstadoAPI, EtapaAPI } from '../types/candidate';
import { Nota } from '../types/note';
import NoteList from './NoteList';
import { patchCandidato, addNota, deleteNota } from '../lib/api';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

interface Props {
  candidato: Candidato;
  notas: Nota[];
}

export default function CandidateDetail({ candidato, notas: notasProp }: Props) {
  const [estado, setEstado] = useState<EstadoAPI>(candidato.estado);
  const [etapa, setEtapa] = useState<EtapaAPI>(candidato.etapa);
  const [notas, setNotas] = useState<Nota[]>(notasProp);
  const [notaNueva, setNotaNueva] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleEstadoEtapaChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await patchCandidato(candidato.id, { estado, etapa });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNota(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!notaNueva.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const nota = await addNota(candidato.id, notaNueva);
      setNotas([nota, ...notas]);
      setNotaNueva('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteNota(id: string) {
    setLoading(true);
    setError(null);
    try {
      await deleteNota(candidato.id, id);
      setNotas(notas.filter(n => n.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold text-lg mb-2">{candidato.nombre}</h2>
          <div><b>Email:</b> {candidato.email}</div>
          {candidato.telefono && <div><b>Teléfono:</b> {candidato.telefono}</div>}
          <div><b>Puesto:</b> {candidato.puesto}</div>
          {candidato.linkedin && <div><b>LinkedIn:</b> <a href={candidato.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{candidato.linkedin}</a></div>}
          {candidato.enlace_cv && <div><b>CV:</b> <a href={candidato.enlace_cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver CV</a></div>}
          {typeof candidato.anios_experiencia === 'number' && <div><b>Años de experiencia:</b> {candidato.anios_experiencia}</div>}
          {candidato.fecha_aplicacion && <div><b>Fecha de aplicación:</b> {candidato.fecha_aplicacion}</div>}
        </div>
        <div>
          <form className="space-y-2" onSubmit={handleEstadoEtapaChange}>
            <div>
              <b>Estado:</b>
              <select className="ml-2 border p-1 rounded" value={estado} onChange={e => setEstado(e.target.value as EstadoAPI)}>
                <option value="received">Recibida</option>
                <option value="in_progress">En proceso</option>
                <option value="selected">Seleccionada</option>
                <option value="discarded">Descartada</option>
              </select>
            </div>
            <div>
              <b>Etapa:</b>
              <select className="ml-2 border p-1 rounded" value={etapa} onChange={e => setEtapa(e.target.value as EtapaAPI)}>
                <option value="pending">Pendiente de revisión</option>
                <option value="review">En revisión</option>
                <option value="personal_interview">Entrevista personal</option>
                <option value="technical_interview">Entrevista técnica</option>
                <option value="offer_presented">Oferta presentada</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded" disabled={loading}>Guardar cambios</button>
            {success && <span className="text-green-700 ml-2">¡Guardado!</span>}
          </form>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Notas internas</h3>
        <form className="flex gap-2 mb-2" onSubmit={handleAddNota}>
          <input
            className="border p-2 rounded flex-1"
            placeholder="Añadir nota interna"
            value={notaNueva}
            onChange={e => setNotaNueva(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded" disabled={loading || !notaNueva.trim()}>Añadir</button>
        </form>
        <NoteList notas={notas} onDelete={handleDeleteNota} />
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
