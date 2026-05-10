"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Screen: Call ─── */
function CallScreen() {
  const [ring, setRing] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setRing((p) => !p), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between h-full py-6 px-5 bg-black text-white select-none">
      {/* status bar */}
      <div className="w-full flex justify-between text-[10px] text-white/40 font-mono pt-8">
        <span>9:41</span>
        <span>●●●</span>
      </div>

      {/* avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-[88px] h-[88px] rounded-full bg-zinc-800 flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="18" r="10" fill="#555" />
              <path d="M4 46c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="#555" />
            </svg>
          </div>
          {/* pulse ring */}
          <span
            className="absolute inset-0 rounded-full border border-white/20 transition-all duration-700"
            style={{ transform: ring ? "scale(1.35)" : "scale(1)", opacity: ring ? 0 : 0.5 }}
          />
          {/* waveform badge */}
          <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </span>
        </div>
        <div className="text-center">
          <p className="font-bold text-[18px] tracking-tight">Arjun (AI Recruiter)</p>
          <p className="text-[11px] text-white/40 mt-0.5">Connected · Audio Only</p>
        </div>
      </div>

      {/* anxiety meter */}
      <div className="w-full bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <div className="flex justify-between mb-2">
          <span className="text-[9px] font-mono tracking-[0.15em] text-zinc-500 uppercase">Anxiety Meter</span>
          <span className="text-[15px] font-bold">21%</span>
        </div>
        <div className="h-[5px] bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: "21%" }} />
        </div>
      </div>

      {/* controls */}
      <div className="w-full space-y-3">
        <div className="flex justify-around">
          {[
            { label: "MUTE", path: "M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3zm7 9v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" },
            { label: "SPEAKER", path: "M11 5 6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" },
            { label: "ADD", path: "M12 5v14M5 12h14" },
          ].map(({ label, path }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-[60px] h-[60px] rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={path} />
                </svg>
              </div>
              <span className="text-[8px] font-mono tracking-widest text-zinc-500">{label}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="w-[60px] h-[60px] rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1-.22 1.1.37 2.3.57 3.6.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C9.61 21 3 14.39 3 6c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.32.2 2.52.57 3.6.1.33.03.73-.22 1l-2.25 2.2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Screen: Live Metrics ─── */
function MetricsScreen() {
  const metrics = [
    { label: "Voice Clarity", value: 88, color: "#22c55e" },
    { label: "Confidence", value: 74, color: "#3b82f6" },
    { label: "Pace", value: 91, color: "#a855f7" },
    { label: "Anxiety Level", value: 21, color: "#ef4444" },
  ];
  return (
    <div className="flex flex-col h-full bg-black text-white px-5 py-6 select-none">
      <div className="flex justify-between text-[10px] text-white/40 font-mono pt-8 mb-4">
        <span>9:41</span><span>Live Session</span>
      </div>
      <p className="text-[16px] font-bold mb-4 tracking-tight">Real-time Analysis</p>
      <div className="space-y-3 flex-1">
        {metrics.map((m) => (
          <div key={m.label} className="bg-zinc-900 rounded-xl p-3.5 border border-zinc-800">
            <div className="flex justify-between mb-2">
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">{m.label}</span>
              <span className="text-[12px] font-bold" style={{ color: m.color }}>{m.value}%</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="text-center text-[9px] text-zinc-600 font-mono mt-3">● RECORDING IN PROGRESS</div>
    </div>
  );
}

/* ─── Screen: Match Score ─── */
function ScoreScreen() {
  const bars = [
    { label: "Skills Match", v: 95 },
    { label: "Experience", v: 78 },
    { label: "Culture Fit", v: 84 },
  ];
  return (
    <div className="flex flex-col h-full bg-black text-white px-5 py-6 select-none">
      <div className="flex justify-between text-[10px] text-white/40 font-mono pt-8 mb-4">
        <span>9:41</span><span>Match Report</span>
      </div>
      <p className="text-[16px] font-bold mb-2 tracking-tight">Job Compatibility</p>
      <div className="flex justify-center py-4">
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#27272a" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8"
              strokeDasharray="251.2" strokeDashoffset="32.6" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-black leading-none">87%</span>
            <span className="text-[8px] text-zinc-400 font-mono uppercase mt-0.5">Match</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-3 bg-zinc-900 rounded-xl px-3.5 py-3 border border-zinc-800">
            <span className="text-[10px] text-zinc-400 font-mono w-20 shrink-0">{b.label}</span>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${b.v}%` }} />
            </div>
            <span className="text-[11px] font-bold w-8 text-right">{b.v}%</span>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900 border border-green-900/50 rounded-xl p-3 mt-3 text-center">
        <p className="text-[11px] text-green-400 font-mono">✓ Strong Match — Apply Now</p>
      </div>
    </div>
  );
}

/* ─── Side buttons (decorative) ─── */
function SideButtons() {
  return (
    <>
      {/* Volume buttons left */}
      {[58, 98, 138].map((top, i) => (
        <div
          key={i}
          className="absolute rounded-l-sm"
          style={{
            left: -4,
            top,
            width: 4,
            height: i === 0 ? 26 : 44,
            background: "linear-gradient(to right, #4a4a4c, #3a3a3c)",
            boxShadow: "-1px 0 1px #111",
          }}
        />
      ))}
      {/* Power button right */}
      <div
        className="absolute rounded-r-sm"
        style={{
          right: -4,
          top: 118,
          width: 4,
          height: 64,
          background: "linear-gradient(to left, #4a4a4c, #3a3a3c)",
          boxShadow: "1px 0 1px #111",
        }}
      />
    </>
  );
}

/* ─── Main Component ─── */
const SLIDE_DATA = [
  { id: "call", label: "AI Calls You", screen: <CallScreen /> },
  { id: "metrics", label: "Live Coaching", screen: <MetricsScreen /> },
  { id: "score", label: "Match Report", screen: <ScoreScreen /> },
];

export function PhoneShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const h = sectionRef.current.offsetHeight;
      const wh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (-rect.top + wh * 0.15) / (h - wh * 0.7)));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalSlides = SLIDE_DATA.length;
  const slideIndex = Math.min(totalSlides - 1, Math.floor(progress * totalSlides));
  const slideProgress = (progress * totalSlides) % 1;

  return (
    <section ref={sectionRef} className="relative bg-black" style={{ minHeight: "320vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 px-6 max-w-6xl w-full mx-auto">
          {/* ── Text ── */}
          <div className="flex-1 text-white space-y-8 text-center lg:text-left">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-white/30">
              <span className="w-8 h-px bg-white/20" />
              In your pocket
            </span>
            <h2 className="text-5xl lg:text-6xl font-display tracking-tight leading-[0.92]">
              Practice like it&apos;s<br />
              <span className="text-white/30">the real thing.</span>
            </h2>
            <p className="text-base text-white/40 leading-relaxed max-w-sm mx-auto lg:mx-0">
              Our AI recruiter calls you. You answer. Real-time feedback, voice coaching, and instant job match analysis — all in one session.
            </p>

            {/* slide dots */}
            <div className="space-y-3">
              {SLIDE_DATA.map((slide, i) => (
                <div
                  key={slide.id}
                  className="flex items-center gap-3 transition-opacity duration-500"
                  style={{ opacity: i === slideIndex ? 1 : 0.25 }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                    style={{ backgroundColor: i === slideIndex ? "#fff" : "#555" }}
                  />
                  <span className="text-sm font-mono text-white/60">{slide.label}</span>
                  {i === slideIndex && (
                    <div className="flex-1 h-px bg-white/10 overflow-hidden max-w-[120px]">
                      <div
                        className="h-full bg-white/40"
                        style={{ width: `${slideProgress * 100}%`, transition: "width 0.1s linear" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── iPhone Frame ── */}
          <div className="shrink-0" style={{ perspective: 1200 }}>
            <div
              style={{
                transform: `rotateY(${-6 + progress * 5}deg) rotateX(${1.5 - progress * 1.5}deg)`,
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {/* outer shell */}
              <div
                className="relative"
                style={{
                  width: 290,
                  height: 590,
                  borderRadius: 46,
                  background: "linear-gradient(150deg, #3a3a3c 0%, #1c1c1e 50%, #111 100%)",
                  boxShadow:
                    "0 0 0 1.5px #4a4a4c, 0 0 0 3px #1a1a1a, 0 50px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)",
                  padding: 3,
                }}
              >
                {/* screen */}
                <div
                  className="relative overflow-hidden bg-black"
                  style={{ width: "100%", height: "100%", borderRadius: 44 }}
                >
                  {/* Dynamic Island */}
                  <div
                    className="absolute z-30 bg-black rounded-full"
                    style={{
                      top: 12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 114,
                      height: 34,
                      boxShadow: "0 0 0 1px #222",
                    }}
                  />

                  {/* Slides */}
                  {SLIDE_DATA.map((slide, i) => (
                    <div
                      key={slide.id}
                      className="absolute inset-0"
                      style={{
                        opacity: i === slideIndex ? 1 : 0,
                        transform:
                          i === slideIndex
                            ? "translateY(0) scale(1)"
                            : i < slideIndex
                            ? "translateY(-16px) scale(0.97)"
                            : "translateY(24px) scale(0.97)",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                      }}
                    >
                      {slide.screen}
                    </div>
                  ))}

                  {/* glass reflection */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(130deg, rgba(255,255,255,0.045) 0%, transparent 45%)",
                      borderRadius: 44,
                    }}
                  />
                </div>

                <SideButtons />
              </div>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        {progress < 0.04 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest">SCROLL</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
