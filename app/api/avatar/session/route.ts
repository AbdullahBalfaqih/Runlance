import { NextRequest, NextResponse } from 'next/server';
import RunwayML from '@runwayml/sdk';
import { consumeSession } from '@runwayml/avatars-react/api';

const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function avatarReference(avatarId: string) {
  // Using 'human-resource' as the valid preset ID for the HR interviewer
  const defaultPreset = 'human-resource';
  if (!avatarId || avatarId === 'a42f41bf-b379-4544-bc19-58f35c489726') {
    return { type: 'runway-preset' as const, presetId: defaultPreset };
  }
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
    let sessionResponse;
    try {
      const avatarRef = avatarReference(avatarId);
      const isPreset = avatarRef.type === 'runway-preset';
      
      const sessionConfig: any = {
        model: 'gwm1_avatars',
        avatar: avatarRef,
      };

      // Only add personality and startScript for custom avatars, as presets don't support overrides
      if (!isPreset) {
        sessionConfig.personality = personality || 'Professional and helpful career coach.';
        sessionConfig.startScript = startScript;
      }

      sessionResponse = await client.realtimeSessions.create(sessionConfig);
    } catch (createError: any) {
      console.error('[Avatar API] Runway Create Session Error:', createError.message, createError.stack);
      return NextResponse.json(
        { error: `Runway failed to create session: ${createError.message}` },
        { status: 500 }
      );
    }

    const sessionId = sessionResponse.id;
    let sessionKey: string | undefined;
    let failure: any;

    console.log('[Avatar API] Session created, ID:', sessionId, 'Polling for READY status...');

    // 2. Poll for READY status
    for (let attempt = 0; attempt < 30; attempt++) {
      const session = await client.realtimeSessions.retrieve(sessionId);
      console.log(`[Avatar API] Polling session ${sessionId}... Status: ${session.status}`);
      
      if (session.status === 'READY') {
        sessionKey = (session as any).sessionKey;
        break;
      }
      if (session.status === 'FAILED') {
        failure = (session as any).failure;
        console.error('[Avatar API] Session FAILED on Runway side:', failure);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!sessionKey) {
      throw new Error(failure ? `Runway session failed: ${JSON.stringify(failure)}` : 'Runway session timed out');
    }

    // 3. Consume the session to get LiveKit credentials
    console.log('[Avatar API] Consuming session...');
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
