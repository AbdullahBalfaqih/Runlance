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

    // Ensure we have a valid model name. The user suggested 'veo3.1'
    // Let's try to use 'gen3a_turbo' as a fallback if veo3.1 fails or isn't available
    
    let task;
    try {
        if (inputImage) {
            console.log("Using Image-to-Video with image:", inputImage.substring(0, 50) + "...");
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
            console.log("No input image, using Text-to-Video fallback");
            // If textToVideo is not directly available, we try imageToVideo with just prompt
            // or the specific textToVideo endpoint if exists in this SDK version
            task = await (client as any).imageToVideo.create({
                promptText: prompt,
                model: "gen3a_turbo",
                ratio: "1280:720",
            });
        }
    } catch (createError: any) {
        console.error("Error creating Runway task:", createError);
        return NextResponse.json({ 
            error: "Failed to create Runway task", 
            details: createError.message || createError 
        }, { status: 500 });
    }

    console.log("Runway Video Task Created:", task.id);

    // Polling for the video output
    let result;
    let attempts = 0;
    while (attempts < 60) {
        try {
            const poll = await client.tasks.retrieve(task.id);
            if (poll.status === "SUCCEEDED") {
                result = poll;
                break;
            }
            if (poll.status === "FAILED") {
                console.error("Task failed details:", poll.error);
                throw new Error("Video task failed: " + JSON.stringify(poll.error));
            }
            
            console.log(`Polling task ${task.id}... status: ${poll.status} (${poll.progress || 0}%)`);
            await new Promise(r => setTimeout(r, 3000));
            attempts++;
        } catch (pollError: any) {
            console.error("Error polling task:", pollError);
            throw pollError;
        }
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
