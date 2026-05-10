'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import { PhoneOff } from 'lucide-react';
import {
  AvatarCall,
  AvatarVideo,
  useLocalMedia,
  useAvatarSession,
} from '@runwayml/avatars-react';

const RUNWAY_PUB_KEY = 'pub_774b1e4c11deb69b2dcd98b9442e80912d1ba083593430e9f82cb0c0aee41138';
const AVATAR_ID      = 'a42f41bf-b379-4544-bc19-58f35c489726';

/* ─────────────────────────────────────────
   iPhone side buttons
───────────────────────────────────────── */
function SideButtons() {
  return (
    <>
      <div className="absolute rounded-l-[3px]"
        style={{ left:-5, top:52,  width:4, height:26, background:'linear-gradient(to right,#4a4a4c,#3a3a3c)', boxShadow:'-1px 0 1px #111' }} />
      <div className="absolute rounded-l-[3px]"
        style={{ left:-5, top:94,  width:4, height:52, background:'linear-gradient(to right,#4a4a4c,#3a3a3c)', boxShadow:'-1px 0 1px #111' }} />
      <div className="absolute rounded-l-[3px]"
        style={{ left:-5, top:158, width:4, height:52, background:'linear-gradient(to right,#4a4a4c,#3a3a3c)', boxShadow:'-1px 0 1px #111' }} />
      <div className="absolute rounded-r-[3px]"
        style={{ right:-5, top:120, width:4, height:76, background:'linear-gradient(to left,#4a4a4c,#3a3a3c)', boxShadow:'1px 0 1px #111' }} />
    </>
  );
}

/* ─────────────────────────────────────────
   Active call UI — MUST live inside AvatarCall
   so it can use useLocalMedia / useAvatarSession
───────────────────────────────────────── */
interface ActiveCallProps {
  stressLevel: number;
  stressColor: string;
  duration:    number;
  formatTime:  (s: number) => string;
  error:       string | null;
  pulse:       boolean;
  onEnd:       () => void;
}

