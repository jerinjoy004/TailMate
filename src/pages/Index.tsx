
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    document.title = 'Tailmate - Animal Welfare Platform';
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Hero />
        {/* On mobile, only show Features section for simplicity */}
        {isMobile ? (
          <Features />
        ) : (
          <>
            <Features />
            <HowItWorks />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
