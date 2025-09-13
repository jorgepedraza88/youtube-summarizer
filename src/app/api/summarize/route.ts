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
      temperature: 0.3,
      responseMimeType: 'text/plain',
      maxOutputTokens: 4000
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: 'You are a multilingual assistant that summarizes YouTube video transcripts. CRITICAL REQUIREMENT: You MUST respond in the same language as the input transcript. If the transcript is in Spanish, respond in Spanish. If in English, respond in English. Language matching is mandatory and non-negotiable. Analyze the transcript content, determine its category, and provide a well-structured summary following the specified formatting rules.',
      generationConfig
    });

    const prompt = `
    🚨 **MANDATORY LANGUAGE REQUIREMENT** 🚨
    You MUST respond in the SAME LANGUAGE as the transcript below.
    - If transcript is in Spanish → Response in Spanish
    - If transcript is in English → Response in English  
    - If transcript is in French → Response in French
    - Language parameter provided: ${language || 'AUTO-DETECT'}
    
    **ABSOLUTE REQUIREMENT**: Match the transcript language exactly. This is non-negotiable.

    Now analyze the transcript and determine:

    **Category** (Choose the most appropriate one):
       - **Recipe**: Step-by-step cooking instructions
       - **Lesson or Tutorial**: Teaching content, how-to guides, step-by-step explanations
       - **General Content**: Podcasts, discussions, opinion pieces, informal talks

    ### **Formatting Rules by Category:**

    #### **Lesson or Tutorial (including Tech Guides)**
    - Use **numbered steps** to outline the process clearly
    - Highlight **important commands, settings, or key concepts** in bold
    - Format code snippets as **separate blocks** if present
    - Provide **logical step-by-step explanations**
    
    #### **Recipe**
    - Use **numbered steps** for instructions
    - Highlight **ingredients** in bold with **quantities**
    
    #### **General Content**
    - Use **bullet points** for key insights
    - Expand on main topics (minimum 80 words per section)
    - Avoid unnecessary examples

    ### **CRITICAL OUTPUT RULES:**
    - **LANGUAGE MATCH IS MANDATORY** - Respond in transcript's language
    - **NO introductions, conclusions, or meta-explanations**
    - **NO "Analysis" or "Summary" headers**
    - **Start directly with the content**
    - **NO phrases like "Here's the analysis" or "Summary of the transcript"**
    
    **REMINDER**: Your response language MUST match the transcript language below.
    
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
