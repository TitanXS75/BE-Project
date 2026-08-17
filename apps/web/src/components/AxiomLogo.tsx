import React from "react";

export function AxiomLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="axiom-orb-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="axiom-orb-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="axiom-orb-3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="axiom-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <filter id="axiom-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Central Core Glow */}
      <circle cx="24" cy="24" r="3.2" fill="url(#axiom-core)" filter="url(#axiom-glow)" />

      {/* Orbit 1 - Horizontal */}
      <ellipse
        cx="24"
        cy="24"
        rx="20"
        ry="7.5"
        stroke="url(#axiom-orb-1)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Orbit 2 - Rotated 60deg */}
      <ellipse
        cx="24"
        cy="24"
        rx="20"
        ry="7.5"
        transform="rotate(60 24 24)"
        stroke="url(#axiom-orb-2)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Orbit 3 - Rotated 120deg */}
      <ellipse
        cx="24"
        cy="24"
        rx="20"
        ry="7.5"
        transform="rotate(120 24 24)"
        stroke="url(#axiom-orb-3)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Floating Orbital Electron / Quantum Particle */}
      <circle cx="24" cy="4" r="1.6" fill="#ffffff" filter="url(#axiom-glow)" />
      <circle cx="6.8" cy="34" r="1.4" fill="#60a5fa" filter="url(#axiom-glow)" />
      <circle cx="41.2" cy="34" r="1.4" fill="#c084fc" filter="url(#axiom-glow)" />
    </svg>
  );
}