function ActiveCallUI({ stressLevel, stressColor, duration, formatTime, error, pulse, onEnd }: ActiveCallProps) {
  const { isMicEnabled, toggleMic } = useLocalMedia();
  const { state }                   = useAvatarSession();
  const [speakerOn, setSpeakerOn]   = useState(true);

  const isConnected = state === 'active';

  /* Mic SVG icons */
  const MicIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
  const MicOffIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
  const SpeakerIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  );

  return (
    <div className="w-full h-full flex flex-col" style={{ paddingTop: 96, paddingBottom: 28, paddingLeft: 20, paddingRight: 20 }}>

      {/* ── STATUS BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between px-8" style={{ paddingTop: 54 }}>
        <span className="text-[10px] font-mono text-white/40">9:41</span>
        <span className="text-[9px] font-bold tracking-widest text-green-500">ENCRYPTED</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-mono text-white/50">{formatTime(duration)}</span>
        </div>
      </div>

      {/* ── AVATAR ── */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="relative">
          {/* Outer pulse rings */}
          <span className="absolute inset-0 rounded-full border border-white/10 transition-all duration-[1200ms]"
            style={{ transform: pulse ? 'scale(1.5)' : 'scale(1.1)', opacity: pulse ? 0 : 0.4 }} />
          <span className="absolute inset-0 rounded-full border border-white/8 transition-all duration-[1200ms]"
            style={{ transform: pulse ? 'scale(1.8)' : 'scale(1.2)', opacity: pulse ? 0 : 0.2, transitionDelay: '200ms' }} />

          {/* Avatar circle */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center relative"
            style={{ background: 'radial-gradient(circle at 35% 35%,#444,#1c1c1e)' }}>
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="18" r="11" fill="#666"/>
              <path d="M4 48c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="#666"/>
            </svg>
          </div>

          {/* Waveform badge */}
          <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </span>
        </div>

        <div className="text-center">
          <p className="font-bold text-white text-[17px] tracking-tight">Arjun (AI Recruiter)</p>
          <p className="text-[11px] mt-0.5" style={{ color: isConnected ? '#22c55e' : '#888' }}>
            {isConnected ? 'Connected · Audio Only' : state === 'connecting' ? 'Connecting…' : 'Initializing…'}
          </p>
        </div>
      </div>

      {/* ── ANXIETY METER ── */}
      <div className="mt-5 rounded-2xl p-4 border border-zinc-800" style={{ background:'#111' }}>
        <div className="flex justify-between mb-2">
          <span className="text-[9px] font-mono tracking-[0.18em] text-zinc-500 uppercase">Anxiety Meter</span>
          <span className="text-sm font-bold text-white">{Math.round(stressLevel)}%</span>
        </div>
        <div className="h-[5px] bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width:`${stressLevel}%`, backgroundColor: stressColor }} />
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="mt-auto flex flex-col items-center gap-4">
        {/* MUTE + SPEAKER */}
        <div className="flex justify-center gap-12 w-full">
          {/* MUTE */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={toggleMic}
              className="w-[58px] h-[58px] rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{
                background: !isMicEnabled ? 'rgba(255,255,255,0.18)' : '#27272a',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
              }}
            >
              {isMicEnabled ? <MicIcon /> : <MicOffIcon />}
            </button>
            <span className="text-[8px] font-mono tracking-widest text-zinc-500">
              {isMicEnabled ? 'MUTE' : 'UNMUTE'}
            </span>
          </div>

          {/* SPEAKER */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => setSpeakerOn(s => !s)}
              className="w-[58px] h-[58px] rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{
                background: speakerOn ? 'rgba(255,255,255,0.18)' : '#27272a',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
              }}
            >
              <SpeakerIcon />
            </button>
            <span className="text-[8px] font-mono tracking-widest text-zinc-500">SPEAKER</span>
          </div>
        </div>

        {/* END */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={onEnd}
            className="w-[58px] h-[58px] rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ background: '#ef4444', boxShadow: '0 0 24px rgba(239,68,68,0.55)' }}
          >
            <PhoneOff size={22} color="white" />
          </button>
          <span className="text-[8px] font-mono tracking-widest text-zinc-500">END</span>
        </div>

        {error && (
          <p className="text-[9px] text-red-400 text-center font-mono px-2 -mt-2">{error}</p>
        )}
      </div>

      {/* Hidden video — audio plays automatically */}
      <div style={{ position:'absolute', width:1, height:1, overflow:'hidden', opacity:0, pointerEvents:'none' }}>
        <AvatarVideo />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function VoicePractice() {
  const [isCalling, setIsCalling]         = useState(false);
  const [duration, setDuration]           = useState(0);
  const [stressLevel, setStressLevel]     = useState(15);
  const [error, setError]                 = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [pulse, setPulse]                 = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rowsRef  = useRef<(HTMLLIElement | null)[]>([]);

  const practiceModules = [
    { title: 'Verbal Confidence', desc: 'Master the art of clear, assertive communication.' },
    { title: 'Stress Management', desc: 'Keep your heart rate steady under high pressure.'  },
    { title: 'Active Listening',  desc: "Respond to nuances in the AI recruiter's voice."   },
    { title: 'STAR Method',       desc: 'Structure your answers with precision and flow.'    },
    { title: 'Tone Modulation',   desc: 'Perfect your professional vocal presence.'          },
  ];

  /* pulse ring */
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(t);
  }, []);

  /* scroll animation on module list */
  useEffect(() => {
    const handle = () => {
      const el = document.querySelector('main');
      if (!el) return;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      const total    = 1 / practiceModules.length;
      rowsRef.current.forEach((row, i) => {
        if (!row) return;
        const start = total * i, end = total * (i + 1);
        let p = (scrolled - start) / (end - start);
        p = Math.max(0, Math.min(1, p));
        row.style.setProperty('--progress', p.toString());
      });
    };
    const main = document.querySelector('main');
    main?.addEventListener('scroll', handle);
    return () => main?.removeEventListener('scroll', handle);
  }, [practiceModules.length]);

  /* call timer + stress */
  useEffect(() => {
    if (isCalling) {
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
        setStressLevel(s => Math.max(5, Math.min(95, s + Math.random() * 6 - 3)));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isCalling]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const connectAvatar = useCallback(async (avatarId: string) => {
    try {
      const res  = await fetch('/api/avatar/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarId,
          startScript: "Hi! I'm Arjun, your AI recruiter. Let's begin the voice practice session. Tell me about yourself.",
        }),
      });
      const data = await res.json();
      if (res.status === 429 && data.quotaExceeded) {
        setQuotaExceeded(true);
        setIsCalling(false);
        throw new Error('QUOTA_EXCEEDED');
      }
      if (!res.ok) throw new Error(data.error || 'Failed to connect');
      return data;
    } catch (err: any) {
      if (err.message !== 'QUOTA_EXCEEDED') setError(err.message);
      setIsCalling(false);
      throw err;
    }
  }, []);

  const stressColor = stressLevel > 70 ? '#ef4444' : stressLevel > 40 ? '#eab308' : '#22c55e';

  return (
    <div className="w-full flex flex-col items-center py-20 bg-black" style={{ minHeight: '220vh' }}>

      {/* Header */}
      <div className="mb-24 text-center max-w-3xl px-4">
        <h2 className="text-gray-500 text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Immersive Voice
          <p className="text-white">Practice with AI.</p>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto">
          Experience the future of interview preparation with our cinematic audio simulations.
        </p>
      </div>

      {/* Quota exceeded → Runway widget */}
      {quotaExceeded && (
        <div className="w-full flex flex-col items-center gap-6 px-4 animate-in fade-in duration-700">
          <Script src="https://cdn.dev.runwayml.com/prod/widget.js" data-pub-key={RUNWAY_PUB_KEY} strategy="afterInteractive" />
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400">
              ⚡ Switched to Runway Live Widget
            </div>
            <p className="text-zinc-500 text-sm max-w-sm">Daily session limit reached. Connecting via public widget.</p>
          </div>
          <div id="runway-widget-host" className="w-full max-w-sm rounded-3xl overflow-hidden border border-zinc-800" style={{ minHeight:500, background:'#0a0a0a' }} />
          <button onClick={() => { setQuotaExceeded(false); setError(null); }} className="text-xs text-zinc-600 hover:text-zinc-400 font-mono transition-colors">
            ↩ Try primary session again
          </button>
        </div>
      )}

      {/* iPhone frame */}
      {!quotaExceeded && (
        <div className="sticky top-12 mb-40" style={{ perspective: 1200 }}>
          <div className="relative" style={{
            width: 320, height: 650, borderRadius: 50,
            background: 'linear-gradient(150deg,#3a3a3c 0%,#1c1c1e 50%,#111 100%)',
            boxShadow: [
              '0 0 0 1.5px #4a4a4c','0 0 0 3px #1a1a1a',
              '0 60px 140px rgba(0,0,0,0.95)',
              'inset 0 1px 0 rgba(255,255,255,0.10)',
              'inset 0 -1px 0 rgba(0,0,0,0.5)',
            ].join(', '),
            padding: 3,
          }}>

            {/* Screen */}
            <div className="relative overflow-hidden bg-black" style={{ width:'100%', height:'100%', borderRadius:48 }}>

              {/* Dynamic Island */}
              <div className="absolute z-30 bg-black rounded-full"
                style={{ top:12, left:'50%', transform:'translateX(-50%)', width:120, height:36, boxShadow:'0 0 0 1px #222' }} />

              {/* Glass reflection */}
              <div className="absolute inset-0 pointer-events-none z-20"
                style={{ background:'linear-gradient(130deg,rgba(255,255,255,0.04) 0%,transparent 45%)', borderRadius:48 }} />

              {/* ── CALLING: AvatarCall fills screen ── */}
              {isCalling ? (
                <AvatarCall
                  avatarId={AVATAR_ID}
                  connect={connectAvatar}
                  audio
                  video={false}
                  onError={err => { if (err.message !== 'QUOTA_EXCEEDED') setError(err.message); }}
                  onEnd={() => setIsCalling(false)}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'transparent',
                    display: 'flex', flexDirection: 'column',
                    borderRadius: 0,
                  }}
                >
                  <ActiveCallUI
                    stressLevel={stressLevel}
                    stressColor={stressColor}
                    duration={duration}
                    formatTime={formatTime}
                    error={error}
                    pulse={pulse}
                    onEnd={() => setIsCalling(false)}
                  />
                </AvatarCall>
              ) : (
                /* ── IDLE UI ── */
                <>
                  {/* Status bar */}
                  <div className="absolute top-0 left-0 right-0 z-10 flex justify-between px-8" style={{ paddingTop:54 }}>
                    <span className="text-[10px] font-mono text-white/40">9:41</span>
                    <span className="text-[9px] font-bold tracking-widest text-green-500">ENCRYPTED</span>
                    <span className="text-[10px] font-mono text-white/20">●●●●</span>
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center px-5 pb-6" style={{ paddingTop:96 }}>
                    <div className="w-full flex flex-col items-center gap-4">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ background:'radial-gradient(circle at 35% 35%,#3a3a3a,#1a1a1a)', border:'1px solid #333' }}>
                        <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="18" r="10" fill="#555"/>
                          <path d="M4 46c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="#555"/>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-white text-base tracking-tight">Arjun (AI Recruiter)</p>
                        <p className="text-[10px] text-white/30 mt-0.5">Ready to connect</p>
                      </div>

                      {/* Start button */}
                      <button
                        onClick={() => { setError(null); setIsCalling(true); }}
                        className="w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background:'#22c55e', color:'#000', boxShadow:'0 0 20px rgba(34,197,94,0.35)' }}
                      >
                        Initiate Session
                      </button>

                      {/* Practice modules */}
                      <ul className="w-full space-y-2 mt-1">
                        {practiceModules.map((mod, idx) => (
                          <li
                            key={idx}
                            ref={el => rowsRef.current[idx] = el}
                            className="p-3.5 rounded-xl border border-white/10"
                            style={{
                              background:'rgba(255,255,255,0.03)',
                              opacity:'var(--progress,0)',
                              transform:'scale(calc(1.08 - (0.08 * var(--progress,0)))) translateY(calc(-16px * (1 - var(--progress,0))))',
                              transition:'transform 0.3s ease, opacity 0.3s ease',
                            }}
                          >
                            <h4 className="text-white font-bold text-[11px] mb-0.5">{mod.title}</h4>
                            <p className="text-zinc-500 text-[9px] leading-relaxed">{mod.desc}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>

            <SideButtons />
          </div>
        </div>
      )}

      <div style={{ height: '80vh' }} />
    </div>
  );
}
