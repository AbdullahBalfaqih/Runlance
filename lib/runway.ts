/**
 * Runway API Integration for AI Interview Coach
 * Handles character creation and realtime voice sessions
 */

import axios from 'axios';

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;
const RUNWAY_BASE_URL = process.env.RUNWAY_BASE_URL || 'https://api.runwayml.com/v1';

const runwayClient = axios.create({
  baseURL: RUNWAY_BASE_URL,
  headers: {
    Authorization: `Bearer ${RUNWAY_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface RunwayCharacter {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
}

export interface InterviewSession {
  id: string;
  characterId: string;
  sessionToken: string;
  sessionUrl?: string;
  expiresAt: string;
}

export interface InterviewMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * Create an AI interviewer character
 */
export async function createInterviewerCharacter(
  personaName: string,
  jobTitle: string
): Promise<RunwayCharacter> {
  try {
    const response = await runwayClient.post('/characters', {
      name: `Interview Coach - ${jobTitle}`,
      description: `AI interviewer specialized in ${jobTitle} interviews for ${personaName}`,
      type: 'interviewer',
      configuration: {
        personality: 'professional',
        expertise: jobTitle,
        language: 'en',
      },
    });

    return {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description,
      avatarUrl: response.data.avatar_url,
    };
  } catch (error) {
    console.error('Error creating Runway character:', error);
    throw new Error('Failed to create interview character');
  }
}

/**
 * Start a new realtime interview session
 */
export async function startInterviewSession(
  characterId: string,
  sessionType: 'voice' | 'text' = 'voice'
): Promise<InterviewSession> {
  try {
    const response = await runwayClient.post('/sessions', {
      character_id: characterId,
      session_type: sessionType,
      mode: 'realtime',
      configuration: {
        max_duration_seconds: 3600,
        enable_recording: true,
      },
    });

    return {
      id: response.data.id,
      characterId: response.data.character_id,
      sessionToken: response.data.token,
      sessionUrl: response.data.session_url,
      expiresAt: response.data.expires_at,
    };
  } catch (error) {
    console.error('Error starting interview session:', error);
    throw new Error('Failed to start interview session');
  }
}

/**
 * Send a message in an interview session
 */
export async function sendInterviewMessage(
  sessionId: string,
  message: string
): Promise<string> {
  try {
    const response = await runwayClient.post(`/sessions/${sessionId}/messages`, {
      content: message,
      type: 'text',
    });

    return response.data.response;
  } catch (error) {
    console.error('Error sending interview message:', error);
    throw new Error('Failed to send message');
  }
}

/**
 * End an interview session
 */
export async function endInterviewSession(sessionId: string): Promise<void> {
  try {
    await runwayClient.post(`/sessions/${sessionId}/end`);
  } catch (error) {
    console.error('Error ending interview session:', error);
    throw new Error('Failed to end session');
  }
}

/**
 * Get session recording
 */
export async function getSessionRecording(
  sessionId: string
): Promise<{ recordingUrl: string; transcript: string }> {
  try {
    const response = await runwayClient.get(`/sessions/${sessionId}/recording`);

    return {
      recordingUrl: response.data.recording_url,
      transcript: response.data.transcript || '',
    };
  } catch (error) {
    console.error('Error getting session recording:', error);
    throw new Error('Failed to retrieve session recording');
  }
}

/**
 * Analyze interview performance
 */
export async function analyzeInterviewPerformance(
  transcript: string
): Promise<{
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
}> {
  try {
    // This would typically use an AI API (Claude, GPT, etc.) for analysis
    // For now, returning a basic structure
    const response = await runwayClient.post('/analyze', {
      type: 'interview',
      content: transcript,
    });

    return {
      score: response.data.score || 75,
      strengths: response.data.strengths || [],
      improvements: response.data.improvements || [],
      feedback: response.data.feedback || 'Interview analysis not available',
    };
  } catch (error) {
    console.error('Error analyzing interview:', error);
    // Return default analysis if API fails
    return {
      score: 0,
      strengths: [],
      improvements: [],
      feedback: 'Unable to analyze interview at this time',
    };
  }
}
