import React from "react";

interface AppleLoaderProps {
  size?: "xs" | "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function AppleLoader({ size = "md", text, className = "" }: AppleLoaderProps) {
  const sizeMap = {
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-9 w-9",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center ${sizeMap[size]}`}>
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-[#0071e3]/25 blur-xs animate-pulse" />
        
        {/* Apple Style Ring */}
        <svg
          className="w-full h-full animate-spin text-[#0071e3]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-20 text-white"
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M12 2.5A9.5 9.5 0 0 1 21.5 12h-2.5a7 7 0 0 0-7-7V2.5z"
          />
        </svg>
      </div>

      {text && (
        <span className="text-xs font-medium text-[#86868b] tracking-tight">
          {text}
        </span>
      )}
    </div>
  );
}
