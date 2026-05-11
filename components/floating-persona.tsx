'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AvatarCall, AvatarVideo, ControlBar } from '@runwayml/avatars-react';
import { X, MessageCircle, MonitorUp, Mic, Video, Sparkles } from 'lucide-react';
import { AvatarSessionInspector } from '@/components/avatar/avatar-session-inspector';
import { Button } from '@/components/ui/button';
import type { CompatibilityAnalysis, Persona } from '@/lib/types';

type Props = {
  persona: Persona;
  analysis: CompatibilityAnalysis;
};

export function FloatingPersona({ persona, analysis }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [speaking, setSpeaking] = useState(true);
  const [liveAvatar, setLiveAvatar] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [resumeMemory, setResumeMemory] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const [size, setSize] = useState({ width: 420, height: 400 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const [jobInputMode, setJobInputMode] = useState(false);
  const [jobText, setJobText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);
  const videoContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const video = node.querySelector('video');
      if (video) {
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
      }
    }
  }, []);

  const triggerPiP = async () => {
    const video = document.querySelector('.runlance-avatar-container video') as any;
    if (!video) return;

    try {
      if ((document as any).pictureInPictureEnabled) {
        if ((document as any).pictureInPictureElement) {
          await (document as any).exitPictureInPicture();
        } else {
          await video.requestPictureInPicture();
        }
      } else if (video.webkitSetPresentationMode) {
        const mode = video.webkitPresentationMode === "picture-in-picture" ? "inline" : "picture-in-picture";
        video.webkitSetPresentationMode(mode);
      }
    } catch (e) {
      console.error("Assistant PiP error:", e);
    }
  };

  const phrase = useMemo(() => {
    if (!speaking) return 'Paused. I am still watching the role context.';
    
    if (!resumeMemory) {
      return "Hello! I'm your System Career Analyst. Please upload your resume in the dashboard so I can begin the analysis for you.";
    }
    
    return "I've completed the system analysis of your resume. Click 'Analyze My Resume' to hear the findings, or just ask me anything!";
  }, [analysis.spokenSummary, speaking, resumeMemory]);

  const connectAvatar = useCallback(async (avatarId: string) => {
    // startScript is what the avatar SPEAKS when starting. Must be < 2000 chars.
    const startScript = autoAnalyze
      ? "I have analyzed your resume. Let's discuss your experience and how we can improve it."
      : (!resumeMemory 
          ? "Hello! I am your AI Career Analyst. Please upload your resume in the dashboard so I can provide you with a detailed system analysis and career advice." 
          : "I've reviewed your resume. I'm ready to discuss my findings whenever you are.");

    // personality is the SYSTEM PROMPT instructing the AI how to behave and its context.
    const systemPrompt = [
      persona.personality,
      'You are a Professional System Career Analyst.',
      'Your task is to analyze the RAW RESUME TEXT provided below.',
      'Do not invent details. Read the actual experience, skills, and projects from the raw text.',
      autoAnalyze ? 'COMMAND: The user has requested a direct vocal analysis. Provide a detailed breakdown of their experience and skills based ON THE TEXT, and offer specific improvements.' : '',
      'Use the resume memory below as your source of truth.',
      resumeMemory 
        ? `--- RESUME MEMORY ---\n${resumeMemory.slice(0, 8000)}` 
        : 'Resume memory is not available yet.',
      jobText
        ? `--- JOB DESCRIPTION TO ANALYZE ---\n${jobText}`
        : ''
    ].join('\n');

    const response = await fetch('/api/avatar/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        avatarId,
        personality: systemPrompt,
        startScript,
        userContext: {
          mode: screenStream ? 'screen-share-job-reading' : 'voice-career-companion',
          hasResumeMemory: Boolean(resumeMemory)
        }
      })
    });
    const data = await response.json().catch(() => ({}));

    if (response.status === 429 && (data as any).quotaExceeded) {
      setLiveAvatar(false);
      setAvatarError('Daily session limit reached. Please try again tomorrow.');
      throw new Error('QUOTA_EXCEEDED');
    }

    if (!response.ok) {
      throw new Error((data as any).error || `Failed to connect: ${response.status}`);
    }
    return data;
  }, [persona.personality, resumeMemory, screenStream]);

  useEffect(() => {
    const loadMemory = () => {
      const stored = window.localStorage.getItem('careerCopilotResumeMemory');
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored) as { text?: string };
        if (parsed.text) {
          setResumeMemory(parsed.text);
          // Automatically open and prompt to start when a new resume is uploaded
          setIsOpen(true);
        }
      } catch {
        setResumeMemory('');
      }
    };

    loadMemory();
    window.addEventListener('resumeMemoryUpdated', loadMemory);
    
    // Set initial position to bottom-right
    if (!initialized) {
      setPosition({
        x: window.innerWidth - 440,
        y: window.innerHeight - 520
      });
      setInitialized(true);
    }

    return () => window.removeEventListener('resumeMemoryUpdated', loadMemory);
  }, [initialized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) {
      return;
    }
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.width)),
        y: Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    const handleResize = (e: MouseEvent) => {
      if (!isResizing) return;
      setSize(prev => ({
        width: Math.max(320, Math.min(e.clientX - position.x, 800)),
        height: Math.max(300, Math.min(e.clientY - position.y, 800)),
      }));
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position]);

  async function startWithScreenShare() {
    setAvatarError(null);
    try {
      if (!navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen sharing is not supported on mobile devices. Please use a desktop browser.');
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      stream.getVideoTracks()[0]?.addEventListener('ended', () => setScreenStream(null));
      setScreenStream(stream);
      setLiveAvatar(true);
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : 'Screen sharing was cancelled');
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-foreground hover:bg-foreground/90 text-background shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
          aria-label="Open career coach"
          title="Open AI Career Coach"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <aside 
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: isResizing ? `${size.height}px` : 'auto',
            maxHeight: '90vh',
            zIndex: 50,
          }}
          className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-4 select-none"
        >
          {/* Header */}
          <div
            onMouseDown={handleMouseDown}
            className="relative border-b border-white/10 p-5 cursor-move"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden">
                  <img src="/logo-white.png" alt="Runlance" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em]">Runlance</p>
                  <h3 className="text-base font-display font-bold text-white tracking-tight">Runlance Assistant</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {liveAvatar && (
                  <button
                    onClick={triggerPiP}
                    data-no-drag
                    className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all"
                    title="Picture in Picture"
                  >
                    <div className="relative w-4 h-4 border-2 border-current rounded-sm">
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-current" />
                    </div>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setLiveAvatar(false);
                  }}
                  data-no-drag
                  className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {liveAvatar ? (
            <div className="space-y-4 p-4">
              <AvatarCall
                avatarId={persona.avatarId}
                connect={connectAvatar}
                audio
                video={false}
                initialScreenStream={screenStream ?? undefined}
                avatarImageUrl={persona.imageUrl}
                onError={(error) => { if (error.message !== 'QUOTA_EXCEEDED') setAvatarError(error.message); }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div ref={videoContainerRef} className="flex-grow relative overflow-hidden rounded-2xl bg-black/40 runlance-avatar-container">
                  <AvatarVideo className="w-full h-full object-cover" />
                </div>
                <div className="border-t border-white/10 bg-black/90 p-4 flex justify-center custom-control-bar">
                  <ControlBar showCamera={false} showScreenShare />
                </div>
              </AvatarCall>
              {avatarError && (
                <p className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs leading-5 text-rose-300">
                  Session note: {avatarError}
                </p>
              )}
              <button 
                className="button2 w-full flex justify-center py-4" 
                onClick={() => setLiveAvatar(false)}
              >
                Return to compact view
              </button>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white leading-relaxed">
                <p className="text-[14px] opacity-90">{phrase}</p>
              </div>

              <div className="space-y-2">
                <button 
                  className="button2 w-full flex items-center justify-center gap-2 !py-3 !text-xs"
                  data-no-drag
                  onClick={async () => {
                    setAutoAnalyze(false);
                    setLiveAvatar(true);
                  }}
                >
                  <Mic size={14} />
                  Start Runlance Coach
                </button>
                
                <button 
                  className="button2 w-full flex items-center justify-center gap-2 !py-3 !text-xs"
                  data-no-drag
                  onClick={async () => {
                    if (!resumeMemory) {
                      // No resume — guide the user instead of launching session
                      return;
                    }
                    setAutoAnalyze(true);
                    setLiveAvatar(true);
                  }}
                >
                  <Sparkles size={14} />
                  Analyze My Resume
                </button>
                {!resumeMemory && (
                  <p className="text-[10px] text-amber-400/80 text-center leading-relaxed px-1">
                    📎 Please upload your resume in the{' '}
                    <a
                      href="/dashboard"
                      className="underline underline-offset-2 text-amber-300 hover:text-amber-200"
                      data-no-drag
                    >
                      dashboard
                    </a>
                    {' '}first to enable analysis.
                  </p>
                )}

                {jobInputMode ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <textarea
                      value={jobText}
                      onChange={(e) => setJobText(e.target.value)}
                      placeholder="Paste job description or requirements here..."
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20"
                      data-no-drag
                    />
                    <div className="flex gap-2">
                      <button 
                        className="button2 flex-1 !py-2 !text-[10px]"
                        data-no-drag
                        onClick={() => {
                          setJobInputMode(false);
                          setLiveAvatar(true);
                        }}
                      >
                        Analyze Now
                      </button>
                      <button 
                        className="button2 flex-1 !py-2 !text-[10px] !bg-transparent border border-white/10"
                        data-no-drag
                        onClick={() => setJobInputMode(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      className="button2 flex items-center justify-center gap-2 !py-2.5 !text-[10px]"
                      data-no-drag
                      onClick={() => isMobile ? setJobInputMode(true) : startWithScreenShare()}
                    >
                      <MonitorUp size={12} />
                      {isMobile ? 'Analyze Job' : 'Share Screen'}
                    </button>
                    <button 
                      className="button2 flex items-center justify-center gap-2 !py-2.5 !text-[10px]"
                      data-no-drag
                      onClick={() => setSpeaking(!speaking)}
                    >
                      {speaking ? <Mic size={12} /> : <Mic size={12} className="text-rose-500" />}
                      {speaking ? 'Mute AI' : 'Unmute AI'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resize Handle */}
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center group z-50"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/20 group-hover:bg-foreground/40 transition-colors" />
          </div>
        </aside>
      )}
    </>
  );
}
