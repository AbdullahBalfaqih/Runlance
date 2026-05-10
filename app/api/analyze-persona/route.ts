import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const fallbackPersona = {
    persona: "Strict HR Lead",
    reasoning: "System default for a high-stakes professional assessment.",
    avatarId: "human-resource",
    personality: "A very strict, direct, and rigorous HR interviewer. Focuses on high-pressure questions and thorough verification.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  };

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.length < 10) {
      console.warn("Gemini API Key missing or invalid, using fallback.");
      return NextResponse.json(fallbackPersona);
    }

    const genAI = new GoogleGenerativeAI(key);

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { resumeText } = body;
    if (!resumeText) {
      return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following resume text and categorize the user into a professional interviewer persona.
      The interviewer must be a STRICT HR professional (Strict, direct, and authoritative).

      Return ONLY a JSON object with the following structure:
      {
        "persona": "Strict HR Executive",
        "reasoning": "A short sentence explaining why this persona was chosen based on specific keywords in the resume.",
        "avatarId": "a42f41bf-b379-4544-bc19-58f35c489726",
        "personality": "A 2-sentence description of a STRICT, authoritative HR interviewer who focuses on pressure testing the candidate.",
        "backgroundPrompt": "A detailed prompt for a professional, high-end corporate executive office for a Runway Gen-3 image generation model. Dramatic lighting, sharp focus, 8k resolution, cinematic."
      }

      Resume Text:
      ${resumeText.substring(0, 3000)}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("Gemini Success: ", responseText);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in AI response");

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error("Persona Analysis Error:", error.message || error);
    return NextResponse.json(fallbackPersona);
  }
}
