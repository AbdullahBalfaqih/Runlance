import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const fallbackPersona = {
    persona: "Engineering Lead",
    reasoning: "Defaulted to Engineering Lead due to an internal processing error.",
    avatarId: "a42f41bf-b379-4544-bc19-58f35c489726",
    personality: "Professional and direct. Focuses on technical execution and results."
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
      Analyze the following resume text and categorize the user into one of three interviewer personas:
      1. Engineering Lead: For software, data, or technical roles.
      2. Creative Director: For design, UI/UX, art, or marketing roles.
      3. Strategic Partner: For business, management, sales, or other corporate roles.

      Return ONLY a JSON object with the following structure:
      {
        "persona": "Engineering Lead" | "Creative Director" | "Strategic Partner",
        "reasoning": "A short sentence explaining why this persona was chosen based on specific keywords in the resume.",
        "avatarId": "a42f41bf-b379-4544-bc19-58f35c489726",
        "personality": "A 2-sentence description of how this AI persona should behave during an interview.",
        "backgroundPrompt": "A detailed prompt for a futuristic, cinematic, high-end 3D background environment for a Runway Gen-3 image generation model. Include lighting and mood details."
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
