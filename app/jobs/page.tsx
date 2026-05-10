'use client';

import { useState, useEffect } from 'react';
import { Navigation } from "@/components/landing/navigation";
import { Briefcase, TrendingUp, MapPin, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  match_score: number;
  skills_match: number;
  experience_match: number;
  salary_range?: string;
  description: string;
  key_requirements: string[];
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterScore, setFilterScore] = useState(0);

  useEffect(() => {
    // Simulated job data - replace with actual API call
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Frontend Engineer',
        company: 'Tech Startup Inc',
        location: 'San Francisco, CA',
        match_score: 92,
        skills_match: 95,
        experience_match: 89,
        salary_range: '$150k - $180k',
        description: 'We are looking for a Senior Frontend Engineer with 5+ years of experience...',
        key_requirements: ['React', 'TypeScript', 'Leadership', 'System Design'],
      },
      {
        id: '2',
        title: 'Full Stack Developer',
        company: 'Innovation Labs',
        location: 'New York, NY',
        match_score: 85,
        skills_match: 88,
        experience_match: 82,
        salary_range: '$130k - $160k',
        description: 'Join our team to build scalable applications...',
        key_requirements: ['Node.js', 'React', 'Database Design', 'DevOps'],
      },
      {
        id: '3',
        title: 'Product Engineer',
        company: 'Growth Co',
        location: 'Remote',
        match_score: 78,
        skills_match: 82,
        experience_match: 74,
        salary_range: '$120k - $150k',
        description: 'Help us build the next generation of products...',
        key_requirements: ['Product Sense', 'Full Stack', 'Analytics', 'Testing'],
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setJobs(mockJobs);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredJobs = jobs.filter(job => job.match_score >= filterScore);

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6 mb-12">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              Job Matching
            </span>

            <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-tight">
              Jobs made for
              <br />
              <span className="text-muted-foreground">you</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Discover positions that match your skills and experience. 
              Every job is scored based on your unique profile.
            </p>
          </div>

          {/* Filter Section */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-muted-foreground">Minimum match:</span>
            <div className="flex gap-2">
              {[0, 75, 85, 95].map((score) => (
                <button
                  key={score}
                  onClick={() => setFilterScore(score)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filterScore === score
                      ? 'bg-foreground text-background'
                      : 'bg-foreground/5 border border-foreground/10 hover:border-foreground/20'
                  }`}
                >
                  {score > 0 ? `${score}%+` : 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-foreground" />
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="group p-6 rounded-2xl border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/5 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-foreground" />
                        <h3 className="text-xl font-display font-semibold">{job.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="font-medium">{job.company}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-foreground/10"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray={`${(job.match_score / 100) * 226} 226`}
                              className="text-foreground transition-all"
                            />
                          </svg>
                          <div className="absolute text-center">
                            <div className="text-2xl font-display font-semibold">{job.match_score}%</div>
                            <div className="text-xs text-muted-foreground">Match</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Match Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-foreground/5 rounded-xl">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Skills Match</div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${job.skills_match}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{job.skills_match}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Experience Match</div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${job.experience_match}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{job.experience_match}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Requirements */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Key Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.key_requirements.map((req, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-foreground/10 text-sm rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                    <p className="text-muted-foreground line-clamp-1">{job.description}</p>
                    <Button
                      className="bg-foreground hover:bg-foreground/90 text-background rounded-full gap-2 group-hover:translate-x-1 transition-transform"
                      size="sm"
                    >
                      Apply
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No jobs match your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
