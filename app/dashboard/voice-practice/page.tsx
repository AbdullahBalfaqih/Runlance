'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { VoicePractice } from '@/components/dashboard/voice-practice';

export default function VoicePracticePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 h-full flex flex-col">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Voice Practice</h1>
          <p className="text-gray-400">Eliminate interview anxiety through immersive audio-only simulations.</p>
        </div>
        
        <div className="flex-1 min-h-[600px]">
          <VoicePractice />
        </div>
      </div>
    </DashboardLayout>
  );
}
