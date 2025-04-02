import React, { useEffect, useRef, useState, memo } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "scale-in";
  onClick?: () => void;
  disableOnMobile?: boolean;
}

const createObserver = () => {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }
  );
};

let observer: IntersectionObserver | null = null;

const getObserver = () => {
  if (!observer && typeof window !== "undefined") {
    observer = createObserver();
  }
  return observer;
};

const AnimatedSection: React.FC<AnimatedSectionProps> = memo(
  ({
    children,
    className,
    delay = 0,
    animation = "fade-up",
    onClick,
    disableOnMobile = false,
  }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      setIsMobile(window.innerWidth < 768);

      return () => {
        if (sectionRef.current && observer) {
          observer.unobserve(sectionRef.current);
        }
      };
    }, []);

    useEffect(() => {
      if (sectionRef.current) {
        sectionRef.current.style.setProperty("--animation-delay", `${delay}ms`);

        if (!(disableOnMobile && isMobile)) {
          const obs = getObserver();
          if (obs) obs.observe(sectionRef.current);
        } else {
          sectionRef.current.dataset.visible = "true";
        }
      }
    }, [delay, disableOnMobile, isMobile]);

    return (
      <div
        ref={sectionRef}
        className={cn(
          "transition-opacity duration-500 opacity-0 data-[visible=true]:opacity-100",
          disableOnMobile && isMobile
            ? ""
            : `animate-${animation} will-change-transform`,
          className,
          onClick ? "cursor-pointer" : ""
        )}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
