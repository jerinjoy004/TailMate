import React, { useEffect, useState, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Button from "./ui-components/Button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

// Memoize nav links to prevent re-creation on each render
const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
];

// Optimize MobileMenu with memoization to prevent unnecessary re-renders
const MobileMenu = memo(
  ({
    isOpen,
    setIsOpen,
    handleNavigation,
  }: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleNavigation: (path: string) => void;
  }) => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] pt-10">
        <SheetTitle>Navigation Menu</SheetTitle>
        <SheetDescription>Access pages and features</SheetDescription>
        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col space-y-2 mt-4 pt-4 border-t">
            <Link to="/signin" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)}>
              <Button size="sm" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
);

MobileMenu.displayName = "MobileMenu";

// Main Navigation component
const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // Close sheet when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Optimize scroll handler with useCallback and throttling
  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    // Throttle scroll events to improve performance
    let timeoutId: number | null = null;

    const throttledScrollHandler = () => {
      if (!timeoutId) {
        timeoutId = window.setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 100);
      }
    };

    window.addEventListener("scroll", throttledScrollHandler);
    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // Memoize navigation handler to prevent re-creation on each render
  const handleNavigation = useCallback(
    (path: string) => {
      setIsOpen(false);
      navigate(path);
    },
    [navigate]
  );

  // Preload potential destination pages on hover
  const preloadPage = useCallback((path: string) => {
    const prefetchLink = document.createElement("link");
    prefetchLink.rel = "prefetch";
    prefetchLink.href = path;
    document.head.appendChild(prefetchLink);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4",
        scrolled ? "glass shadow-sm backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl font-semibold text-primary"
            onClick={() => setIsOpen(false)}
          >
            Tailmate
          </Link>
        </div>

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
          <Link to="/signin">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
              onMouseEnter={() => preloadPage("/signin")}
            >
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              size="sm"
              className="hidden md:inline-flex"
              onMouseEnter={() => preloadPage("/signup")}
            >
              Get Started
            </Button>
          </Link>
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            handleNavigation={handleNavigation}
          />
        </div>
      </div>
    </header>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default memo(Navigation);
