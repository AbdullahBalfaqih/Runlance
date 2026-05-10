import { NextResponse } from 'next/server';
import RunwayML from '@runwayml/sdk';

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { prompt, personaName } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Enhance the prompt for professional persona generation
    const enhancedPrompt = `Professional studio headshot of a ${personaName}, ${prompt}, corporate attire, minimalist background, highly detailed skin texture, professional lighting, 8k resolution, cinematic, shot on 85mm lens`;

    console.log('Generating persona avatar with prompt:', enhancedPrompt);

    const task = await client.textToImage.create({
      model: 'gen4_image',
      promptText: enhancedPrompt,
      ratio: '1:1',
    });

    const taskResult = await client.tasks.waitForTaskOutput(task.id);

    if (taskResult.status === 'SUCCEEDED' && taskResult.image && taskResult.image.length > 0) {
      return NextResponse.json({ imageUrl: taskResult.image[0] });
    } else {
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Runway Avatar Generation Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate avatar', 
      details: error.message 
    }, { status: 500 });
  }
}
