'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagicBento } from '@/components/ui/magic-bento';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, TrendingUp, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AnalysesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const allAnalyses = [
    {
      id: '1',
      jobTitle: 'Senior Product Manager',
      company: 'TechCorp',
      score: 87,
      matchingSkills: 8,
      skillGaps: 2,
      date: '2024-01-15',
    },
    {
      id: '2',
      jobTitle: 'Engineering Manager',
      company: 'StartupXYZ',
      score: 72,
      matchingSkills: 6,
      skillGaps: 3,
      date: '2024-01-14',
    },
    {
      id: '3',
      jobTitle: 'Product Lead',
      company: 'BigTech',
      score: 65,
      matchingSkills: 5,
      skillGaps: 4,
      date: '2024-01-13',
    },
    {
      id: '4',
      jobTitle: 'VP of Product',
      company: 'Fortune500',
      score: 78,
      matchingSkills: 7,
      skillGaps: 2,
      date: '2024-01-12',
    },
    {
      id: '5',
      jobTitle: 'Lead Designer',
      company: 'CreativeCo',
      score: 92,
      matchingSkills: 10,
      skillGaps: 1,
      date: '2024-01-11',
    },
    {
      id: '6',
      jobTitle: 'Full Stack Engineer',
      company: 'WebFlow',
      score: 84,
      matchingSkills: 9,
      skillGaps: 2,
      date: '2024-01-10',
    },
  ];

  const filteredAnalyses = allAnalyses.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'high') return a.score >= 80;
    if (filter === 'medium') return a.score >= 60 && a.score < 80;
    return true;
  });

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;
    // Close modal and redirect to Resume page to link with the persona
    setIsModalOpen(false);
    router.push('/dashboard/resume');
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3">Job Analyses</h1>
            <p className="text-xl text-gray-300">Review your job compatibility scores</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="button2 mt-4 md:mt-0">
                <Plus size={24} className="mr-2" />
                New Analysis
              </button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/10 backdrop-blur-xl text-white sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">New Job Analysis</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Paste the job description below to analyze your compatibility.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea 
                  placeholder="Paste job description here..."
                  className="min-h-[300px] bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-white/20 transition-all"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <DialogFooter>
                <button 
                  className="button2 w-full flex justify-center py-4 text-lg"
                  onClick={handleAnalyze}
                >
                  <Send size={20} className="mr-2" />
                  Start AI Analysis
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          <button 
            className={`button2 ${filter === 'all' ? 'ring-2 ring-white border-black' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`button2 ${filter === 'high' ? 'ring-2 ring-white border-black' : ''}`}
            onClick={() => setFilter('high')}
          >
            High Match (80%+)
          </button>
          <button 
            className={`button2 ${filter === 'medium' ? 'ring-2 ring-white border-black' : ''}`}
            onClick={() => setFilter('medium')}
          >
            Medium Match (60-79%)
          </button>
        </div>

        {/* Analyses List */}
        {filteredAnalyses.length > 0 && (
          <div className="mt-8">
            <MagicBento 
              cards={filteredAnalyses.map(a => ({
                title: a.jobTitle,
                label: a.company,
                description: `${a.matchingSkills} matching skills • ${a.skillGaps} skills to develop`,
                score: a.score,
              }))}
              enableStars={true}
              enableSpotlight={false}
              enableBorderGlow={false}
              enableTilt={true}
              enableMagnetism={true}
              glowColor="255, 255, 255"
              particleCount={15}
            />
          </div>
        )}

        {/* Empty State */}
        {filteredAnalyses.length === 0 && (
          <Card className="p-12 border border-white/10 bg-white/5 text-center">
            <TrendingUp size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No analyses found</h3>
            <p className="text-gray-400 mb-6">
              Try changing your filter or create a new analysis
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
