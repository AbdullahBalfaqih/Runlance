import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, companyName, jobDescription, jobUrl } = body;

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    console.log(`Analyzing job: ${jobTitle} at ${companyName}`);

    // Mock analysis logic
    const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65; // Random score between 65 and 95
    
    const analysis = {
      id: `analysis_${Date.now()}`,
      compatibilityScore: score,
      analysisDetails: {
        summary: `Based on your resume, you are a ${score >= 85 ? 'perfect' : score >= 75 ? 'strong' : 'good'} match for the ${jobTitle} role at ${companyName}. Your expertise in React and frontend architecture aligns well with their requirements.`
      },
      matchingSkills: [
        'React', 'TypeScript', 'Frontend Architecture', 'State Management'
      ],
      skillGaps: {
        'AWS': 'The job mentions cloud infrastructure which is missing from your recent projects.',
        'GraphQL': 'They use GraphQL for their data layer.'
      },
      jobInfo: {
        title: jobTitle,
        company: companyName,
        url: jobUrl
      }
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze-job API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze job' },
      { status: 500 }
    );
  }
}
