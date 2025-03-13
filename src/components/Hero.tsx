
import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui-components/Button';
import AnimatedSection from './ui-components/AnimatedSection';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection delay={100}>
            <span className="inline-block px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
              Animal Welfare Platform
            </span>
          </AnimatedSection>
          
          <AnimatedSection delay={300}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Connecting People to Help Animals in Need
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={500}>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A unified platform for reporting, funding, and coordinating animal welfare efforts in your community.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={700} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </AnimatedSection>
        </div>
        
        <AnimatedSection delay={900} className="mt-16 md:mt-20 relative mx-auto max-w-4xl">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-medium border border-border/50">
            <div className="absolute inset-0 bg-gradient-to-b from-tailmate-400/20 to-tailmate-700/20 flex items-center justify-center text-white">
              <div className="p-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8C8.13 8 5 11.13 5 15V19H19V15C19 11.13 15.87 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.1046 15 14 14.1046 14 13C14 11.8954 13.1046 11 12 11C10.8954 11 10 11.8954 10 13C10 14.1046 10.8954 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 6C17 7.65685 14.7614 9 12 9C9.23858 9 7 7.65685 7 6C7 4.34315 9.23858 3 12 3C14.7614 3 17 4.34315 17 6Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2">App Preview</h3>
                <p className="text-white/80">
                  Illustration of the Tailmate platform
                </p>
              </div>
            </div>
          </div>
          
          {/* App UI elements */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white rounded-xl shadow-soft border border-border/50 flex items-center justify-center p-4 rotate-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 8L9.75 4.5C9.69782 3.95992 9.43524 3.4647 9.01825 3.11586C8.60127 2.76703 8.06542 2.59422 7.52 2.635C6.97632 2.6768 6.47068 2.91076 6.10122 3.29348C5.73177 3.67621 5.5294 4.1833 5.53 4.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8L14.25 4.5C14.3022 3.95992 14.5648 3.4647 14.9818 3.11586C15.3987 2.76703 15.9346 2.59422 16.48 2.635C17.0237 2.6768 17.5293 2.91076 17.8988 3.29348C18.2682 3.67621 18.4706 4.1833 18.47 4.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 16L9.5 19.5C9.44782 20.0401 9.18524 20.5353 8.76825 20.8841C8.35127 21.233 7.81542 21.4058 7.27 21.365C6.72632 21.3232 6.22068 21.0892 5.85122 20.7065C5.48177 20.3238 5.2794 19.8167 5.28 19.29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 16L14.5 19.5C14.5522 20.0401 14.8148 20.5353 15.2318 20.8841C15.6487 21.233 16.1846 21.4058 16.73 21.365C17.2737 21.3232 17.7793 21.0892 18.1488 20.7065C18.5182 20.3238 18.7206 19.8167 18.72 19.29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="absolute -left-4 top-10 w-28 h-28 bg-white rounded-xl shadow-soft border border-border/50 flex items-center justify-center p-4 -rotate-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Hero;
