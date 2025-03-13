
import React from 'react';
import AnimatedSection from './ui-components/AnimatedSection';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 10C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 18L2 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 18L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Animal Reporting',
    description: 'Report injured, sick, or lost animals easily with our streamlined system.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 13H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 3.5C13.1821 3.17906 12.3038 3 11.4 3C7.71531 3 4.72 6.13 4.72 10C4.72 10.1681 4.72659 10.3348 4.73959 10.5L3.59092 15.0485C3.26934 16.2196 4.18372 17.3419 5.38995 17.3419H17.41C18.6162 17.3419 19.5306 16.2196 19.209 15.0485L18.328 11.695" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Medical Support',
    description: 'Connect with verified veterinary doctors to provide medical care.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6226 14.4023 13.8368 13.2815 11.8014 13.0491M6.35625 16.1429C5.80687 15.4468 4.95558 15 4 15C2.34315 15 1 16.3431 1 18V20H6M6.35625 16.1429C6.12642 16.717 6 17.3438 6 18V20M6.35625 16.1429C7.37741 14.4023 9.16319 13.2815 11.1986 13.0491M11.8014 13.0491C11.8673 13.0466 11.9336 13.0453 12 13.0453C12.0664 13.0453 12.1327 13.0466 12.1986 13.0491M11.8014 13.0491C10.8911 13.1946 10.0313 13.4941 9.26394 13.9188C8.96894 14.0745 8.68824 14.2486 8.42366 14.4389M12.1986 13.0491C13.1089 13.1946 13.9687 13.4941 14.7361 13.9188C15.0311 14.0745 15.3118 14.2486 15.5763 14.4389M4 15C4 13.7899 4.3328 12.6589 4.91753 11.7013C5.38035 10.9296 6.04696 10.2685 6.82677 9.77375C7.94083 9.08411 9.25566 8.7 10.6667 8.7C13.0273 8.7 15.1822 9.76401 16.6667 11.5M4 15L2 13M16.6667 11.5L15 10M16.6667 11.5L18 10M12 6.7C13.6569 6.7 15 5.35685 15 3.7C15 2.04315 13.6569 0.7 12 0.7C10.3431 0.7 9 2.04315 9 3.7C9 5.35685 10.3431 6.7 12 6.7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Volunteer Network',
    description: 'Organize rescue and care efforts with the help of dedicated volunteers.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H5M19 21H21M5 21H3M9 7H15M9 11H15M9 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Transparent Reporting',
    description: 'Track the status of reported animals and follow up on their care progress.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 8.5H14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 16.5H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 16.5H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12.5H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 9L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 13L16.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="12" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="12" y="3" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Fundraising',
    description: 'Enable direct fundraising and transparent financial tracking for animal care.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 14V17M17 20V17M17 17H14M17 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 7L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 11L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 15L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 7L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 11L14 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Item Donation',
    description: 'Coordinate the donation of pet food, medicine, and other essential supplies.',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-secondary/50">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Everything you need to help animals in need
          </h2>
          <p className="text-lg text-muted-foreground">
            Tailmate combines essential tools to create a comprehensive solution for animal welfare coordination.
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection 
              key={index} 
              delay={100 * (index + 1)}
              className="bg-background rounded-2xl p-6 shadow-soft border border-border/50 transition-transform duration-300 hover:translate-y-[-5px]"
            >
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
