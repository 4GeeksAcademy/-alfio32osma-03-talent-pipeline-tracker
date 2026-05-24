interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return <div className="p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded">{message}</div>;
}
