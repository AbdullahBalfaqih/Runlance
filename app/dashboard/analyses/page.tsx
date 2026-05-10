'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, ArrowRight, TrendingUp } from 'lucide-react';

export default function AnalysesPage() {
  const analyses = [
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
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Job Analyses</h1>
            <p className="text-gray-600">Review your job compatibility scores</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-black text-white hover:bg-gray-900">
            <Plus size={20} className="mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="outline" className="border-black text-black bg-white hover:bg-gray-50">
            All
          </Button>
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
            High Match (80%+)
          </Button>
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
            Medium Match (60-79%)
          </Button>
        </div>

        {/* Analyses List */}
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Card
              key={analysis.id}
              className="p-6 border border-gray-200 hover:border-gray-300 transition hover:shadow-sm cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-1">{analysis.jobTitle}</h3>
                  <p className="text-gray-600 text-sm mb-3">{analysis.company}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      <TrendingUp size={16} className="inline mr-1" />
                      {analysis.matchingSkills} matching skills
                    </span>
                    <span className="text-gray-500">
                      {analysis.skillGaps} skills to develop
                    </span>
                  </div>
                </div>

                {/* Center - Score */}
                <div className={`px-6 py-4 rounded-lg ${getScoreBg(analysis.score)}`}>
                  <div className="text-center">
                    <p className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}%
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Match Score</p>
                  </div>
                </div>

                {/* Right - Button */}
                <Button className="bg-black text-white hover:bg-gray-900 group-hover:gap-2 transition gap-2">
                  View Details
                  <ArrowRight size={18} />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-black h-1.5 rounded-full transition"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {analyses.length === 0 && (
          <Card className="p-12 border border-gray-200 text-center">
            <TrendingUp size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No analyses yet</h3>
            <p className="text-gray-600 mb-6">
              Paste a job description or use our Chrome extension to get started
            </p>
            <Button className="bg-black text-white hover:bg-gray-900">
              Create Your First Analysis
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
