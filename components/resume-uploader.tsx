'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeAnalysis {
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  experience_years: number;
  recommendation: string;
  linguistic_errors?: string[];
  career_advice?: string[];
}

export function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        
        // Save to localStorage for the AI Coach
        const resumeMemory = {
          text: `
            Candidate Profile Summary:
            - Experience: ${data.experience_years} years
            - Skills: ${data.skills.join(', ')}
            - Strengths: ${data.strengths.join('; ')}
            - Areas to Improve: ${data.weaknesses.join('; ')}
            - Linguistic/Writing Tips: ${data.linguistic_errors?.join('; ') || 'None found'}
            - Career Advice: ${data.career_advice?.join('; ') || 'None provided'}
            - Recommendation: ${data.recommendation}
          `.trim()
        };
        window.localStorage.setItem('careerCopilotResumeMemory', JSON.stringify(resumeMemory));
        // Dispatch event to notify FloatingPersona
        window.dispatchEvent(new Event('resumeMemoryUpdated'));
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!analysis ? (
        <div className="space-y-8">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-12 transition-all ${
              isDragging
                ? 'border-foreground bg-foreground/5'
                : 'border-foreground/20 hover:border-foreground/40'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-foreground" />
              </div>

              <div className="text-center">
                <h3 className="font-display text-xl font-semibold mb-2">
                  {file ? file.name : 'Upload your resume'}
                </h3>
                <p className="text-muted-foreground">
                  {file
                    ? 'Ready to analyze'
                    : 'Drag and drop your PDF or DOC file here'}
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={inputRef}
              />
              <Button
                onClick={() => inputRef.current?.click()}
                variant="outline"
                className="cursor-pointer border-foreground/20"
              >
                Choose file
              </Button>
            </div>
          </div>

          {/* Analyze Button */}
          {file && (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-foreground hover:bg-foreground/90 text-background h-14 text-base rounded-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Analysis Results */}
          <div className="bg-white rounded-2xl p-8 border border-foreground/10">
            <div className="flex items-center gap-4 mb-8">
              <FileText className="w-6 h-6 text-foreground" />
              <div>
                <h3 className="font-display text-xl font-semibold">{file?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {analysis.experience_years} years of experience
                </p>
              </div>
            </div>

            {/* Strengths */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-lg">Strengths</h4>
              </div>
              <div className="space-y-2 ml-7">
                {analysis.strengths.map((strength, i) => (
                  <div
                    key={i}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-900"
                  >
                    {strength}
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-lg">Areas to Improve</h4>
              </div>
              <div className="space-y-2 ml-7">
                {analysis.weaknesses.map((weakness, i) => (
                  <div
                    key={i}
                    className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900"
                  >
                    {weakness}
                  </div>
                ))}
              </div>
            </div>

            {/* Linguistic Errors */}
            {analysis.linguistic_errors && analysis.linguistic_errors.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <h4 className="font-semibold text-lg text-rose-900">Writing & Grammar Tips</h4>
                </div>
                <div className="space-y-2 ml-7">
                  {analysis.linguistic_errors.map((error, i) => (
                    <div
                      key={i}
                      className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-900"
                    >
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Advice */}
            {analysis.career_advice && analysis.career_advice.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-semibold text-lg text-indigo-900">Career Growth Advice</h4>
                </div>
                <div className="space-y-2 ml-7">
                  {analysis.career_advice.map((advice, i) => (
                    <div
                      key={i}
                      className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-indigo-900"
                    >
                      {advice}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Key Skills</h4>
              <div className="flex flex-wrap gap-2 ml-7">
                {analysis.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Recommendation:</span> {analysis.recommendation}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setFile(null);
                setAnalysis(null);
              }}
              variant="outline"
              className="flex-1 h-12 rounded-full border-foreground/20"
            >
              Upload Another
            </Button>
            <Button className="flex-1 bg-foreground hover:bg-foreground/90 text-background h-12 rounded-full">
              Find Matching Jobs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
