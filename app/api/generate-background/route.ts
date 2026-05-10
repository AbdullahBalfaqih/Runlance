import RunwayML from "@runwayml/sdk";
import { NextResponse } from "next/server";

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    console.log("Triggering Runway Background Generation (SDK v3):", prompt);

    // Using the user's suggested SDK pattern for Image Generation
    const task = await client.textToImage.create({
      promptText: prompt,
      model: "gen4_image",
      ratio: "1280:720",
    });

    console.log("Runway Task Created:", task.id);

    // Using waitForTaskOutput if supported, otherwise manual poll as fallback
    let result;
    if ((task as any).waitForTaskOutput) {
      result = await (task as any).waitForTaskOutput();
    } else {
       // Fallback manual poll if the SDK version is slightly different
       let attempts = 0;
       while (attempts < 30) {
         const poll = await client.tasks.retrieve(task.id);
         if (poll.status === "SUCCEEDED") {
           result = poll;
           break;
         }
         if (poll.status === "FAILED") throw new Error("Task failed");
         await new Promise(r => setTimeout(r, 2000));
         attempts++;
       }
    }

    if (result && result.output && result.output.length > 0) {
      return NextResponse.json({ 
        imageUrl: result.output[0], 
        status: "success" 
      });
    }

    throw new Error("No output from Runway");

  } catch (error: any) {
    console.error("Runway SDK Error:", error.message || error);
    return NextResponse.json({ error: "Failed to generate background" }, { status: 500 });
  }
}
