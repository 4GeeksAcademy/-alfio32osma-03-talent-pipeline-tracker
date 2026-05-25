import { Nota } from '../types/note';

interface Props {
  notas: Nota[];
  onDelete?: (id: string) => void;
}

export default function NoteList({ notas, onDelete }: Props) {
  if (!notas.length) return <div className="text-neutral-500">Sin notas.</div>;
  return (
    <ul className="space-y-2">
      {notas.map((nota) => (
        <li key={nota.id} className="bg-neutral-900 border border-neutral-800 p-3 rounded flex justify-between items-center">
          <div>
            <div className="text-sm text-neutral-100">{nota.contenido}</div>
            <div className="text-xs text-neutral-500">{nota.fecha}</div>
          </div>
          {onDelete && (
            <button onClick={() => onDelete(nota.id)} className="text-yellow-400 text-xs ml-2 hover:underline">Eliminar</button>
          )}
        </li>
      ))}
    </ul>
  );
}
