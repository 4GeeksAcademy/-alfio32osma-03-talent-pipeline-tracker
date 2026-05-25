interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return <div className="p-4 text-center text-yellow-400 bg-neutral-900 border border-yellow-700 rounded font-semibold">{message}</div>;
}
