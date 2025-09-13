import { NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

// Simple transcript cache
const transcriptCache = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // Validate URL format
    const videoIdMatch = url.match(/(?:v=|\/|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?\/]|$)/);

    if (!videoIdMatch) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const videoId = videoIdMatch[1];

    // Check cache first before fetching transcript
    if (transcriptCache.has(videoId)) {
      return NextResponse.json({ transcript: transcriptCache.get(videoId), cached: true });
    }

    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();

    if (!transcriptData) {
      return NextResponse.json(
        { error: 'Transcript not available for this video' },
        { status: 404 }
      );
    }

    const segments = transcriptData.transcript?.content?.body?.initial_segments || [];
    
    const transcript = segments
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((segment: any) => segment.snippet?.text || '')
      .filter((text: string) => text.trim())
      .join(' ');

    if (!transcript.trim()) {
      return NextResponse.json(
        { error: 'Could not extract transcript text' },
        { status: 404 }
      );
    }

    // Cache result
    transcriptCache.set(videoId, transcript);

    return NextResponse.json({ transcript, language: 'auto', cached: false });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
