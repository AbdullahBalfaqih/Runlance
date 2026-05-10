'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import BorderGlow from '@/components/ui/border-glow';

gsap.registerPlugin(ScrollTrigger);

interface InterviewType {
  title: string;
  description: string;
}

interface GalleryCarouselProps {
  types: InterviewType[];
  onStart: () => void;
}

export function GalleryCarousel({ types, onStart }: GalleryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);

  // Only show cards once + one invisible card for smooth exit
  const displayItems = [...types, { title: '', description: '', invisible: true } as any];

  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return;

    const cards = Array.from(cardsRef.current.querySelectorAll('li'));
    const spacing = 0.2; // Increased spacing since we have fewer cards
    const snap = gsap.utils.snap(spacing);
    
    let localIteration = 0;

    const buildSeamlessLoop = (items: any[], spacing: number) => {
      let overlap = Math.ceil(1 / spacing),
          startTime = items.length * spacing + 0.5,
          loopTime = (items.length + overlap) * spacing + 1,
          rawSequence = gsap.timeline({ paused: true }),
          seamlessLoop = gsap.timeline({
            paused: true,
            repeat: -1,
            onRepeat() {
              this._time === this._dur && (this._tTime += this._dur - 0.01);
            }
          }),
          l = items.length + overlap * 2,
          time = 0,
          i, index, item;

      gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 });

      for (i = 0; i < l; i++) {
        index = i % items.length;
        item = items[index];
        time = i * spacing;
        rawSequence.fromTo(item, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false }, 
          time
        ).fromTo(item, 
          { xPercent: 400 }, 
          { xPercent: -400, duration: 1, ease: "none", immediateRender: false }, 
          time
        );
        i <= items.length && seamlessLoop.add("label" + i, time);
      }

      rawSequence.time(startTime);
      seamlessLoop.to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: "none"
      }).fromTo(rawSequence, { time: overlap * spacing + 1 }, {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: "none"
      });
      return seamlessLoop;
    };

    const seamlessLoop = buildSeamlessLoop(cards, spacing);
    const scrub = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: "power3",
      paused: true
    });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      scroller: "main",
      start: "top 80%", // Start when the section enters the view
      end: "bottom 20%", // End when it leaves
      onUpdate(self) {
        scrub.vars.totalTime = self.progress * (seamlessLoop.duration() * 0.8);
        scrub.invalidate().restart();
      }
    });

    function scrubTo(totalTime: number) {
      let progress = totalTime / seamlessLoop.duration();
      progress = Math.max(0, Math.min(1, progress));
      trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
    }

    const nextHandler = () => scrubTo(scrub.vars.totalTime + spacing);
    const prevHandler = () => scrubTo(scrub.vars.totalTime - spacing);

    const nextBtn = containerRef.current?.querySelector(".next");
    const prevBtn = containerRef.current?.querySelector(".prev");
    nextBtn?.addEventListener("click", nextHandler);
    prevBtn?.addEventListener("click", prevHandler);

    return () => {
      trigger.kill();
      scrub.kill();
      seamlessLoop.kill();
      nextBtn?.removeEventListener("click", nextHandler);
      prevBtn?.removeEventListener("click", prevHandler);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[800px] overflow-hidden">
      <ul ref={cardsRef} className="cards absolute w-[320px] h-[420px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 list-none p-0 m-0">
        {displayItems.map((type: any, i) => (
          <li key={i} className="absolute top-0 left-0 w-full h-full list-none p-0 m-0">
            {type.invisible ? (
              <div className="w-full h-full opacity-0 pointer-events-none" />
            ) : (
              <BorderGlow
                borderRadius={32}
                backgroundColor="#0a0a0a"
                glowColor="0 0 100"
                colors={['#ffffff', '#444444', '#111111']}
                className="h-full shadow-2xl"
              >
                <div className="p-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight leading-tight mb-4">{type.title}</h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  
                  <button 
                    onClick={onStart}
                    className="button2 w-full !py-5 flex items-center justify-center gap-3 group/btn"
                  >
                    <span className="text-lg">Start Practice</span>
                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </BorderGlow>
            )}
          </li>
        ))}
      </ul>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-8 z-[200]">
        <button className="prev w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95">
          <ArrowLeft size={24} />
        </button>
        <button className="next w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95">
          <ArrowRight size={24} />
        </button>
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-10">
        <p className="text-[9px] font-bold text-white tracking-[1em]">Scrub to Explore</p>
      </div>
    </div>
  );
}
