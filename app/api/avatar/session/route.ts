import { NextRequest, NextResponse } from 'next/server';
import RunwayML from '@runwayml/sdk';
import { consumeSession } from '@runwayml/avatars-react/api';

const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function avatarReference(avatarId: string) {
  if (!avatarId) return { type: 'runway-preset' as const, presetId: 'a42f41bf-b379-4544-bc19-58f35c489726' };
  return uuidLike.test(avatarId)
    ? { type: 'custom' as const, avatarId }
    : { type: 'runway-preset' as const, presetId: avatarId };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { avatarId, personality, startScript } = body;

    const apiKey = process.env.RUNWAYML_API_SECRET || process.env.RUNWAY_API_KEY;
    
    if (!apiKey) {
      console.error('[Avatar API] RUNWAYML_API_SECRET or RUNWAY_API_KEY not set');
      return NextResponse.json(
        { error: 'Runway API key is not configured' },
        { status: 500 }
      );
    }

    const client = new RunwayML({ apiKey });

    console.log('[Avatar API] Creating session for avatar:', avatarId);

    // 1. Create the session
    const sessionResponse = await client.realtimeSessions.create({
      model: 'gwm1_avatars',
      avatar: avatarReference(avatarId),
      personality: personality || 'Professional and helpful career coach.',
      startScript: startScript
    } as any);

    const sessionId = sessionResponse.id;
    let sessionKey: string | undefined;
    let failure: any;

    console.log('[Avatar API] Session created, ID:', sessionId, 'Polling for READY status...');

    // 2. Poll for READY status
    for (let attempt = 0; attempt < 60; attempt++) {
      const session = await client.realtimeSessions.retrieve(sessionId);
      if (session.status === 'READY') {
        sessionKey = (session as any).sessionKey;
        break;
      }
      if (session.status === 'FAILED') {
        failure = (session as any).failure;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!sessionKey) {
      console.error('[Avatar API] Session failed to reach READY status:', failure);
      throw new Error(failure ? `Runway session failed: ${JSON.stringify(failure)}` : 'Runway session timed out after 60s');
    }

    // 3. Consume the session to get LiveKit credentials
    const credentials = await consumeSession({
      sessionId,
      sessionKey,
      baseUrl: client.baseURL
    });

    console.log('[Avatar API] Session ready, credentials obtained.');

    return NextResponse.json({
      sessionId,
      serverUrl: credentials.url,
      token: credentials.token,
      roomName: credentials.roomName
    });

  } catch (error: any) {
    console.error('[Avatar API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create avatar session' },
      { status: 500 }
    );
  }
}
