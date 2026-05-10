import { NextRequest, NextResponse } from 'next/server';
import { parseResume } from '@/lib/resume-parser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    console.log('Received file:', file?.name, 'Size:', file?.size, 'Type:', file?.type);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Real parsing using pdf-parse and mammoth via lib/resume-parser
    console.log('Starting resume parsing...');
    const parsedData = await parseResume(file);
    console.log('Parsing successful. Text length:', parsedData.rawText.length);

    // Dynamic analysis based on parsed data
    const analysis = {
      rawText: parsedData.rawText,
      strengths: [
        parsedData.skills.length > 5 ? 'Diverse skill set including ' + parsedData.skills.slice(0, 3).join(', ') : 'Solid foundation in ' + parsedData.skills.join(', '),
        parsedData.experience.length > 0 ? `Experience at ${parsedData.experience[0].company} as ${parsedData.experience[0].title}` : 'Experience in professional settings',
        'Academic background from ' + (parsedData.education[0]?.school || 'reputable institution'),
        'Comprehensive profile with ' + parsedData.rawText.length + ' characters of detail'
      ],
      weaknesses: [
        parsedData.skills.length < 10 ? 'Consider expanding core technical skills' : 'Review depth of specialized skills',
        'Linguistic check: Look for more action-oriented verbs in experience descriptions',
        'Quantification: Add more measurable metrics to achievements'
      ],
      linguistic_errors: [
        'Check for consistent tense usage across experience sections',
        'Ensure professional tone in summary statement',
        'Verify spelling of technical terms'
      ],
      career_advice: [
        'Tailor your resume for specific roles by emphasizing ' + (parsedData.skills[0] || 'core skills'),
        'Add a dedicated Projects section to showcase hands-on experience',
        'Highlight leadership roles more prominently'
      ],
      skills: parsedData.skills.slice(0, 15),
      experience_years: parsedData.experience.length * 2 || 3, // Heuristic
      recommendation:
        `Based on your profile, you are a strong candidate for roles involving ${parsedData.skills.slice(0, 3).join(' and ')}. Focus on building more domain-specific projects.`,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
