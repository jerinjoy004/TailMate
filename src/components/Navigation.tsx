
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './ui-components/Button';

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4',
        scrolled ? 'glass shadow-sm backdrop-blur-lg' : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-xl font-semibold text-primary">
            Tailmate
          </a>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#features" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#user-roles" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            User Roles
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            className="hidden md:flex"
          >
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
