import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-lg z-50",
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
};

export default Loader;
