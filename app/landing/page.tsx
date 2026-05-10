import { HeroSection } from '@/components/landing/hero-section';
import { PhoneShowcaseSection } from '@/components/landing/phone-showcase-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { MetricsSection } from '@/components/landing/metrics-section';
import { ExtensionSection } from '@/components/landing/extension-section';
import { DevelopersSection } from '@/components/landing/developers-section';
import { InfrastructureSection } from '@/components/landing/infrastructure-section';
import { SecuritySection } from '@/components/landing/security-section';
import { IntegrationsSection } from '@/components/landing/integrations-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { CtaSection } from '@/components/landing/cta-section';
import { FooterSection } from '@/components/landing/footer-section';
import { Navigation } from '@/components/landing/navigation';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
      <Navigation />
      <main className="flex-grow">
        <HeroSection />
        <PhoneShowcaseSection />
        <MetricsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ExtensionSection />
        <DevelopersSection />
        <InfrastructureSection />
        <SecuritySection />
        <IntegrationsSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
}
