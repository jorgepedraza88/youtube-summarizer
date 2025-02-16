'use client';

import ReactMarkdown from 'react-markdown';

import { LOADING_STATES, useSummary } from '../SummaryContext';
import { cn } from '../utils/tailwind';

export function Summary() {
  const { summary, loadingState } = useSummary();

  return (
    <div
      className={cn(
        'mx-auto mb-36 mt-8 max-w-4xl rounded-md px-2 opacity-0 transition-opacity duration-300',
        {
          'border border-teal-900 shadow-lg shadow-teal-600':
            loadingState === LOADING_STATES.SUCCESS,
          'opacity-100': loadingState !== LOADING_STATES.INITIAL
        }
      )}
    >
      <div className="text-neutral-100">
        {loadingState === LOADING_STATES.LOADING && (
          <div className="animate-pulse text-center text-neutral-100 lg:ml-4 lg:text-left">
            &quot;Generating your summary... Hang tight!&quot; 🚀
          </div>
        )}

        {loadingState === LOADING_STATES.SUCCESS && (
          <ReactMarkdown className="markdown p-2">{summary}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}
