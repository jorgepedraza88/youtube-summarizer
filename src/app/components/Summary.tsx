'use client';

import ReactMarkdown from 'react-markdown';

import { useSummary } from '../SummaryContext';

export function Summary() {
  const { summary, isLoadingSummary } = useSummary();

  if (!isLoadingSummary) {
    return (
      <div className="mx-auto mt-8 max-w-4xl px-2">
        <div className="animate-pulse text-center text-neutral-100 lg:ml-4 lg:text-left">
          &quot;Generating your summary... Hang tight!&quot; 🚀
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="mx-auto mb-36 mt-8 max-w-4xl rounded-md border border-teal-900 px-2 shadow-lg shadow-teal-600">
      <div className="text-neutral-100">
        <ReactMarkdown className="markdown p-2">{summary}</ReactMarkdown>
      </div>
    </div>
  );
}
