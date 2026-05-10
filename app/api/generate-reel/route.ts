import RunwayML from "@runwayml/sdk";
import { NextResponse } from "next/server";

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { prompt, inputImage } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    console.log("Triggering Runway Video Generation (veo3.1):", prompt);

    // Using Image to Video pattern
    // If no input image is provided, we might want to generate one first or just use text to video
    // But for the hackathon, we'll try to use the provided inputImage (the office background)
    
    let task;
    if (inputImage) {
        task = await client.imageToVideo.create({
            promptText: prompt,
            promptImage: [
                {
                    uri: inputImage,
                    position: "first"
                }
            ],
            model: "veo3.1",
            ratio: "1280:720",
            duration: 5,
        });
    } else {
        // Fallback to text to video if no image provided
        // In the SDK, text to video might be textToVideo.create
        task = await (client as any).textToVideo.create({
            promptText: prompt,
            model: "gen3a_turbo", // Gen3a is fast for reels
            ratio: "1280:720",
        });
    }

    console.log("Runway Video Task Created:", task.id);

    // Polling for the video output
    let result;
    let attempts = 0;
    while (attempts < 60) { // Video takes longer
        const poll = await client.tasks.retrieve(task.id);
        if (poll.status === "SUCCEEDED") {
            result = poll;
            break;
        }
        if (poll.status === "FAILED") throw new Error("Video task failed: " + JSON.stringify(poll.error));
        
        console.log(`Polling video task ${task.id}... status: ${poll.status} (${poll.progress || 0}%)`);
        await new Promise(r => setTimeout(r, 3000));
        attempts++;
    }

    if (result && result.output && result.output.length > 0) {
      return NextResponse.json({ 
        videoUrl: result.output[0], 
        status: "success" 
      });
    }

    throw new Error("No video output from Runway");

  } catch (error: any) {
    console.error("Runway Video SDK Error:", error.message || error);
    return NextResponse.json({ error: "Failed to generate video reel" }, { status: 500 });
  }
}
