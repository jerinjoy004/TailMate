
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import UserRoles from '@/components/UserRoles';
import Footer from '@/components/Footer';

// Install framer-motion for animations
<lov-add-dependency>framer-motion@latest</lov-add-dependency>

const Index: React.FC = () => {
  useEffect(() => {
    document.title = 'Tailmate - Animal Welfare Platform';
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <UserRoles />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
