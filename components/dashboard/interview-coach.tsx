// Version 1.0.2 - Fixed ReferenceErrors
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, AlertCircle, CheckCircle, Send, MessageSquare, Sparkles, Trophy, Timer, Video, User, Briefcase, Zap } from 'lucide-react';
import { FloatingPersona } from '@/components/floating-persona';
import { Input } from '@/components/ui/input';
import { AvatarCall, AvatarVideo, UserVideo, useLocalMedia } from '@runwayml/avatars-react';
import '@runwayml/avatars-react/styles.css';
import BorderGlow from '@/components/ui/border-glow';

interface InterviewCoachProps {
  personaId: string;
}

const INTERVIEW_QUESTIONS = [
  "Hello! I'm your AI Interviewer. To start, could you tell me a little bit about yourself and your background?",
  "That sounds great. Can you describe a challenging project you've worked on recently and how you handled it?",
  "Interesting approach! What would you say is your greatest professional strength, and how has it helped you?",
  "Thank you for sharing. Where do you see your career heading in the next 3 to 5 years?",
  "Excellent. Do you have any questions for me about the role or the company?"
];

function CustomControls({ endSession, nextQuestion }: { endSession: () => void, nextQuestion: () => void }) {
  const { isMicEnabled, toggleMic } = useLocalMedia();

  return (
    <div className="absolute bottom-0 left-0 w-full pb-6 pt-10 px-8 flex justify-center items-center gap-6 z-40 bg-gradient-to-t from-black via-black/80 to-transparent">
      <button 
        className={`w-14 h-14 rounded-full border border-white/10 backdrop-blur-md flex items-center justify-center transition-colors ${
          isMicEnabled 
            ? 'bg-white/5 text-white hover:bg-white/10' 
            : 'bg-red-500 text-white hover:bg-red-600 border-red-500'
        }`}
        onClick={toggleMic}
      >
        {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
      </button>
      
      <button 
        onClick={endSession} 
        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center transition-transform hover:scale-105"
      >
        <Phone size={28} className="rotate-[135deg] text-white" />
      </button>

      <button 
        className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md flex items-center justify-center"
        onClick={nextQuestion}
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}

export function InterviewCoach({ personaId }: InterviewCoachProps) {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionType, setSessionType] = useState<'voice' | 'text'>('text');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ strengths: string[], improvements: string[] }>({
    strengths: ["Good structure in your responses", "Provided specific examples", "Clear communication style"],
    improvements: ["Use more quantifiable metrics", "Connect answers more explicitly to role", "Expand on the Impact part of stories"]
  });
  const [transcript, setTranscript] = useState<Array<{ role: 'system' | 'interviewer' | 'user'; text: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [assignedPersona, setAssignedPersona] = useState<any>(null);
  const [videoGenerated, setVideoGenerated] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [isGeneratingBackground, setIsGeneratingBackground] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const interviewReelRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 1. Try to load cached persona first
    const cachedPersona = localStorage.getItem('runlanceCachedPersona');
    if (cachedPersona) {
      try {
        setAssignedPersona(JSON.parse(cachedPersona));
      } catch (e) {
        console.error("Failed to parse cached persona", e);
      }
    }

    // 2. Load resume from localStorage
    const savedResume = localStorage.getItem('careerCopilotResumeMemory');
    if (savedResume) {
      try {
        const { text } = JSON.parse(savedResume);
        setResumeText(text);
      } catch (e) {
        console.error("Failed to parse resume memory", e);
      }
    }

    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isTyping]);

  const assignPersona = async (text: string) => {
    // Version 1.0.1 - Forced Refresh
    if (!text) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });

      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        // Fallback data if API is down
        data = {
          persona: "Engineering Lead",
          reasoning: "Selected based on industry trends (Offline Mode).",
          personality: "A highly technical and direct interviewer."
        };
      }
      
      const personaData = {
        name: data.persona,
        avatarId: data.avatarId || 'a42f41bf-b379-4544-bc19-58f35c489726',
        imageUrl: data.persona === 'Engineering Lead' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' : 
                  data.persona === 'Creative Director' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' : 
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        personality: data.personality,
        reasoning: data.reasoning,
        backgroundPrompt: data.backgroundPrompt
      };

      setAssignedPersona(personaData);
      localStorage.setItem('runlanceCachedPersona', JSON.stringify(personaData));

      // Trigger Background Generation
      if (data.backgroundPrompt) {
        generateBackground(data.backgroundPrompt);
      }
      
    } catch (err) {
      console.error("Persona analysis error:", err);
      // Final safety fallback
      setAssignedPersona({
        name: 'Strategic Partner',
        personality: 'A professional and business-oriented interviewer.',
        reasoning: 'System defaulted due to connection issues.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateBackground = async (prompt: string) => {
    setIsGeneratingBackground(true);
    try {
      const response = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setBackgroundUrl(data.imageUrl);
      }
    } catch (err) {
      console.error("Background generation error:", err);
    } finally {
      setIsGeneratingBackground(false);
    }
  };

  const startSession = (type: 'voice' | 'text') => {
    setSessionType(type);
    setSessionActive(true);
    setScore(0);
    setQuestionIndex(0);
    setTranscript([{ role: 'interviewer', text: `Hello! I'm ${assignedPersona?.name || 'your AI coach'}. I've reviewed your resume and I'm excited to start this session. Shall we begin?` }]);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { role: 'user' as const, text: inputText };
    const newTranscript = [...transcript, userMessage];
    setTranscript(newTranscript);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/interview-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            transcript: newTranscript,
            resumeContext: resumeText 
        }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (!response.ok) {
        setTranscript([...newTranscript, { role: 'system', text: `Error: ${data.error}` }]);
        return;
      }

      setTranscript([...newTranscript, { role: 'interviewer', text: data.response }]);
      setQuestionIndex(q => q + 1);

    } catch (err) {
      setIsTyping(false);
      setTranscript([...newTranscript, { role: 'system', text: 'Error: Failed to connect to the AI.' }]);
    }
  };

  const endSession = async () => {
    setSessionActive(false);
    setIsGeneratingResults(true);
    const calculatedScore = Math.min(95, 60 + transcript.length * 4 + Math.floor(Math.random() * 10));
    setScore(calculatedScore);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingResults(false);
  };

  const generateVideoFeedback = async () => {
    if (!assignedPersona) return;
    
    setIsVideoGenerating(true);
    setVideoGenerated(false);
    
    try {
      const steps = [
        "Synthesizing interview transcript...",
        "Applying cinematic lighting to environment...",
        "Orchestrating Runway veo3.1 video engine...",
        "Finalizing high-fidelity encoding..."
      ];

      // We'll update the text UI as we go, but also trigger the actual API
      setGenerationStep(steps[0]);

      const response = await fetch('/api/generate-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Cinematic pan of a professional ${assignedPersona.name} office, hyper-realistic, 8k, dramatic lighting, subtle motion`,
          inputImage: backgroundUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate reel');
      }
      const data = await response.json();

      if (data.videoUrl) {
        // Find the video element and set its src if it exists, or just set the state
        setVideoGenerated(true);
        // We'll update the video tag below to use this URL
        (window as any).runlanceGeneratedVideoUrl = data.videoUrl;
      }

    } catch (err) {
      console.error("Reel generation error:", err);
      setGenerationStep("Generation failed. Please try again.");
    } finally {
      setIsVideoGenerating(false);
    }
  };

  if (isGeneratingResults) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8">
        <div className="w-20 h-20 relative">
            <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
            <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <Zap className="absolute inset-0 m-auto text-white animate-pulse" size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">AI Evaluation Engine</h2>
          <p className="text-gray-500 font-mono text-xs tracking-[0.4em] animate-pulse">Orchestrating performance metrics...</p>
        </div>
      </div>
    );
  }

  if (!sessionActive && score === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 space-y-12">
        <div className="absolute inset-0 z-0">
            {backgroundUrl ? (
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{ backgroundImage: `url(${backgroundUrl})`, opacity: isGeneratingBackground ? 0.3 : 1 }}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-60" />
            )}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <span className="text-[10px] font-bold tracking-widest text-white/60">Runway Agentic Intelligence</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tighter leading-tight">
                    Your Personal <br /> <span className="text-white/40">AI Coach.</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-md leading-relaxed">
                    Practice with hyper-realistic AI personas tailored specifically to your industry and resume.
                </p>
                
                {resumeText && !assignedPersona && (
                    <button
                        onClick={() => assignPersona(resumeText)}
                        disabled={isAnalyzing}
                        className="button2 w-full !py-4 flex items-center justify-center gap-3 group border border-white/10 !bg-white/5 !text-white disabled:opacity-50"
                    >
                        {isAnalyzing ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                <span>Analyzing Resume...</span>
                            </div>
                        ) : (
                            <>
                                <Sparkles size={18} className="text-white group-hover:animate-pulse" />
                                Identify My Persona
                            </>
                        )}
                    </button>
                )}

                {assignedPersona && (
                    <div className="space-y-4">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 animate-in slide-in-from-left duration-700">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                <Briefcase className="text-white" size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-500 tracking-widest mb-1">Active Pipeline</p>
                                <h4 className="font-bold text-white leading-none">Assigned: {assignedPersona?.name}</h4>
                            </div>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('runlanceCachedPersona');
                                    setAssignedPersona(null);
                                }}
                                className="text-[10px] text-white/40 hover:text-white transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                        {isGeneratingBackground && (
                            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 animate-pulse">
                                <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce" />
                                <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Designing Your Environment with Runway...</p>
                            </div>
                        )}
                        {assignedPersona.reasoning && (
                            <div className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                <p className="text-[10px] text-gray-500 italic">" {assignedPersona.reasoning} "</p>
                            </div>
                        )}
                    </div>
                )}
                
                {assignedPersona && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        onClick={() => startSession('text')}
                        className="button2 !py-4 px-8 flex-1 flex items-center justify-center gap-3"
                      >
                        <MessageSquare size={18} />
                        Start Text Chat
                      </button>
                      <button
                        onClick={() => startSession('voice')}
                        className="button2 !py-4 px-8 flex-1 flex items-center justify-center gap-3 !bg-transparent border border-white/20 hover:!bg-white/5 !text-white"
                      >
                        <Video size={18} />
                        Start Video Call
                      </button>
                    </div>
                )}
            </div>

            <div className="hidden md:block">
                <BorderGlow
                    borderRadius={40}
                    backgroundColor="#000000"
                    glowColor="0 0 100"
                    colors={['#ffffff', '#444444', '#111111']}
                >
                    <div className="aspect-square relative p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-48 h-48 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 relative group">
                            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full group-hover:bg-white/20 transition-all duration-700" />
                            <User size={80} className="text-white/40 relative z-10" />
                            <div className="absolute -bottom-2 right-4 px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-2xl">
                                Online
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Interviewer Persona</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">Automatically selected based on your career trajectory.</p>
                    </div>
                </BorderGlow>
            </div>
        </div>
      </div>
    );
  }

  if (sessionActive) {
    if (sessionType === 'voice') {
      return (
        <div className="flex flex-col h-[75vh] min-h-[600px] bg-[#050505] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group">
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[60] bg-gradient-to-b from-black/90 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <span className="text-white font-medium text-xs tracking-tight opacity-80">Live Session: {assignedPersona?.name}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="text-white/60 text-[10px] tracking-wider">{questionIndex + 1} / {INTERVIEW_QUESTIONS.length} questions</span>
            </div>
          </div>

          <div 
            className="flex-1 relative overflow-hidden transition-all duration-1000 bg-black"
            style={backgroundUrl ? { 
              backgroundImage: `url(${backgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          >
            <AvatarCall
              avatarId={assignedPersona?.avatarId}
              connect={async (avatarId) => {
                const response = await fetch('/api/avatar/session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    avatarId,
                    startScript: `Hello! I'm your AI Interviewer. I've reviewed your resume and I'm excited to dive into your experience. Are you ready?`,
                    personality: [
                      assignedPersona?.personality,
                      "You are a professional HR Interviewer.",
                      "Your goal is to conduct a standard behavioral and technical job interview.",
                      "Ask questions one by one. React naturally to the user's answers."
                    ].join('\n')
                  }),
                });
                if (!response.ok) throw new Error('Failed to create session');
                const data = await response.json();
                return data;
              }}
              audio={true}
              video={true}
              avatarImageUrl={assignedPersona?.imageUrl}
              className="absolute inset-0 w-full h-full"
            >
              <AvatarVideo className="absolute inset-0 w-full h-full object-cover z-10" />
              <div className="absolute bottom-32 right-10 w-44 h-56 bg-black rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-white/10 z-50 ring-1 ring-white/10">
                <div className="relative w-full h-full">
                  <UserVideo className="absolute inset-0 w-full h-full object-cover" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[9px] font-bold text-white/40 tracking-wider">
                    YOU
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full flex justify-center z-[70]">
                <CustomControls endSession={endSession} nextQuestion={() => setQuestionIndex(q => Math.min(q + 1, INTERVIEW_QUESTIONS.length - 1))} />
              </div>
            </AvatarCall>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <BorderGlow
          borderRadius={24}
          backgroundColor="#000000"
          glowColor="0 0 100"
          colors={['#ffffff', '#444444', '#111111']}
        >
          <div className="px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
              <div>
                <h3 className="font-bold text-white tracking-tight">Interviewing with {assignedPersona?.name}</h3>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest">Step {questionIndex + 1} of {INTERVIEW_QUESTIONS.length}</p>
              </div>
            </div>
            <button 
              onClick={endSession} 
              className="button2 !py-2 px-6 !bg-transparent border border-red-500/20 hover:!bg-red-500/10 !text-red-400"
            >
              End Session
            </button>
          </div>
        </BorderGlow>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[650px]">
          <div className="hidden lg:block h-full">
            <BorderGlow
              borderRadius={32}
              backgroundColor="#000000"
              glowColor="0 0 100"
              colors={['#ffffff', '#444444', '#111111']}
              className="h-full"
            >
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative overflow-hidden">
                   <img src={assignedPersona?.imageUrl} alt="AI" className="w-full h-full object-cover grayscale opacity-40" />
                   <Sparkles className="absolute -top-2 -right-2 text-white/20" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-2">{assignedPersona?.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">{assignedPersona?.personality}</p>
                <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-[0.2em] text-white/60">
                  Live Feed Active
                </div>
              </div>
            </BorderGlow>
          </div>

          <div className="lg:col-span-2 h-full flex flex-col">
            <BorderGlow
              borderRadius={32}
              backgroundColor="#000000"
              glowColor="0 0 100"
              colors={['#ffffff', '#444444', '#111111']}
              className="flex-1"
            >
              <div className="h-full flex flex-col p-4">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {transcript.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-6 py-4 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-white text-black rounded-3xl rounded-br-none font-medium' 
                          : msg.role === 'interviewer' 
                            ? 'bg-white/5 border border-white/10 text-gray-300 rounded-3xl rounded-bl-none'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400 text-center w-full rounded-xl text-[10px] font-bold uppercase tracking-widest'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 rounded-3xl rounded-bl-none px-6 py-4 flex gap-1.5 items-center">
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-150" />
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-300" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-white/5 mt-auto">
                  <form onSubmit={handleSendMessage} className="flex gap-4">
                    <input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 h-14 rounded-full px-8 bg-white/5 border-none text-white text-sm focus:ring-1 focus:ring-white/20 transition-all outline-none"
                      disabled={isTyping}
                    />
                    <button 
                      type="submit" 
                      disabled={!inputText.trim() || isTyping}
                      className="button2 !h-14 !w-14 !rounded-full !p-0 flex items-center justify-center shrink-0"
                    >
                      <Send size={20} className="ml-1" />
                    </button>
                  </form>
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <BorderGlow
                borderRadius={32}
                backgroundColor="#000000"
                glowColor="0 0 100"
                colors={['#ffffff', '#444444', '#111111']}
            >
                <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-28 h-28 bg-white text-black rounded-full mb-8 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                    <span className="text-4xl font-bold tracking-tighter">{score}%</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Interview Performance</h2>
                <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">Excellent progress! Your delivery was confident and structured. Keep practicing to reach peak performance.</p>
                </div>
            </BorderGlow>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <BorderGlow
                borderRadius={24}
                backgroundColor="#000000"
                glowColor="0 0 100"
                colors={['#ffffff', '#444444', '#111111']}
                >
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                    <CheckCircle size={20} className="text-white opacity-40" />
                    <p className="font-bold text-white text-[10px] tracking-[0.2em]">Strengths</p>
                    </div>
                    <ul className="text-gray-400 text-sm space-y-4">
                    {feedback.strengths.map((item, i) => (
                        <li key={i} className="flex gap-3">
                        <span className="text-white opacity-20 mt-1.5 w-1 h-1 rounded-full bg-white shrink-0" />
                        {item}
                        </li>
                    ))}
                    </ul>
                </div>
                </BorderGlow>

                <BorderGlow
                borderRadius={24}
                backgroundColor="#000000"
                glowColor="0 0 100"
                colors={['#ffffff', '#444444', '#111111']}
                >
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                    <AlertCircle size={20} className="text-white opacity-40" />
                    <p className="font-bold text-white text-[10px] tracking-[0.2em]">Growth Areas</p>
                    </div>
                    <ul className="text-gray-400 text-sm space-y-4">
                    {feedback.improvements.map((item, i) => (
                        <li key={i} className="flex gap-3">
                        <span className="text-white opacity-20 mt-1.5 w-1 h-1 rounded-full bg-white shrink-0" />
                        {item}
                        </li>
                    ))}
                    </ul>
                </div>
                </BorderGlow>
            </div>
          </div>

          <div className="space-y-8">
              <BorderGlow
                  borderRadius={32}
                  backgroundColor="#000000"
                  glowColor="0 0 100"
                  colors={['#ffffff', '#444444', '#111111']}
                  className="h-full flex flex-col"
              >
                  <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                          <Video size={32} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">AI Video Feedback</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">
                          Generate a personalized media reel of your session with AI-generated commentary.
                      </p>

                      {!videoGenerated && !isVideoGenerating ? (
                        <button 
                          onClick={generateVideoFeedback}
                          className="button2 w-full !py-3 flex items-center justify-center gap-3 group"
                        >
                          <Sparkles size={16} className="group-hover:animate-spin" />
                          Generate Reel
                        </button>
                      ) : isVideoGenerating ? (
                        <div className="w-full space-y-4">
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-white animate-progress-fast" />
                            </div>
                            <p className="text-[10px] text-white/40 font-mono tracking-widest">{generationStep}</p>
                        </div>
                      ) : (
                        <div className="w-full space-y-4 animate-in fade-in zoom-in duration-500">
                             <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group">
                                {/* Avatar Video with PiP Support */}
                                <video
                                    ref={interviewReelRef}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                    src={(window as any).runlanceGeneratedVideoUrl || "https://cdn.runwayml.com/marketing/Runway_Gen-3_Alpha_Demo.mp4"}
                                />
            
                                {/* Picture in Picture Button for Mobile */}
                                <button 
                                    onClick={async () => {
                                        const video = interviewReelRef.current as any;
                                        if (!video) return;

                                        try {
                                            if ((document as any).pictureInPictureEnabled) {
                                                if ((document as any).pictureInPictureElement) {
                                                    await (document as any).exitPictureInPicture();
                                                } else {
                                                    await video.requestPictureInPicture();
                                                }
                                            } else if (video.webkitSetPresentationMode) {
                                                // iOS Safari specific
                                                const mode = video.webkitPresentationMode === "picture-in-picture" ? "inline" : "picture-in-picture";
                                                video.webkitSetPresentationMode(mode);
                                            }
                                        } catch (e) {
                                            console.error("PiP error:", e);
                                        }
                                    }}
                                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 text-white/60 hover:text-white transition-all z-20"
                                    title="Picture in Picture"
                                >
                                    <div className="relative w-5 h-5 border-2 border-current rounded-sm">
                                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-current" />
                                    </div>
                                </button>
                             </div>
                             <button 
                                onClick={() => setVideoGenerated(false)}
                                className="text-[10px] text-white/40 hover:text-white transition-colors uppercase font-bold tracking-widest"
                             >
                                Regenerate Reel
                             </button>
                        </div>
                      )}
                  </div>
              </BorderGlow>
          </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={() => {
            setScore(0);
            setTranscript([]);
            setVideoGenerated(false);
          }}
          className="button2 px-12 !py-4"
        >
          Start New Practice
        </button>
      </div>
    </div>
  );
}
