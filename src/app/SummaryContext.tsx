'use client';

import { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface SummaryContextType {
  summary: string;
  youtubeURL: string;
  isLoadingSummary: boolean;
  error: string;
  setYoutubeURL: React.Dispatch<React.SetStateAction<string>>;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  setIsLoadingSummary: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitURL: (e: React.FormEvent) => Promise<void>;
}

export const SummaryContext = createContext<SummaryContextType | null>(null);

export function SummaryProvider({ children }: { children: React.ReactNode }) {
  const [summary, setSummary] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitURL = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!youtubeURL || isLoadingSummary) {
      return;
    }

    setIsLoadingSummary(true);
    setError('');
    setSummary('');

    try {
      const {
        data: { transcript, language, error: transcriptError },
        status
      } = await axios.post('/api/get-video-info', { url: youtubeURL });

      if (status !== 200) {
        throw new Error(transcriptError.message || 'Failed to generate summary');
      }

      const {
        data: { summary: summaryData },
        status: summaryStatus
      } = await axios.post('/api/summarize', {
        transcript: transcript,
        language
      });

      if (summaryStatus !== 200) {
        throw new Error('Failed to generate summary');
      }

      setSummary(summaryData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const contextValue = {
    summary,
    youtubeURL,
    isLoadingSummary,
    error,
    setSummary,
    setYoutubeURL,
    setIsLoadingSummary,
    setError,
    handleSubmitURL
  };

  return <SummaryContext.Provider value={contextValue}>{children}</SummaryContext.Provider>;
}

export const useSummary = () => {
  const context = useContext(SummaryContext);

  if (!context) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }

  return context;
};
