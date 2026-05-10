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

    console.log("Triggering Runway Background Generation:", prompt);

    // Triggering Image Generation
    const imageTask = await client.imageGenerations.create({
      model: "gen4_image", // Using high quality Gen-4 image model
      prompt: prompt,
      width: 1280,
      height: 720
    });

    const taskId = imageTask.id;
    console.log("Runway Task ID:", taskId);

    // Polling logic (keeping it simple for hackathon)
    let taskStatus;
    let attempts = 0;
    while (attempts < 20) {
      taskStatus = await client.tasks.retrieve(taskId);
      if (taskStatus.status === "SUCCEEDED") {
        return NextResponse.json({ 
          imageUrl: taskStatus.output?.[0], 
          status: "success" 
        });
      }
      if (taskStatus.status === "FAILED") {
        throw new Error("Runway task failed");
      }
      
      console.log(`Polling task ${taskId}... status: ${taskStatus.status}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    return NextResponse.json({ error: "Generation timed out" }, { status: 408 });

  } catch (error: any) {
    console.error("Runway Generation Error:", error.message || error);
    return NextResponse.json({ error: "Failed to generate background" }, { status: 500 });
  }
}
