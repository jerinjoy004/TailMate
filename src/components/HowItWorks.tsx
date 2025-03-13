
import React from 'react';
import AnimatedSection from './ui-components/AnimatedSection';

const steps = [
  {
    number: '01',
    title: 'Report an Animal',
    description: 'Use the app to report animals in need with location, photos, and description.',
  },
  {
    number: '02',
    title: 'Volunteers Respond',
    description: 'Nearby volunteers are notified and can choose to respond to the case.',
  },
  {
    number: '03',
    title: 'Doctor Assistance',
    description: 'Verified doctors provide medical advice or arrange for treatment.',
  },
  {
    number: '04',
    title: 'Coordinate Care',
    description: 'Organize fundraising, item donations, or temporary boarding as needed.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How Tailmate Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform makes it easy to coordinate animal welfare efforts through a simple, streamlined process.
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <AnimatedSection 
              key={index} 
              delay={150 * (index + 1)}
              className="relative group"
            >
              <div className="bg-background rounded-2xl p-8 shadow-soft border border-border/50 h-full transition-transform duration-300 group-hover:translate-y-[-5px]">
                <div className="text-4xl font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 text-primary/40">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </AnimatedSection>
          ))}
        </div>
        
        <AnimatedSection delay={800} className="mt-16 md:mt-24 relative mx-auto max-w-4xl bg-secondary/50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
                Real-Time Updates
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay informed with our notification system</h3>
              <p className="text-muted-foreground mb-6">
                Receive instant notifications about animal cases in your area and track their progress through our real-time system.
              </p>
              <ul className="space-y-3">
                {['Location-based alerts', 'Case status updates', 'Direct messaging', 'Team coordination'].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <div className="mr-3 text-primary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white rounded-2xl shadow-medium overflow-hidden border border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-tailmate-400/10 to-tailmate-700/10 flex items-center justify-center">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
                    <p className="text-muted-foreground">
                      Track animal cases from reporting to resolution
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white rounded-lg shadow-soft border border-border/50 flex items-center justify-center p-3 rotate-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 17V18C13 18.5304 12.7893 19.0391 12.4142 19.4142C12.0391 19.7893 11.5304 20 11 20C10.4696 20 9.96086 19.7893 9.58579 19.4142C9.21071 19.0391 9 18.5304 9 18V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HowItWorks;
