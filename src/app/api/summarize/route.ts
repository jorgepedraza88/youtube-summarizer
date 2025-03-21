import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const geminiCache = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const { transcript, language } = await request.json();
    const cacheKey = `${language}-${transcript}`;

    // Check cache first before fetching gemini summary
    if (geminiCache.has(cacheKey)) {
      return NextResponse.json({
        summary: geminiCache.get(cacheKey),
        cached: true
      });
    }

    const geminiAPIKey = process.env.GEMINI_API_KEY;

    if (!geminiAPIKey) {
      throw new Error('Missing GEMINI_API_KEY');
    }

    const genAI = new GoogleGenerativeAI(geminiAPIKey);

    const generationConfig = {
      temperature: 0.7,
      responseMimeType: 'text/plain',
      maxOutputTokens: 2000
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-8b',
      systemInstruction: 'You are an assistant helping a user summarize a Youtube video transcript. The user has asked you to analyze the following transcript and determine the language and category of the content. The user has also provided some formatting rules to follow. Please provide a summary based on the content structure using a casual tone.',
      generationConfig
    });

    const prompt = `
    Analyze the following transcript and determine:
    1. **Language**: Use: ${language} if provided , or Detect the language of the transcript and ensure the summary is written in the same language\n
    2. **Category** (Choose the most appropriate one based on content structure):\n
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
    - Expand on main topics while avoiding unnecessary examples. Use minimum 80 words per section.
    
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
    geminiCache.set(cacheKey, finalSummary);

    return NextResponse.json({
      summary: finalSummary,
      cached: false
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'An error ocurred proccessing the summary with Gemini, please try again later' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
