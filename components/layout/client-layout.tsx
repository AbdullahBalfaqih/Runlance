'use client';

import { usePathname } from 'next/navigation';
import { FloatingPersona } from '@/components/floating-persona';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideGlobalPersona = pathname === '/dashboard/interview' || pathname === '/avatar-overlay';

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

  return (
    <>
      {children}
      {!hideGlobalPersona && (
        <FloatingPersona persona={defaultPersona} analysis={defaultAnalysis} />
      )}
      <Toaster position="top-center" richColors />
      <Analytics />
    </>
  );
}
