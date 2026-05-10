'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import BorderGlow from '@/components/ui/border-glow';
import { ArrowLeft, Sparkles, Trophy, Timer, History } from 'lucide-react';
import { InterviewCoach } from '@/components/dashboard/interview-coach';
import { GalleryCarousel } from '@/components/ui/gallery-carousel';

export default function InterviewPage() {
  const [isInterviewing, setIsInterviewing] = useState(false);

  const sessions = [
    {
      id: '1',
      title: 'Product Manager Round 1',
      company: 'TechCorp',
      duration: '15 min',
      status: 'completed',
      score: 85,
      date: '2024-01-10',
    },
    {
      id: '2',
      title: 'System Design Interview',
      company: 'StartupXYZ',
      duration: '20 min',
      status: 'completed',
      score: 72,
      date: '2024-01-08',
    },
    {
      id: '3',
      title: 'Behavioral Questions',
      company: 'BigTech',
      duration: '10 min',
      status: 'completed',
      score: 88,
      date: '2024-01-05',
    },
  ];

  if (isInterviewing) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <button 
            onClick={() => setIsInterviewing(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-mono text-xs tracking-widest">Back to Overview</span>
          </button>
        </div>
        <InterviewCoach personaId="a42f41bf-b379-4544-bc19-58f35c489726" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Interview Preparation</h1>
            <p className="text-gray-400">Practice with our AI interviewer powered by Runway</p>
          </div>
          <button 
            onClick={() => setIsInterviewing(true)}
            className="button2 !py-3 px-8"
          >
            Start New Session
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Sessions', value: '5', icon: History },
            { label: 'Avg Score', value: '81%', icon: Trophy },
            { label: 'Time Practiced', value: '85 min', icon: Timer },
          ].map((stat, i) => (
            <BorderGlow
              key={i}
              borderRadius={24}
              backgroundColor="#000000"
              glowColor="0 0 100"
              colors={['#ffffff', '#444444', '#111111']}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3 text-gray-500">
                  <stat.icon size={16} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
                <p className="text-4xl font-bold text-white tracking-tighter">{stat.value}</p>
              </div>
            </BorderGlow>
          ))}
        </div>

        {/* Interview Types Carousel */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Interview Types</h2>
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <Sparkles size={12} className="text-white/40" />
              <span className="text-[10px] font-bold text-white/40 tracking-widest">3D Pipeline Active</span>
            </div>
          </div>
          
          <GalleryCarousel 
            types={[
              {
                title: 'Behavioral Interview',
                description: 'Practice common questions about your experience and skills. Focus on the STAR method and emotional intelligence.',
              },
              {
                title: 'Technical Interview',
                description: 'Deep dive into technical skills and problem-solving. Covers algorithms, system design, and coding patterns.',
              },
              {
                title: 'Case Interview',
                description: 'Learn how to approach and solve complex business case questions with structured frameworks.',
              },
              {
                title: 'Role-Specific',
                description: 'Practice interview questions specifically curated for your target position and industry.',
              },
            ]}
            onStart={() => setIsInterviewing(true)}
          />
        </div>

        {/* Recent Sessions */}
        <div className="pb-12">
          <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Recent Sessions</h2>
          <div className="space-y-4">
            {sessions.map((session) => (
              <BorderGlow
                key={session.id}
                borderRadius={20}
                backgroundColor="#000000"
                glowColor="0 0 100"
                colors={['#ffffff', '#444444', '#111111']}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1 text-lg">{session.title}</h3>
                      <p className="text-gray-500 text-xs font-mono uppercase tracking-wider">
                        {session.company} • {session.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-3xl font-bold text-white tracking-tighter">{session.score}%</span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono">{session.duration}</p>
                      </div>
                      <button className="button2 !py-3 px-8 !bg-transparent border border-white/20 hover:!bg-white/5 !text-white">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

