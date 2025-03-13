
import React from 'react';
import AnimatedSection from './ui-components/AnimatedSection';

const roles = [
  {
    title: 'Normal User',
    description: 'Report issues, post updates, and contribute to fundraising campaigns.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    features: ['Report issues', 'Post updates', 'Contribute to fundraising', 'Donate items'],
  },
  {
    title: 'Volunteer',
    description: 'Actively participate in animal rescue and care efforts in your locality.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 16L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 20L17 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 9.9997C2 14.4185 5.58172 17.9997 10 17.9997C12.3487 17.9997 14.4753 17.0949 16 15.6383C17.5247 14.1817 18.4296 12.0555 18.4296 9.70692C18.4296 5.28521 14.8479 1.70349 10.4262 1.70349C5.79175 1.70349 2.00002 5.59844 2 9.9997Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 7V11L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    features: ['Respond to reports', 'Coordinate rescues', 'Transport animals', 'Provide temporary care'],
  },
  {
    title: 'Doctor',
    description: 'Provide medical advice and support for animals in need as a verified veterinarian.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8.70051C3 8.14822 3.44772 7.70051 4 7.70051H20C20.5523 7.70051 21 8.14822 21 8.70051V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V8.70051Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 7.70051V5C7 3.34315 8.34315 2 10 2H14C15.6569 2 17 3.34315 17 5V7.70051" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    features: ['Provide medical advice', 'Arrange treatments', 'Verify medical needs', 'Train volunteers'],
  },
];

const UserRoles: React.FC = () => {
  return (
    <section id="user-roles" className="py-24 bg-secondary/50">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
            User Types
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Tailmate in a Role That Fits You
          </h2>
          <p className="text-lg text-muted-foreground">
            Contribute to animal welfare in the way that best matches your skills and availability.
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <AnimatedSection 
              key={index} 
              delay={150 * (index + 1)}
              className="bg-background rounded-2xl overflow-hidden shadow-soft border border-border/50 transition-transform duration-300 hover:translate-y-[-5px]"
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-xl mr-4">
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{role.title}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-muted-foreground mb-6">{role.description}</p>
                <ul className="space-y-3">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="mr-3 text-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserRoles;
