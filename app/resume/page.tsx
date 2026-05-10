import { Navigation } from "@/components/landing/navigation";
import { ResumeUploader } from "@/components/resume-uploader";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Analyze Your Resume - Career AI",
  description: "Upload your resume and get AI-powered analysis of your strengths, weaknesses, and personalized job recommendations.",
};

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              Resume Analysis
            </span>

            <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-tight">
              Know your
              <br />
              <span className="text-muted-foreground">strengths</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Upload your resume and get instant AI analysis of your career profile. 
              Discover your strengths, identify areas to improve, and receive 
              personalized job recommendations.
            </p>
          </div>

          {/* Uploader Component */}
          <ResumeUploader />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-foreground/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Smart Extraction",
                description: "AI automatically extracts skills, experience, and education from your resume",
              },
              {
                number: "02",
                title: "Deep Analysis",
                description: "Get detailed insights into your strengths, weaknesses, and career trajectory",
              },
              {
                number: "03",
                title: "Job Matching",
                description: "Discover roles that perfectly match your unique skill set and experience",
              },
            ].map((feature) => (
              <div key={feature.number} className="space-y-4">
                <span className="text-4xl font-display text-muted-foreground">{feature.number}</span>
                <h3 className="text-xl font-display font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
            Ready to advance your career?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start with resume analysis and get personalized job recommendations based on your unique profile.
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground rounded-full font-medium hover:bg-background/90 transition-colors group"
          >
            Find Matching Jobs
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </main>
  );
}
