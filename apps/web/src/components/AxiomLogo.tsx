import React from "react";

export function AxiomLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="36" height="36" rx="9" fill="#1c1c1e" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <path
        d="M18 7L28 13.5V22.5L18 29L8 22.5V13.5L18 7Z"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M18 7V29"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.2"
      />
      <path
        d="M8 13.5L28 22.5M28 13.5L8 22.5"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
      <circle cx="18" cy="18" r="3.5" fill="#0071e3" />
      <circle cx="18" cy="18" r="1.5" fill="#ffffff" />
    </svg>
  );
}
