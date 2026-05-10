'use client';

import { useMemo } from 'react';
import { useAvatarSession, useLocalMedia, useTranscript } from '@runwayml/avatars-react';

export function AvatarSessionInspector() {
  const session = useAvatarSession();
  const localMedia = useLocalMedia();
  const transcript = useTranscript({ bufferSize: 8 });
  const latestUserSpeech = useMemo(
    () => [...transcript].reverse().find((entry) => entry.participantIdentity.toLowerCase().includes('user')),
    [transcript]
  );
  const latestSpeech = transcript.at(-1);

  return (
    <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-3 text-xs leading-5 text-muted-foreground">
      <div className="grid grid-cols-2 gap-2">
        <p><span className="font-semibold text-foreground">Session:</span> {session.state}</p>
        <p><span className="font-semibold text-foreground">Mic:</span> {localMedia.isMicEnabled ? 'on' : 'off'}</p>
        <p><span className="font-semibold text-foreground">Mic found:</span> {localMedia.hasMic ? 'yes' : 'no'}</p>
        <p><span className="font-semibold text-foreground">Screen:</span> {localMedia.isScreenShareEnabled ? 'shared' : 'off'}</p>
        <p><span className="font-semibold text-foreground">Transcript:</span> {transcript.length ? 'receiving' : 'waiting'}</p>
      </div>
      {localMedia.micError && (
        <div className="mt-2 rounded-lg border border-foreground/10 bg-background p-2">
          Mic error: {localMedia.micError.message}
          <button className="ml-2 underline hover:no-underline" onClick={() => void localMedia.retryMic()}>retry</button>
        </div>
      )}
      <div className="mt-2 rounded-lg border border-foreground/10 bg-background p-2">
        <p className="font-semibold text-foreground">Last heard</p>
        <p className="text-muted-foreground">{latestUserSpeech?.text ?? latestSpeech?.text ?? 'Say a short sentence after the session says active.'}</p>
      </div>
    </div>
  );
}
