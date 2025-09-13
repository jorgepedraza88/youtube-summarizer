'use client';

import { IoIosPaperPlane as SendIcon } from 'react-icons/io';
import { IoLanguage as LanguageIcon } from 'react-icons/io5';

import { LOADING_STATES, useSummary } from '../SummaryContext';
import { cn } from '../utils/tailwind';

export function Form() {
  const {
    youtubeURL,
    errorMessage,
    loadingState,
    selectedLanguage,
    setYoutubeURL,
    setSelectedLanguage,
    handleSubmitURL,
    setErrorMessage
  } = useSummary();

  const isLoading = loadingState === LOADING_STATES.LOADING;

  return (
    <form
      onSubmit={handleSubmitURL}
      className="relative mx-auto max-w-4xl px-4 pb-6 pt-12 lg:px-0 lg:pb-12"
    >
      <div
        className={cn('relative rounded-md border shadow-sm', {
          'border-red-500': errorMessage,
          'border-gray-300 bg-gray-50': isLoading
        })}
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
            'w-full resize-none rounded-t-md border-none px-3 py-4 pr-12 text-sm focus:-outline-offset-2 focus:outline-teal-500',
            {
              'cursor-not-allowed text-gray-500 bg-gray-50': isLoading,
              'text-neutral-900 bg-white': !isLoading
            }
          )}
        />
        <div className={cn(
          'rounded-b-md border-t px-3 py-2',
          {
            'border-gray-200 bg-gray-50': !isLoading,
            'border-gray-300 bg-gray-100': isLoading
          }
        )}>
          <div className="flex items-center gap-2">
            <LanguageIcon 
              size={14} 
              className={cn({
                'text-neutral-500': !isLoading,
                'text-gray-400': isLoading
              })} 
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={isLoading}
              className={cn(
                'border-none bg-transparent text-xs focus:outline-none',
                {
                  'cursor-not-allowed text-gray-400': isLoading,
                  'text-neutral-700': !isLoading
                }
              )}
            >
              <option value="english">English</option>
              <option value="spanish">Español</option>
              <option value="french">Français</option>
              <option value="portuguese">Português</option>
              <option value="italian">Italiano</option>
              <option value="german">Deutsch</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'absolute right-2 top-3 rounded-md bg-teal-500 p-2 text-sm text-neutral-100 shadow-md hover:bg-teal-600',
            { 'cursor-not-allowed opacity-50 hover:bg-teal-500': isLoading }
          )}
        >
          <SendIcon size={16} />
        </button>
      </div>
      <div className="mt-1 text-right text-xs text-neutral-500">
        <p>
          Sometimes, the summary may fail on the first attempt due to Vercel&apos;s & Gemini limits.
          If that happens, please try again.
        </p>
      </div>
    </form>
  );
}
