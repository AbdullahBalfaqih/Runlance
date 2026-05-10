import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { transcript, resumeContext } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format chat history for Gemini
    const history = transcript.map((msg: any) => ({
      role: msg.role === 'interviewer' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const systemInstruction = `
      You are a professional HR Interviewer conducting a highly personalized job interview.
      
      ${resumeContext ? `USER RESUME CONTEXT:
      ---
      ${resumeContext}
      ---
      Use this resume to ask specific, targeted questions about the user's actual experience, skills, and projects mentioned above. 
      Tailor your tone to the industry reflected in the resume.` : ''}

      RULES:
      1. Ask relevant, professional questions one by one.
      2. React naturally to their answers. 
      3. NEVER ask multiple questions at once.
      4. Keep responses concise (1-3 sentences max).
      5. If the user is vague, push for specific examples (STAR method).
      6. Maintain a professional yet encouraging persona.
    `;

    const chat = model.startChat({
      history: history.slice(0, -1),
      systemInstruction: {
        parts: [{ text: systemInstruction }],
        role: "system"
      }
    });

    const lastMessage = history.length > 0 ? history[history.length - 1].parts[0].text : "Hello";
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}
