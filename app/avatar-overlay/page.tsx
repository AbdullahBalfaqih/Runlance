"use client";

import { FloatingPersona } from '@/components/floating-persona';
import { useEffect, useState } from 'react';

export default function AvatarOverlayPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add a class to body to make it transparent
    document.body.style.background = 'transparent';
  }, []);

  const defaultPersona = {
    name: 'Career Coach',
    avatarId: process.env.NEXT_PUBLIC_RUNWAY_AVATAR_ID || 'a42f41bf-b379-4544-bc19-58f35c489726',
    imageUrl: 'https://cdn.runwayml.com/avatars/default.png',
    personality: 'You are a professional career coach. Be encouraging, insightful, and provide actionable feedback.'
  };

  const defaultAnalysis = {
    score: 85,
    spokenSummary: 'Your background aligns well with this role. Your 5 years of experience matches their requirements perfectly.',
    strengths: ['5+ years experience', 'React expertise', 'Leadership skills', 'Remote work experience'],
    gaps: ['AWS certification', 'Machine learning basics'],
    jobTitle: 'Senior Frontend Engineer',
    company: 'TechCorp'
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none bg-transparent">
      <div className="pointer-events-auto">
        <FloatingPersona 
          persona={defaultPersona} 
          analysis={defaultAnalysis} 
          initialExpanded={true}
        />
      </div>
    </div>
  );
}
