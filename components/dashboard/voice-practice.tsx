'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import { Mic, MicOff, PhoneOff, Volume2 } from 'lucide-react';
import { AvatarCall, AvatarVideo } from '@runwayml/avatars-react';

const RUNWAY_PUB_KEY = 'pub_774b1e4c11deb69b2dcd98b9442e80912d1ba083593430e9f82cb0c0aee41138';

/* ─────────────────────────────────────────
   Decorative side-buttons for iPhone frame
───────────────────────────────────────── */
function SideButtons() {
  return (
    <>
      {/* Silent switch */}
      <div className="absolute rounded-l-[3px]"
        style={{ left: -5, top: 52, width: 4, height: 26,
          background: 'linear-gradient(to right,#4a4a4c,#3a3a3c)',
          boxShadow: '-1px 0 1px #111' }} />
      {/* Volume Up */}
      <div className="absolute rounded-l-[3px]"
        style={{ left: -5, top: 94, width: 4, height: 52,
          background: 'linear-gradient(to right,#4a4a4c,#3a3a3c)',
          boxShadow: '-1px 0 1px #111' }} />
      {/* Volume Down */}
      <div className="absolute rounded-l-[3px]"
        style={{ left: -5, top: 158, width: 4, height: 52,
          background: 'linear-gradient(to right,#4a4a4c,#3a3a3c)',
          boxShadow: '-1px 0 1px #111' }} />
      {/* Power */}
      <div className="absolute rounded-r-[3px]"
        style={{ right: -5, top: 120, width: 4, height: 76,
          background: 'linear-gradient(to left,#4a4a4c,#3a3a3c)',
          boxShadow: '1px 0 1px #111' }} />
    </>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function VoicePractice() {
  const [isCalling, setIsCalling]         = useState(false);
  const [isMuted, setIsMuted]             = useState(false);
  const [isSpeakerOn, setIsSpeakerOn]     = useState(true);
  const [duration, setDuration]           = useState(0);
  const [stressLevel, setStressLevel]     = useState(15);
  const [error, setError]                 = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const timerRef  = useRef<NodeJS.Timeout | null>(null);
  const rowsRef   = useRef<(HTMLLIElement | null)[]>([]);
  const [pulse, setPulse]                 = useState(false);

  const practiceModules = [
    { title: 'Verbal Confidence',  desc: 'Master the art of clear, assertive communication.' },
    { title: 'Stress Management',  desc: 'Keep your heart rate steady under high pressure.'  },
    { title: 'Active Listening',   desc: 'Respond to nuances in the AI recruiter\'s voice.'  },
    { title: 'STAR Method',        desc: 'Structure your answers with precision and flow.'    },
    { title: 'Tone Modulation',    desc: 'Perfect your professional vocal presence.'          },
  ];

  /* pulse ring for avatar */
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(t);
  }, []);

  /* scroll-driven animation on practice-module rows */
  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('main');
      if (!container) return;
      const scrolled = container.scrollTop / (container.scrollHeight - container.clientHeight);
      const total = 1 / practiceModules.length;
      rowsRef.current.forEach((row, index) => {
        if (!row) return;
        const start = total * index;
        const end   = total * (index + 1);
        let progress = (scrolled - start) / (end - start);
        if (progress >= 1) progress = 1;
        if (progress <= 0) progress = 0;
        row.style.setProperty('--progress', progress.toString());
      });
    };
    const main = document.querySelector('main');
    main?.addEventListener('scroll', handleScroll);
    return () => main?.removeEventListener('scroll', handleScroll);
  }, [practiceModules.length]);

  /* call timer + stress simulation */
  useEffect(() => {
    if (isCalling) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
        setStressLevel(prev => Math.max(5, Math.min(95, prev + Math.random() * 6 - 3)));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isCalling]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const startCall = () => { setError(null); setIsCalling(true); };
  const endCall   = () => setIsCalling(false);

  const connectAvatar = useCallback(async (avatarId: string) => {
    try {
      const res = await fetch('/api/avatar/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarId,
          startScript: "Hi there! I'm Arjun. Let's start our voice-only practice session. How are you feeling today?",
        }),
      });

      const data = await res.json();

      // If quota exceeded → switch to Runway widget fallback
      if (res.status === 429 && data.quotaExceeded) {
        setQuotaExceeded(true);
        setIsCalling(false);
        // Must throw (not return undefined) so AvatarCall's onError fires instead of crashing
        throw new Error('QUOTA_EXCEEDED');
      }

      if (!res.ok) throw new Error(data.error || 'Failed to connect');
      return data;
    } catch (err: any) {
      setError(err.message);
      setIsCalling(false);
      throw err;
    }
  }, []);

  const stressColor = stressLevel > 70 ? '#ef4444' : stressLevel > 40 ? '#eab308' : '#22c55e';

  return (
    <div className="w-full flex flex-col items-center py-20 bg-black" style={{ minHeight: '220vh' }}>

      {/* ── Header ── */}
      <div className="mb-24 text-center max-w-3xl px-4">
        <h2 className="text-gray-500 text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Immersive Voice
          <p className="text-white">Practice with AI.</p>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto">
          Experience the future of interview preparation with our cinematic audio simulations.
        </p>
      </div>

      {/* ── Quota Exceeded: Runway Widget Fallback ── */}
      {quotaExceeded && (
        <div className="w-full flex flex-col items-center gap-6 px-4 animate-in fade-in duration-700">
          <Script
            src="https://cdn.dev.runwayml.com/prod/widget.js"
            data-pub-key={RUNWAY_PUB_KEY}
            strategy="afterInteractive"
          />
          <div className="flex flex-col items-center gap-3 text-center mb-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400">
              ⚡ Switched to Runway Live Widget
            </div>
            <p className="text-zinc-500 text-sm max-w-sm">
              Daily session limit reached. The live widget below connects you directly to an AI avatar.
            </p>
          </div>

          {/* Widget host — Runway script injects its UI here */}
          <div
            id="runway-widget-host"
            className="w-full max-w-sm rounded-3xl overflow-hidden border border-zinc-800"
            style={{ minHeight: 500, background: '#0a0a0a' }}
          />

          <button
            onClick={() => { setQuotaExceeded(false); setError(null); }}
            className="text-xs text-zinc-600 hover:text-zinc-400 font-mono transition-colors mt-2"
          >
            ↩ Try primary session again
          </button>
        </div>
      )}

      {/* ── iPhone Frame (sticky) — hidden when widget is active ── */}
      {!quotaExceeded && (
        <div className="sticky top-12 mb-40" style={{ perspective: 1200 }}>
          <div className="relative" style={{
            width: 320,
            height: 650,
            borderRadius: 50,
            background: 'linear-gradient(150deg,#3a3a3c 0%,#1c1c1e 50%,#111 100%)',
            boxShadow: [
              '0 0 0 1.5px #4a4a4c',
              '0 0 0 3px #1a1a1a',
              '0 60px 140px rgba(0,0,0,0.95)',
              'inset 0 1px 0 rgba(255,255,255,0.10)',
              'inset 0 -1px 0 rgba(0,0,0,0.5)',
            ].join(', '),
            padding: 3,
          }}>

          {/* ── Screen ── */}
          <div className="relative overflow-hidden bg-black"
            style={{ width: '100%', height: '100%', borderRadius: 48 }}>

            {/* Dynamic Island */}
            <div className="absolute z-30 bg-black rounded-full"
              style={{ top: 12, left: '50%', transform: 'translateX(-50%)',
                width: 120, height: 36, boxShadow: '0 0 0 1px #222' }} />

            {/* Glass reflection */}
            <div className="absolute inset-0 pointer-events-none z-20"
              style={{ background: 'linear-gradient(130deg,rgba(255,255,255,0.04) 0%,transparent 45%)',
                borderRadius: 48 }} />

            {/* ── STATUS BAR ── */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between px-8 pt-4 pb-1"
              style={{ paddingTop: 54 }}>
              <span className="text-[10px] font-mono text-white/40">9:41</span>
              <span className={`text-[9px] font-bold tracking-widest ${error ? 'text-red-500' : 'text-green-500'}`}>
                {error ? 'ERROR' : 'ENCRYPTED'}
              </span>
              {isCalling && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-white/50">{formatTime(duration)}</span>
                </div>
              )}
            </div>

            {/* ── CONTENT ── */}
            <div className="absolute inset-0 flex flex-col items-center justify-between px-5 pb-16"
              style={{ paddingTop: 96 }}>

              {isCalling ? (
                /* ── ACTIVE CALL UI ── */
                <div className="w-full flex flex-col items-center gap-5 animate-in fade-in zoom-in-95 duration-700">

                  {/* Avatar circle with pulse */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="18" r="10" fill="#555" />
                        <path d="M4 46c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="#555" />
                      </svg>
                    </div>
                    <span className="absolute inset-0 rounded-full border border-white/20 transition-all duration-700"
                      style={{ transform: pulse ? 'scale(1.35)' : 'scale(1)', opacity: pulse ? 0 : 0.5 }} />
                    <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    </span>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-white text-lg tracking-tight">Arjun (AI Recruiter)</p>
                    <p className="text-[11px] text-white/40 mt-0.5">Connected · Audio Only</p>
                  </div>

                  {/* Stress/Anxiety meter */}
                  <div className="w-full bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                    <div className="flex justify-between mb-2">
                      <span className="text-[9px] font-mono tracking-[0.15em] text-zinc-500 uppercase">Anxiety Meter</span>
                      <span className="text-sm font-bold text-white">{Math.round(stressLevel)}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${stressLevel}%`, backgroundColor: stressColor }} />
                    </div>
                  </div>

                  {/* Controls — Mute / Speaker */}
                  <div className="flex justify-around w-full">
                    {[
                      { label: 'MUTE',    active: isMuted,    onClick: () => setIsMuted(m => !m),
                        icon: isMuted
                          ? <MicOff size={20} />
                          : <Mic size={20} /> },
                      { label: 'SPEAKER', active: isSpeakerOn, onClick: () => setIsSpeakerOn(s => !s),
                        icon: <Volume2 size={20} /> },
                    ].map(({ label, active, onClick, icon }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5">
                        <button onClick={onClick}
                          className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                          style={{ background: active ? 'rgba(255,255,255,0.15)' : '#27272a',
                            border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                          {icon}
                        </button>
                        <span className="text-[8px] font-mono tracking-widest text-zinc-500">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* End call */}
                  <div className="flex justify-center mt-1">
                    <div className="flex flex-col items-center gap-1.5">
                      <button onClick={endCall}
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        style={{ background: '#ef4444', boxShadow: '0 0 20px rgba(239,68,68,0.5)' }}>
                        <PhoneOff size={20} color="white" />
                      </button>
                      <span className="text-[8px] font-mono tracking-widest text-zinc-500">END</span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-[10px] text-red-400 text-center font-mono px-2">{error}</p>
                  )}
                </div>
              ) : (
                /* ── IDLE / START UI ── */
                <div className="w-full flex flex-col items-center gap-4">

                  {/* Avatar placeholder */}
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="18" r="10" fill="#444" />
                      <path d="M4 46c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="#444" />
                    </svg>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-white text-base tracking-tight">Arjun (AI Recruiter)</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Ready to connect</p>
                  </div>

                  {/* Start button — placed before list so it sits high */}
                  <button
                    onClick={startCall}
                    className="w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: '#22c55e', color: '#000',
                      boxShadow: '0 0 20px rgba(34,197,94,0.35)' }}
                  >
                    Initiate Session
                  </button>

                  {/* Practice module list — scroll animated */}
                  <ul className="w-full space-y-2">
                    {practiceModules.map((mod, idx) => (
                      <li
                        key={idx}
                        ref={el => rowsRef.current[idx] = el}
                        className="p-3.5 rounded-xl border border-white/10"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          opacity: 'var(--progress, 0)',
                          transform: 'scale(calc(1.08 - (0.08 * var(--progress,0)))) translateY(calc(-16px * (1 - var(--progress,0))))',
                          transition: 'transform 0.3s ease, opacity 0.3s ease',
                        }}
                      >
                        <h4 className="text-white font-bold text-[11px] mb-0.5">{mod.title}</h4>
                        <p className="text-zinc-500 text-[9px] leading-relaxed">{mod.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Side buttons */}
          <SideButtons />
        </div>
        </div>
      )}

      {/* Scroll space */}
      <div style={{ height: '80vh' }} />

      {/* Hidden audio connection */}
      {isCalling && (
        <div className="absolute opacity-0 pointer-events-none w-px h-px overflow-hidden">
          <AvatarCall
            avatarId="a42f41bf-b379-4544-bc19-58f35c489726"
            connect={connectAvatar}
            audio={true}
            video={true}
            onError={err => { if (err.message !== 'QUOTA_EXCEEDED') setError(err.message); }}
          >
            <AvatarVideo />
          </AvatarCall>
        </div>
      )}
    </div>
  );
}
