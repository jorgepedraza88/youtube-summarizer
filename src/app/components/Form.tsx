'use client';

import { IoIosPaperPlane as SendIcon } from 'react-icons/io';

import { useSummary, LOADING_STATES } from '../SummaryContext';
import { cn } from '../utils/tailwind';

export function Form() {
  const { youtubeURL, errorMessage, loadingState, setYoutubeURL, handleSubmitURL, setErrorMessage } =
    useSummary();

  const isLoading = loadingState === LOADING_STATES.LOADING;

  return (
    <form
      onSubmit={handleSubmitURL}
      className="relative mx-auto max-w-4xl px-4 pb-6 pt-12 lg:px-0 lg:pb-12"
    >
      <input
        value={youtubeURL}
        onChange={(e) => {
          setErrorMessage('');
          setYoutubeURL(e.target.value);
        }}
        placeholder="Paste YouTube URL here..."
        disabled={isLoading}
        className={cn(
          'w-full resize-none rounded-md border px-2 py-3 pr-12 text-sm text-neutral-900 shadow-sm focus:outline-teal-500',
          {
            'border-red-500': errorMessage,
            'opacity-50 cursor-not-allowed': isLoading
          }
        )}
      />
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "absolute right-2 top-2 mr-4 mt-12 rounded-md bg-teal-500 p-2 text-sm text-neutral-100 shadow-md hover:bg-teal-600 lg:mr-0",
          {
            'opacity-50 cursor-not-allowed hover:bg-teal-500': isLoading
          }
        )}
      >
        <SendIcon size={16} />
      </button>
      <div className="mt-1 text-right text-xs text-neutral-500">
        <p>
          Sometimes, the summary may fail on the first attempt due to Vercel&apos;s & Gemini limits.
          If that happens, please try again.
        </p>
      </div>
    </form>
  );
}
