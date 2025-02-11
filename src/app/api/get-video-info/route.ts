import { NextResponse } from 'next/server';
import tunnel from 'tunnel';
import { YoutubeTranscript } from 'youtube-transcript';

import { withFetchInterceptor } from '@/app/utils/withFetchInterceptor';

const transcriptCache = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // Validate URL format
    const videoIdMatch = url.match(/(?:v=|\/|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?\/]|$)/);

    if (!videoIdMatch) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Use proxy for requests to avoid Youtube blocking
    const agent = tunnel.httpsOverHttp({
      proxy: {
        host: process.env.PROXY_HOST ?? '',
        port: Number(process.env.PROXY_PORT) ?? '',
        proxyAuth: `${process.env.PROXY_USER}:${process.env.PROXY_PASSWORD}`
      }
    });

    const videoId = videoIdMatch[1];

    // Check cache first before fetching transcript
    if (transcriptCache.has(videoId)) {
      return NextResponse.json({
        transcript: transcriptCache.get(videoId),
        cached: true
      });
    }

    const transcriptItems = await withFetchInterceptor(agent, async () => {
      return await YoutubeTranscript.fetchTranscript(url);
    });

    let language = 'en';

    const transcript = transcriptItems
      .map((item, index) => {
        if (index === 0 && item.lang) {
          language = item.lang;
        }
        return item.text;
      })
      .join(' ');

    // Cache result
    transcriptCache.set(videoId, transcript);

    return NextResponse.json({
      transcript,
      language,
      cached: false
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
