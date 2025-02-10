import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'SummarizeTube',
  description: 'AI-Powered YouTube Summaries, Instantly.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative overflow-x-hidden antialiased`}
      >
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-900 p-4">
          <div className="mx-auto w-full sm:max-w-4xl">
            <div className="mx-auto w-full">
              <h1 className="text-center text-4xl font-bold text-neutral-100 sm:text-5xl lg:text-7xl">
                Summarize<span className="text-teal-500">Tube</span>
              </h1>
              <h2 className="mb-8 text-center text-xl font-semibold text-neutral-100">
                AI-Powered YouTube Summaries
              </h2>
            </div>
            {children}
          </div>
        </main>
        <footer className="fixed bottom-0 flex w-full items-center justify-center gap-2 bg-neutral-800 p-2 text-center text-xs">
          2025 -
          <a href="https://www.jorgepedraza.com" target="_blank" className="hover:underline">
            by Jorge Pedraza
          </a>
          -
          <a
            href="https://github.com/jorgepedraza88/youtube-summarizer"
            target="_blank"
            className="underline"
          >
            Github
          </a>
        </footer>
      </body>
    </html>
  );
}
