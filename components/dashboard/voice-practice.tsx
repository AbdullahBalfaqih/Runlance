import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Timer, 
  ShieldCheck, 
  Activity,
  Zap,
  User,
  Plus,
  AlertCircle
} from 'lucide-react';
import { AvatarCall, AvatarVideo, useLocalMedia } from '@runwayml/avatars-react';

export function VoicePractice() {
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [stressLevel, setStressLevel] = useState(15);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCalling) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
        setStressLevel(prev => {
          const change = Math.random() * 6 - 3;
          return Math.max(5, Math.min(95, prev + change));
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCalling]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    setError(null);
    setIsCalling(true);
  };

  const endCall = () => {
    setIsCalling(false);
  };

  const connectAvatar = useCallback(async (avatarId: string) => {
    try {
      const response = await fetch('/api/avatar/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarId,
          startScript: "Hi there! I'm Arjun. Let's start our voice-only practice session. How are you feeling today?"
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect');
      }
      
      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Call connection error:', err);
      setError(err.message);
      setIsCalling(false);
      throw err;
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="w-full max-w-md aspect-[9/16] bg-[#050505] rounded-[48px] border border-white/10 shadow-2xl overflow-hidden relative flex flex-col">
        {/* Real Audio Connection via AvatarCall */}
        {isCalling && (
          <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
            <AvatarCall
              avatarId="human-resource"
              connect={connectAvatar}
              audio={true}
              video={true}
              onError={(err) => {
                console.error('AvatarCall error:', err);
                setError(err.message);
              }}
            >
                <AvatarVideo />
            </AvatarCall>
          </div>
        )}

        {/* Top Bar */}
        <div className="p-8 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className={error ? 'text-red-500' : 'text-green-500'} />
            <span className="text-[10px] font-bold text-white/40 tracking-wider">
              {error ? 'Connection Failed' : 'Secure Call'}
            </span>
          </div>
          {isCalling && !error && (
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2 animate-in fade-in duration-500">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono text-white/60">{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Profile / Caller ID */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-8 text-center">
          {error ? (
            <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
                  <AlertCircle size={40} />
               </div>
               <h3 className="text-xl font-bold text-white">Quota Exceeded</h3>
               <p className="text-gray-500 text-sm">{error}</p>
               <button onClick={startCall} className="mt-4 text-xs font-bold text-white tracking-widest hover:underline">Try Again</button>
            </div>
          ) : (
            <>
              <div className="relative mb-12">
                {isCalling && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-white/5 animate-ping duration-[3000ms]" />
                    <div className="absolute inset-0 rounded-full bg-white/5 animate-ping duration-[4000ms] delay-700" />
                  </>
                )}
                
                <div className="w-40 h-40 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative z-10">
                  <User size={80} className="text-white/40" />
                  {isCalling && (
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-2xl">
                      <Activity size={20} />
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {isCalling ? 'Arjun (AI Recruiter)' : 'Voice Session'}
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                {isCalling ? 'Connected • Audio Only' : 'Stress-Free Practice Mode'}
              </p>

              {!isCalling && (
                <div className="mt-12 space-y-4 w-full">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left flex items-start gap-3">
                    <Zap size={18} className="text-white mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white tracking-wider mb-1">Stress Shield</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">This mode uses real-time AI to build your verbal confidence through live conversation.</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Metrics Footer */}
        <div className={`px-8 transition-all duration-700 ${isCalling && !error ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl mb-8">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] font-bold text-white/40 tracking-wider">Anxiety Meter</span>
              <span className="text-lg font-bold text-white font-mono">{Math.round(stressLevel)}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 rounded-full ${
                  stressLevel > 70 ? 'bg-red-500' : stressLevel > 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${stressLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="p-12 pt-0 flex flex-col gap-8">
          {isCalling && !error ? (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`aspect-square rounded-full flex flex-col items-center justify-center gap-2 transition-all ${
                  isMuted ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                <span className="text-[8px] font-bold tracking-wider">{isMuted ? 'Muted' : 'Mute'}</span>
              </button>
              <button 
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`aspect-square rounded-full flex flex-col items-center justify-center gap-2 transition-all ${
                  isSpeakerOn ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
                }`}
              >
                <Volume2 size={24} />
                <span className="text-[8px] font-bold tracking-wider">Speaker</span>
              </button>
              <div className="aspect-square rounded-full bg-white/5 text-white flex flex-col items-center justify-center gap-2 opacity-40">
                <Plus size={24} />
                <span className="text-[8px] font-bold tracking-wider">Add</span>
              </div>
            </div>
          ) : null}

          <div className="flex justify-center">
            {isCalling ? (
              <button 
                onClick={endCall}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-500/40 hover:scale-110 active:scale-95 transition-all"
              >
                <PhoneOff size={32} />
              </button>
            ) : (
              <button 
                onClick={startCall}
                className="button2 !py-5 px-12 !rounded-full flex items-center gap-4 !bg-green-500 !text-white shadow-2xl shadow-green-500/20 hover:scale-105"
              >
                <Phone size={24} />
                <span className="font-bold text-lg tracking-tight">Start Practice Call</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute -z-10 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[100px]" />
    </div>
  );
}
