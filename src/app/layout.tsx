import { FaGithub as GithubLogo } from 'react-icons/fa';
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
      <body className={`${geistSans.variable} ${geistMono.variable} bg-neutral-900 antialiased`}>
        <main className="relative h-screen w-full">{children}</main>
        <footer className="absolute right-2 top-2 flex items-center justify-center gap-2 p-1 text-center text-xs text-neutral-100 transition-colors hover:text-teal-500 lg:p-2">
          <a
            href="https://github.com/jorgepedraza88/youtube-summarizer"
            target="_blank"
            className="underline"
          >
            <GithubLogo size={24} />
          </a>
        </footer>
      </body>
    </html>
  );
}
