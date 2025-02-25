'use client';

import { LOADING_STATES, useSummary } from '../SummaryContext';
import { cn } from '../utils/tailwind';

export function Title() {
  const { loadingState } = useSummary();

  return (
    <div
      className={cn(
        'mx-auto h-auto max-w-4xl text-center transition-all duration-500 sm:px-6 lg:px-8',
        {
          'flex translate-y-64 flex-col justify-end lg:translate-y-80':
            loadingState === LOADING_STATES.INITIAL
        }
      )}
    >
      <h1 className="text-center text-4xl font-bold text-neutral-100 sm:text-5xl lg:text-7xl">
        Summarize<span className="text-teal-500">Tube</span>
      </h1>
      <h2 className="text-center text-xl font-semibold text-neutral-100">
        AI-Powered YouTube Summaries
      </h2>
    </div>
  );
}
