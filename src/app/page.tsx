'use client';

import { useState } from 'react';
import axios from 'axios';

import { Button } from './components/Button';
import { ErrorMessage } from './components/ErrorMessage';
import { Loader } from './components/Loader';
import { Summary } from './components/Summary';

function Home() {
  const [youtubeURL, setYoutubeURL] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSummary(true);
    setError('');
    setSummary('');

    try {
      const {
        data: { transcript, language, error: transcriptError },
        status
      } = await axios.post('/api/get-video-info', { url: youtubeURL });

      if (status !== 200) {
        throw new Error(transcriptError || 'Failed to generate summary');
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

  if (isLoadingSummary) {
    return <Loader />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4" key="form">
        <div className="flex flex-col items-center gap-4">
          <input
            value={youtubeURL}
            onChange={(e) => setYoutubeURL(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="w-full rounded-md border p-2 text-sm text-neutral-900 shadow-sm focus:outline-teal-500"
          />
          <Button isDisabled={isLoadingSummary}>Summarize</Button>
        </div>
      </form>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {summary && <Summary>{summary}</Summary>}
    </>
  );
}

export default Home;
