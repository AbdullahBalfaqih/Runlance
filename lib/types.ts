export interface Persona {
  name: string;
  avatarId: string;
  imageUrl: string;
  personality: string;
}

export interface CompatibilityAnalysis {
  score: number;
  spokenSummary: string;
  strengths: string[];
  gaps: string[];
  jobTitle: string;
  company: string;
}

export interface AvatarSession {
  sessionId: string;
  avatarId: string;
  startedAt: Date;
  status: 'connecting' | 'active' | 'completed' | 'error';
}
