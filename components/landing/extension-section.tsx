"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Chrome, ArrowRight, Shield, Zap, Layout, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ExtensionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleInstall = () => {
    setIsInstalling(true);
    toast.loading("Connecting to Chrome Web Store...", { id: "install-toast" });
    
    setTimeout(() => {
      toast.success("Ready to install!", {
        id: "install-toast",
        description: "Redirecting you to the Chrome Web Store...",
      });
      setIsInstalling(false);
      
      // Simulation: open store in new tab (using a placeholder for now)
      window.open('https://chrome.google.com/webstore', '_blank');
    }, 1500);
  };

  return (
    <section 
      ref={sectionRef}
      id="extension" 
      className="relative py-24 lg:py-32 overflow-hidden bg-background border-y border-foreground/5"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-0 left-1/4 w-px h-full bg-foreground/10" />
         <div className="absolute top-0 right-1/4 w-px h-full bg-foreground/10" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="mb-8">
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                <span className="w-8 h-px bg-foreground/30" />
                Browser Extension
              </span>
              <h2 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] mb-8">
                Your AI coach,<br />
                <span className="italic">everywhere</span> you browse.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mb-10">
                Install our Chrome extension to bring your career companion directly into your job search. Analyze roles on LinkedIn, Indeed, and glassdoor without leaving the page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button 
                size="lg" 
                onClick={handleInstall}
                disabled={isInstalling}
                className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group shadow-xl min-w-[200px]"
              >
                {isInstalling ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Chrome className="w-5 h-5 mr-2" />
                )}
                {isInstalling ? "Connecting..." : "Add to Chrome"}
                {!isInstalling && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
              </Button>
              <div className="flex items-center gap-4 py-4 px-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-foreground flex items-center justify-center text-[10px] font-bold text-background">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-medium italic">"Game changer for my job search"</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Extension Preview Mockup */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
            <div className="relative rounded-3xl border border-foreground/10 bg-white p-4 shadow-2xl overflow-hidden aspect-[4/3]">
              {/* Browser UI Mockup */}
              <div className="absolute top-0 left-0 right-0 h-10 border-b border-foreground/5 bg-muted/30 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                </div>
                <div className="flex-grow mx-4 h-6 rounded-md bg-white border border-foreground/5 flex items-center px-3">
                  <div className="w-32 h-1.5 rounded-full bg-foreground/5" />
                </div>
              </div>

              {/* Extension Popup Mockup */}
              <div className="absolute top-14 right-8 w-64 rounded-2xl border border-foreground/10 bg-white shadow-xl p-5 z-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                    <span className="text-xs text-white font-bold">AI</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold font-display">Career Copilot</div>
                    <div className="text-[10px] text-muted-foreground font-mono">Status: Ready</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 rounded-full bg-foreground/5 w-full" />
                  <div className="h-2 rounded-full bg-foreground/5 w-3/4" />
                  <div className="pt-4">
                    <div className="text-[10px] font-mono text-muted-foreground mb-2">MATCH ANALYSIS</div>
                    <div className="h-12 rounded-xl bg-foreground/5 border border-foreground/5 flex items-center justify-between px-4">
                      <span className="text-sm font-bold">Fit Score</span>
                      <span className="text-sm font-bold text-green-600">85%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Abstract Job Page Mockup */}
              <div className="mt-14 p-10 space-y-8 opacity-40">
                <div className="space-y-3">
                   <div className="h-8 rounded-lg bg-foreground/10 w-2/3" />
                   <div className="h-5 rounded-lg bg-foreground/10 w-1/3" />
                </div>
                <div className="space-y-4">
                   <div className="h-3 rounded-full bg-foreground/5 w-full" />
                   <div className="h-3 rounded-full bg-foreground/5 w-full" />
                   <div className="h-3 rounded-full bg-foreground/5 w-4/5" />
                </div>
                <div className="flex gap-4 pt-4">
                   <div className="h-10 rounded-full bg-foreground/10 w-32" />
                   <div className="h-10 rounded-full border border-foreground/10 w-32" />
                </div>
              </div>
            </div>
            
            {/* Feature Pills */}
            <div className="absolute -bottom-6 -left-6 flex flex-col gap-4">
              <div className="px-5 py-3 rounded-2xl bg-white border border-foreground/10 shadow-xl flex items-center gap-3">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-bold font-mono tracking-tight">REAL-TIME ANALYSIS</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white border border-foreground/10 shadow-xl flex items-center gap-3">
                <Layout className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold font-mono tracking-tight">NATIVE INTEGRATION</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
