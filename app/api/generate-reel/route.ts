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
            console.log("Using Image-to-Video with image:", inputImage.substring(0, 50) + "...");
            // Based on error logs, ratio must be "16:9" and promptImage might expect a string or specific array
            task = await client.imageToVideo.create({
                model: "veo3.1",
                promptText: prompt,
                promptImage: inputImage, // Try as string directly as per common SDK patterns
                ratio: "16:9",
                duration: 5,
            });
        } else {
            console.log("No input image, using Text-to-Video fallback");
            // Use the correct Text-to-Video endpoint if no image is present
            task = await (client as any).textToVideo.create({
                model: "gen3a_turbo",
                promptText: prompt,
                ratio: "16:9",
            });
        }
    } catch (createError: any) {
        console.error("Error creating Runway task:", createError);
        // If it still fails with promptImage as string, try the array structure but with 16:9
        if (inputImage && createError.message?.includes("promptImage")) {
             console.log("Retrying with array structure for promptImage...");
             task = await client.imageToVideo.create({
                model: "veo3.1",
                promptText: prompt,
                promptImage: [
                    {
                        uri: inputImage,
                        position: "first"
                    }
                ],
                ratio: "16:9",
                duration: 5,
            } as any);
        } else {
            return NextResponse.json({ 
                error: "Validation failed during task creation", 
                details: createError.message || createError 
            }, { status: 400 });
        }
    }

    if (!task) throw new Error("Failed to initialize task");

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
