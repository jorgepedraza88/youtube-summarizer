'use client';

import { IoIosPaperPlane as SendIcon } from 'react-icons/io';

import { useSummary } from '../SummaryContext';
import { ErrorMessage } from './ErrorMessage';

export function Form() {
  const { youtubeURL, setYoutubeURL, error, handleSubmitURL } = useSummary();

  return (
    <form
      onSubmit={handleSubmitURL}
      className="relative mx-auto max-w-4xl px-4 pb-6 pt-12 lg:px-0 lg:pb-12"
    >
      <input
        value={youtubeURL}
        onChange={(e) => setYoutubeURL(e.target.value)}
        placeholder="Paste YouTube URL here..."
        className="w-full resize-none rounded-md border px-2 py-3 pr-10 text-sm text-neutral-900 shadow-sm focus:outline-teal-500"
      />
      <button
        type="submit"
        className="absolute right-2 top-2 mr-4 mt-12 rounded-md bg-teal-500 p-2 text-sm text-neutral-100 shadow-md hover:bg-teal-600 lg:mr-0"
      >
        <SendIcon size={16} />
      </button>
      <div className="mt-1 text-right text-xs text-neutral-500">
        <p>
          Sometimes, the summary may fail on the first attempt due to Vercel&apos;s limits. If that
          happens, please try again.
        </p>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </form>
  );
}
