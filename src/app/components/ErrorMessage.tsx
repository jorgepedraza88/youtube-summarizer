interface ErrorMessageProps {
  children: React.ReactNode;
}

export function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <div className="rounded-md border border-red-400 bg-red-100 p-2 text-red-700">{children}</div>
  );
}
