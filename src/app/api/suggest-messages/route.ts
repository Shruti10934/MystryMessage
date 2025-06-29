import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST() {
  try {
    const model = "gemini-1.5-flash";
    const prompt = "Create a list of three open-ended and engaging questions formatted in a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal and sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figures, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curosity, and contribute to a positive and welcoming conversational environment."


    // Get the generative model
    const geminiModel = genAI.getGenerativeModel({ model });

    // Generate content
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ 
      response: text,
      success: true 
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}