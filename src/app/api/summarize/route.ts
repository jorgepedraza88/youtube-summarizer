import { GoogleGenerativeAI } from '@google/generative-ai';
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
        summary: transcriptCache.get(videoId),
        cached: true
      });
    }

    const transcriptItems = await withFetchInterceptor(agent, async () => {
      return await YoutubeTranscript.fetchTranscript(url);
    });

    const transcript = transcriptItems.map((item) => item.text).join(' ');

    const geminiAPIKey = process.env.GEMINI_API_KEY;

    if (!geminiAPIKey) {
      throw new Error('Missing GEMINI_API_KEY');
    }

    const genAI = new GoogleGenerativeAI(geminiAPIKey);

    const generationConfig = {
      temperature: 0.7,
      responseMimeType: 'text/plain',
      maxOutputTokens: 1500
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: 'casual tone, natural output in a well formatted text',
      generationConfig
    });

    const prompt = `
    Analyze the following transcript and determine:
    1. **Language**: Detect the language of the transcript and ensure the summary is written in the same language.
    2. **Category** (Choose the most appropriate one based on content structure):
       - **Recipe**: If it contains step-by-step cooking instructions.
       - **Lesson or Tutorial**: If it explains a concept, teaches something, or provides a **step-by-step guide** (e.g., "How to run DeepSeek locally").
       - **General Content**: If it's a podcast, discussion, opinion piece, or informal talk.
    
    ### Formatting Rules:
    #### **Lesson or Tutorial (including Tech Guides)**
    - Use **ordered steps** to outline the process clearly.
    - Highlight **important commands, settings, or key concepts** in bold.
    - If code snippets are present, format them as **separate blocks**.
    - Provide **logical step-by-step explanations**.
    
    #### **Recipe**
    - Use **numbered steps** for instructions.
    - Highlight **ingredients** in bold and specify **quantities**.
    
    #### **General Content**
    - Use **bullet points** to summarize key insights.
    - Expand on main topics while avoiding unnecessary examples.
    
    ### **Strict Output Rules**:
    - **Do NOT include introductions, conclusions, or extra explanations.**
    - **Do NOT include "Análisis del Transcript" or "Transcript Analisys".**:
    - **Start directly with the summary.**
    - **Do NOT use phrases like "Here's the analysis" or "Summary of the transcript".**
    - The output **must match the transcript's language** (e.g., Spanish transcript → Spanish summary).
    
    Transcript:
    \n\n${transcript}
    `;

    const finalResponse = await model.generateContent(prompt);

    const finalData = finalResponse.response;
    const finalSummary = finalData.text();

    // Cache result
    transcriptCache.set(videoId, finalSummary);

    return NextResponse.json({
      summary: finalSummary,
      cached: false
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
