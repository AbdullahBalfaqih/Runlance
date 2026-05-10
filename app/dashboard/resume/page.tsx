'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import BorderGlow from '@/components/ui/border-glow';
import { FileText, Upload, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ResumeAnalysis {
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  experience_years: number;
  recommendation: string;
  linguistic_errors?: string[];
  career_advice?: string[];
  rawText?: string;
}

export default function ResumePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await handleAnalyze(selectedFile);
    }
  };

  const handleAnalyze = async (selectedFile: File) => {
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        // Dispatch custom event to notify FloatingPersona
        if (data.rawText) {
           window.localStorage.setItem('careerCopilotResumeMemory', JSON.stringify({ text: data.rawText }));
           window.dispatchEvent(new CustomEvent('resumeMemoryUpdated'));
        }
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError('An error occurred during upload. Please check your connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      await handleAnalyze(selectedFile);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Resume</h1>
              <p className="text-gray-300">Analyze and optimize your resume for AI screening</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
              />
              <button 
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="button2"
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload size={20} className="mr-2" />
                )}
                {analysis ? 'Update Resume' : 'Upload Resume'}
              </button>
            </div>
          </div>

        {analysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <BorderGlow 
                borderRadius={24}
                backgroundColor="#000000"
                glowColor="0 0 100"
                colors={['#ffffff', '#444444', '#111111']}
                className="overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <FileText className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{file?.name || 'resume.pdf'}</h3>
                        <p className="text-sm text-gray-400">Recently uploaded • {(file?.size ? (file.size / (1024 * 1024)).toFixed(1) : '1.2')} MB</p>
                      </div>
                    </div>
                    <button 
                      className="button2"
                      onClick={() => {
                        if (file) {
                          const url = URL.createObjectURL(file);
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      View Full PDF
                    </button>
                  </div>

                  <div className="space-y-6 pt-4">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      AI System Analysis
                    </h4>
                    <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                      {analysis.recommendation}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="space-y-3">
                        <h5 className="font-bold text-white text-sm uppercase tracking-wider">Top Strengths</h5>
                        <ul className="space-y-2">
                          {analysis.strengths.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-bold text-white text-sm uppercase tracking-wider">Improvement Gaps</h5>
                        <ul className="space-y-2">
                          {analysis.weaknesses.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* PDF Preview Section - Moved below analysis */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Resume Preview</h5>
                      <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5 aspect-[1/1.4] relative">
                        {file ? (
                          <iframe 
                            src={URL.createObjectURL(file) + '#toolbar=0'} 
                            className="w-full h-full border-none"
                            title="Resume Preview"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <p>Preview not available</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Linguistic Errors */}
                    {analysis.linguistic_errors && analysis.linguistic_errors.length > 0 && (
                      <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
                        <h5 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                          Writing & Grammar Tips
                        </h5>
                        <ul className="space-y-2">
                          {analysis.linguistic_errors.map((error, i) => (
                            <li key={i} className="text-sm text-gray-400 leading-relaxed">
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Career Advice */}
                    {analysis.career_advice && analysis.career_advice.length > 0 && (
                      <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
                        <h5 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                          Career Growth Advice
                        </h5>
                        <ul className="space-y-2">
                          {analysis.career_advice.map((advice, i) => (
                            <li key={i} className="text-sm text-gray-400 leading-relaxed">
                              • {advice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </BorderGlow>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <BorderGlow 
                borderRadius={24}
                backgroundColor="#000000"
                glowColor="0 0 100"
                colors={['#ffffff', '#444444', '#111111']}
              >
                <div className="p-6 space-y-8">
                  {/* Score Section */}
                  <div className="text-center pb-8 border-b border-white/10">
                    <div className="mb-4">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            className="text-white/10"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="58"
                            cx="64"
                            cy="64"
                          />
                          <circle
                            className="text-white"
                            strokeWidth="8"
                            strokeDasharray={364}
                            strokeDashoffset={364 * (1 - 0.92)}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="58"
                            cx="64"
                            cy="64"
                          />
                        </svg>
                        <span className="absolute text-3xl font-bold text-white">92</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-white">Resume Score</h3>
                    <p className="text-sm text-gray-400 mt-1">Excellent match for Senior Roles</p>
                  </div>

                  {/* Keywords Section */}
                  <div>
                    <h4 className="font-bold text-white mb-4">Keywords Optimization</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </div>
          </div>
        ) : (
          <BorderGlow
            borderRadius={24}
            backgroundColor="#000000"
            glowColor="0 0 100"
            colors={['#ffffff', '#444444', '#111111']}
            animated
          >
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-16 border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 rounded-[inherit] ${
                isDragging 
                  ? 'border-white bg-white/10 scale-[1.02]' 
                  : 'border-white/10 bg-transparent'
              }`}
            >
              <Upload size={48} className={`mb-4 transition-colors ${isDragging ? 'text-white' : 'text-gray-500'}`} />
              <h3 className="text-xl font-bold text-white mb-2">Upload your resume</h3>
              <p className="text-gray-300 mb-8 max-w-sm">
                Our AI will analyze your resume against industry standards and provide actionable feedback.
              </p>
              <button 
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="button2 px-12 py-6 text-xl"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Choose File'
                )}
              </button>
              {error && (
                <div className="mt-6 px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 text-gray-300 text-sm">
                  <AlertCircle size={16} className="text-white" />
                  {error}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-4">PDF, DOCX up to 10MB</p>
            </div>
          </BorderGlow>
        )}
      </div>
    </DashboardLayout>
  );
}
