import RunwayML from "@runwayml/sdk";
import { NextResponse } from "next/server";

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { prompt, inputImage } = await req.json();

    console.log("Generate Reel - Received request:", { prompt, hasImage: !!inputImage });

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    let task;
    try {
        if (inputImage) {
            console.log("Using Image-to-Video (gen4_turbo) with image:", inputImage.substring(0, 50) + "...");
            task = await client.imageToVideo.create({
                model: "gen4_turbo",
                promptText: prompt,
                promptImage: inputImage,
                ratio: "1280:720", // Reverting to explicit pixel ratio as requested by validation
                duration: 6,      // Must be 4, 6, or 8 based on validation feedback
            });
        } else {
            console.log("No input image, using Text-to-Video fallback (veo3.1)");
            task = await client.textToVideo.create({
                model: "veo3.1",
                promptText: prompt,
                ratio: "1280:720",
                duration: 6,
            });
        }
    } catch (createError: any) {
        console.error("Error creating Runway task:", createError);
        return NextResponse.json({ 
            error: "Validation failed during task creation", 
            details: createError.message || createError 
        }, { status: 400 });
    }

    if (!task) throw new Error("Failed to initialize task");

    console.log("Runway Video Task Created:", task.id);

    let result;
    try {
        if ((task as any).waitForTaskOutput) {
            result = await (task as any).waitForTaskOutput();
        } else {
            let attempts = 0;
            while (attempts < 60) {
                const poll = await client.tasks.retrieve(task.id);
                if (poll.status === "SUCCEEDED") {
                    result = poll;
                    break;
                }
                if (poll.status === "FAILED") throw new Error("Video task failed: " + JSON.stringify(poll.error));
                await new Promise(r => setTimeout(r, 3000));
                attempts++;
            }
        }
    } catch (pollError: any) {
        console.error("Error waiting for task:", pollError);
        throw pollError;
    }

    if (result && result.output && result.output.length > 0) {
      return NextResponse.json({ 
        videoUrl: result.output[0], 
        status: "success" 
      });
    }

    throw new Error("No video output from Runway");

  } catch (error: any) {
    console.error("Runway Video API Exception:", error);
    return NextResponse.json({ 
        error: "Internal Server Error during reel generation", 
        details: error.message || error 
    }, { status: 500 });
  }
}
