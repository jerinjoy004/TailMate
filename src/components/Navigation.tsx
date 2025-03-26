<<<<<<< HEAD

=======
>>>>>>> b592667 (ui fix)
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Button from './ui-components/Button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
<<<<<<< HEAD
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
=======
      setScrolled(window.scrollY > 50);
>>>>>>> b592667 (ui fix)
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
  ];

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden"
        >
<<<<<<< HEAD
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] pt-10">
=======
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] pt-10">
>>>>>>> b592667 (ui fix)
        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
<<<<<<< HEAD
          <div className="flex flex-col space-y-2 mt-4 pt-4 border-t">
            <Link to="/signin" className="w-full">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup" className="w-full">
              <Button 
                size="sm"
                className="w-full"
              >
=======
          <div className="flex flex-col space-y-2 mt-6 pt-4 border-t">
            <Link to="/signin">
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="w-full">
>>>>>>> b592667 (ui fix)
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4',
<<<<<<< HEAD
        scrolled ? 'glass shadow-sm backdrop-blur-lg' : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold text-primary">
            Tailmate
          </Link>
        </div>
=======
        scrolled ? 'bg-white/70 shadow-sm backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="text-xl font-semibold text-primary">
          Tailmate
        </Link>
>>>>>>> b592667 (ui fix)
        
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/signin" className="hidden md:block">
<<<<<<< HEAD
            <Button 
              variant="outline" 
              size="sm"
            >
=======
            <Button variant="outline" size="sm">
>>>>>>> b592667 (ui fix)
              Sign In
            </Button>
          </Link>
          <Link to="/signup" className="hidden md:block">
            <Button size="sm">
              Get Started
            </Button>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

<<<<<<< HEAD
export default Navigation;
=======
export default Navigation;
>>>>>>> b592667 (ui fix)
