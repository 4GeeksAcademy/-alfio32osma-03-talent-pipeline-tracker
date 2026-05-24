import { Nota } from '../types/note';

interface Props {
  notas: Nota[];
  onDelete?: (id: string) => void;
}

export default function NoteList({ notas, onDelete }: Props) {
  if (!notas.length) return <div className="text-gray-500">Sin notas.</div>;
  return (
    <ul className="space-y-2">
      {notas.map((nota) => (
        <li key={nota.id} className="bg-gray-50 p-2 rounded border flex justify-between items-center">
          <div>
            <div className="text-sm">{nota.contenido}</div>
            <div className="text-xs text-gray-400">{nota.fecha}</div>
          </div>
          {onDelete && (
            <button onClick={() => onDelete(nota.id)} className="text-red-600 text-xs ml-2">Eliminar</button>
          )}
        </li>
      ))}
    </ul>
  );
}
