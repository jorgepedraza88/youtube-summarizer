'use client';

import { createContext, useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';

import { ErrorToast } from './components/ErrorToast';

interface SummaryContextType {
  summary: string;
  youtubeURL: string;
  isLoadingTranscript: boolean;
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
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitURL = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!youtubeURL || isLoadingSummary || isLoadingTranscript) {
      return;
    }

    setIsLoadingTranscript(true);
    setError('');
    setSummary('');

    try {
      const {
        data: { transcript, language }
      } = await axios.post('/api/get-video-info', { url: youtubeURL });

      setIsLoadingTranscript(false);

      setIsLoadingSummary(true);
      const {
        data: { summary: summaryData }
      } = await axios.post('/api/summarize', {
        transcript: transcript,
        language
      });

      setSummary(summaryData);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      } else {
        setError('An error occurred');
      }
    } finally {
      setTimeout(() => {
        setIsLoadingSummary(false);
      }, 200);
    }
  };

  const contextValue = {
    summary,
    youtubeURL,
    isLoadingTranscript,
    isLoadingSummary,
    error,
    setSummary,
    setYoutubeURL,
    setIsLoadingSummary,
    setError,
    handleSubmitURL
  };

  return (
    <SummaryContext.Provider value={contextValue}>
      {children}
      <ErrorToast message={error} onClose={() => setError('')} />
    </SummaryContext.Provider>
  );
}

export const useSummary = () => {
  const context = useContext(SummaryContext);

  if (!context) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }

  return context;
};
