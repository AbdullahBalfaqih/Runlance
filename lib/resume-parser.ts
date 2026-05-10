import mammoth from 'mammoth';

export interface ParsedResume {
  rawText: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
}

// Common skills database for matching
const commonSkills = [
  // Programming Languages
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',

  // Web Development
  'React',
  'Vue',
  'Angular',
  'Node.js',
  'Express',
  'Django',
  'Flask',
  'FastAPI',
  'Spring',
  'Rails',

  // Databases
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Cassandra',
  'DynamoDB',
  'Elasticsearch',

  // Cloud & DevOps
  'AWS',
  'Google Cloud',
  'Azure',
  'Docker',
  'Kubernetes',
  'CI/CD',
  'Jenkins',
  'GitLab',
  'GitHub Actions',

  // Product & Management
  'Product Management',
  'Agile',
  'Scrum',
  'Kanban',
  'Leadership',
  'Team Building',
  'Strategic Planning',
  'Business Analysis',

  // Data & Analytics
  'Data Analysis',
  'SQL',
  'Tableau',
  'Power BI',
  'Analytics',
  'Statistics',
  'Machine Learning',
  'Deep Learning',
  'TensorFlow',
  'PyTorch',

  // Soft Skills
  'Communication',
  'Problem Solving',
  'Critical Thinking',
  'Collaboration',
  'Time Management',
  'Project Management',
];

export async function parseResume(file: File): Promise<ParsedResume> {
  let rawText = '';

  // Parse PDF or Word document
  if (file.type === 'application/pdf') {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Use pdf2json for reliable server-side PDF parsing
    const PDFParser = (await import('pdf2json')).default;
    rawText = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
      pdfParser.on('pdfParser_dataReady', () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });
  } else if (
    file.type === 'application/msword' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    rawText = result.value;
  } else {
    throw new Error('Unsupported file type');
  }

  // Extract skills
  const skills = extractSkills(rawText);

  // Extract experience (simplified)
  const experience = extractExperience(rawText);

  // Extract education (simplified)
  const education = extractEducation(rawText);

  return {
    rawText,
    skills,
    experience,
    education,
  };
}

function extractSkills(text: string): string[] {
  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();

  // Match against common skills
  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.add(skill);
    }
  }

  return Array.from(foundSkills);
}

function extractExperience(
  text: string
): Array<{
  title: string;
  company: string;
  duration: string;
  description: string;
}> {
  const experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }> = [];

  // Simple regex patterns for common job formats
  const jobPattern = /([A-Z][a-z\s]+)\s+at\s+([A-Z][a-zA-Z\s&.,]+)/gi;
  let match;

  while ((match = jobPattern.exec(text)) !== null) {
    if (match[1] && match[2]) {
      experience.push({
        title: match[1].trim(),
        company: match[2].trim(),
        duration: 'Not specified',
        description: 'Extracted from resume',
      });
    }
  }

  return experience.slice(0, 5); // Limit to 5 most recent
}

function extractEducation(
  text: string
): Array<{
  degree: string;
  school: string;
  year: string;
}> {
  const education: Array<{
    degree: string;
    school: string;
    year: string;
  }> = [];

  const degreePatterns = [
    /(?:B\.?S\.?|B\.?A\.?|Bachelor)/i,
    /(?:M\.?S\.?|M\.?B\.?A\.?|Master)/i,
    /(?:Ph\.?D\.?|Doctorate)/i,
  ];

  const universityPattern = /(?:University|College|Institute|School)[^.]*\.*/gi;

  const universities = text.match(universityPattern) || [];

  degreePatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      const degree = text.match(pattern)?.[0] || 'Degree';
      const university = universities[0] || 'School';

      education.push({
        degree: degree.substring(0, 20),
        school: university.substring(0, 40),
        year: 'Not specified',
      });
    }
  });

  return education.slice(0, 3);
}
