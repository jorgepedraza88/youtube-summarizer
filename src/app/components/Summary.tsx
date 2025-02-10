import ReactMarkdown from 'react-markdown';

interface SummaryProps {
  children: React.ReactNode;
}

export function Summary({ children }: SummaryProps) {
  return (
    <div className="rounded-md bg-neutral-800 p-6 shadow-md mb-8">
      <div className="text-neutral-100">
        <ReactMarkdown className={'markdown'}>{children as string}</ReactMarkdown>
      </div>
    </div>
  );
}
