'use client';

import { createContext, useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';

import { ErrorToast } from './components/ErrorToast';

export const LOADING_STATES = {
  INITIAL: 'initial',
  LOADING: 'loading',
  SUCCESS: 'success'
} as const;

type LoadingState = (typeof LOADING_STATES)[keyof typeof LOADING_STATES];

interface SummaryContextType {
  summary: string;
  youtubeURL: string;
  loadingState: LoadingState;
  errorMessage: string;
  setYoutubeURL: React.Dispatch<React.SetStateAction<string>>;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  setLoadingState: React.Dispatch<React.SetStateAction<LoadingState>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitURL: (e: React.FormEvent) => Promise<void>;
}

export const SummaryContext = createContext<SummaryContextType | null>(null);

export function SummaryProvider({ children }: { children: React.ReactNode }) {
  const [summary, setSummary] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LOADING_STATES.INITIAL);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmitURL = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!youtubeURL || loadingState === LOADING_STATES.LOADING) {
      return;
    }

    setLoadingState(LOADING_STATES.LOADING);
    setErrorMessage('');
    setSummary('');

    try {
      const {
        data: { transcript, language }
      } = await axios.post('/api/get-video-info', { url: youtubeURL });

      const {
        data: { summary: summaryData }
      } = await axios.post('/api/summarize', {
        transcript: transcript,
        language
      });

      setSummary(summaryData);
      setLoadingState(LOADING_STATES.SUCCESS);
      setYoutubeURL(''); // Clear input on success
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.error);
      } else {
        setErrorMessage('An error occurred');
      }

      setLoadingState(LOADING_STATES.INITIAL);
    }
  };

  const contextValue = {
    summary,
    youtubeURL,
    loadingState,
    errorMessage,
    setSummary,
    setYoutubeURL,
    setLoadingState,
    setErrorMessage,
    handleSubmitURL
  };

  return (
    <SummaryContext.Provider value={contextValue}>
      {children}
      <ErrorToast message={errorMessage} onClose={() => setErrorMessage('')} />
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
