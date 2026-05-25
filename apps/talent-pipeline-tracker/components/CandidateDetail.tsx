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
  const [noteSuccessMessage, setNoteSuccessMessage] = useState<string | null>(null);
  const [deleteDebug, setDeleteDebug] = useState<{
    recordId: string;
    noteId: string;
    at: string;
  } | null>(null);

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
    setNoteSuccessMessage(null);
    try {
      const nota = await addNota(candidato.id, notaNueva);
      setNotas([nota, ...notas]);
      setNotaNueva('');
      setNoteSuccessMessage('Nota añadida con éxito.');
      setTimeout(() => setNoteSuccessMessage(null), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteNota(id: string) {
    setDeleteDebug({
      recordId: String(candidato.id),
      noteId: String(id ?? ''),
      at: new Date().toISOString(),
    });

    if (!id || !id.trim()) {
      setError('No se pudo eliminar la nota porque no tiene un identificador válido.');
      return;
    }

    setLoading(true);
    setError(null);
    setNoteSuccessMessage(null);
    try {
      await deleteNota(candidato.id, id);
      setNotas(notas.filter(n => n.id !== id));
      setNoteSuccessMessage('Nota eliminada con éxito.');
      setTimeout(() => setNoteSuccessMessage(null), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-8 flex flex-col md:flex-row gap-8 shadow-sm">
        <div className="flex flex-col items-center md:items-start gap-4 flex-1">
          <div className="bg-neutral-800 text-yellow-400 font-bold rounded-full w-16 h-16 flex items-center justify-center text-2xl uppercase">
            {candidato.nombre.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
          <h2 className="font-bold text-2xl text-neutral-100 mb-1">{candidato.nombre}</h2>
          <div className="text-neutral-400 text-lg">{candidato.puesto}</div>
          <div className="text-neutral-400 text-sm"><b>Email:</b> {candidato.email}</div>
          {candidato.telefono && <div className="text-neutral-400 text-sm"><b>Teléfono:</b> {candidato.telefono}</div>}
          {candidato.linkedin && <div className="text-neutral-400 text-sm"><b>LinkedIn:</b> <a href={candidato.linkedin} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline">{candidato.linkedin}</a></div>}
          {candidato.enlace_cv && <div className="text-neutral-400 text-sm"><b>CV:</b> <a href={candidato.enlace_cv} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline">Ver CV</a></div>}
          {typeof candidato.anios_experiencia === 'number' && <div className="text-neutral-400 text-sm"><b>Años de experiencia:</b> {candidato.anios_experiencia}</div>}
          {candidato.fecha_aplicacion && <div className="text-neutral-400 text-sm"><b>Fecha de aplicación:</b> {candidato.fecha_aplicacion}</div>}
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <form className="space-y-4" onSubmit={handleEstadoEtapaChange}>
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Estado</label>
              <select className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" value={estado} onChange={e => setEstado(e.target.value as EstadoAPI)}>
                <option value="received" className="bg-[#1a1a1a] text-smoke-gray">Recibida</option>
                <option value="in_progress" className="bg-[#1a1a1a] text-smoke-gray">En proceso</option>
                <option value="selected" className="bg-[#1a1a1a] text-smoke-gray">Seleccionada</option>
                <option value="discarded" className="bg-[#1a1a1a] text-smoke-gray">Descartada</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Etapa</label>
              <select className="w-full bg-charcoal-deep border border-outline/30 text-smoke-gray rounded-lg px-4 py-2 focus:outline-none focus:border-gourmet-gold focus:ring-1 focus:ring-gourmet-gold transition-colors" value={etapa} onChange={e => setEtapa(e.target.value as EtapaAPI)}>
                <option value="pending" className="bg-[#1a1a1a] text-smoke-gray">Pendiente de revisión</option>
                <option value="review" className="bg-[#1a1a1a] text-smoke-gray">En revisión</option>
                <option value="personal_interview" className="bg-[#1a1a1a] text-smoke-gray">Entrevista personal</option>
                <option value="technical_interview" className="bg-[#1a1a1a] text-smoke-gray">Entrevista técnica</option>
                <option value="offer_presented" className="bg-[#1a1a1a] text-smoke-gray">Oferta presentada</option>
              </select>
            </div>
            <button type="submit" className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition-colors w-full" disabled={loading}>Guardar cambios</button>
            {success && <span className="text-green-400 ml-2">¡Guardado!</span>}
          </form>
        </div>
      </div>
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-8 shadow-sm">
        <h3 className="font-semibold text-neutral-100 mb-4 text-lg">Notas internas</h3>
        <form className="flex gap-2 mb-4" onSubmit={handleAddNota}>
          <input
            className="border border-neutral-700 bg-neutral-900 text-neutral-100 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Añadir nota interna"
            value={notaNueva}
            onChange={e => setNotaNueva(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition-colors" disabled={loading || !notaNueva.trim()}>Añadir</button>
        </form>
        <NoteList notas={notas} onDelete={handleDeleteNota} />

        {noteSuccessMessage && (
          <div className="mt-3 rounded border border-green-700/50 bg-green-900/20 p-3 text-sm text-green-300">
            {noteSuccessMessage}
          </div>
        )}

        {deleteDebug && (
          <div className="mt-4 rounded border border-yellow-700/60 bg-yellow-900/20 p-3 text-xs text-yellow-200">
            <div className="font-semibold mb-1">Debug delete (temporal)</div>
            <div>recordId: {deleteDebug.recordId}</div>
            <div>noteId: {deleteDebug.noteId || '(vacío)'}</div>
            <div>timestamp: {deleteDebug.at}</div>
          </div>
        )}
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
