'use client';

import { useState, useCallback, useEffect } from 'react';
import { AvatarCall } from '@runwayml/avatars-react';

export default function ExtensionAvatarPage() {
  const [isCalling, setIsCalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add transparent background class to body
    document.body.style.background = 'transparent';
  }, []);

  const connectAvatar = useCallback(async (avatarId: string) => {
    try {
      const res = await fetch('/api/avatar/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarId: 'a42f41bf-b379-4544-bc19-58f35c489726',
          startScript: "Hello! I am your AI Career Coach. How can I help you prepare today?",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect');
      return data;
    } catch (err: any) {
      setError(err.message);
      setIsCalling(false);
      throw err;
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4" style={{ minHeight: '400px', background: '#000' }}>
      {!isCalling ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-white font-bold text-lg">AI Recruiter</h3>
            <p className="text-zinc-400 text-sm">Ready to practice</p>
          </div>
          <button
            onClick={() => { setError(null); setIsCalling(true); }}
            className="mt-4 bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-full transition-all"
          >
            Start Voice Session
          </button>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col bg-zinc-900 rounded-2xl overflow-hidden relative" style={{ minHeight: '380px' }}>
          <AvatarCall
            avatarId="a42f41bf-b379-4544-bc19-58f35c489726"
            connect={connectAvatar}
            audio
            video
            onEnd={() => setIsCalling(false)}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '16px' }}
          />
        </div>
      )}
    </div>
  );
}
