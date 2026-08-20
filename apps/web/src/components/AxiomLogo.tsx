import React from "react";

export function AxiomLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Left Wing Gradient - Precision Blue to Cyan */}
        <linearGradient id="axiom-left-facet" x1="16" y1="12" x2="32" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="40%" stopColor="#0071e3" />
          <stop offset="100%" stopColor="#034ea2" />
        </linearGradient>

        {/* Right Wing Gradient - Indigo to Violet */}
        <linearGradient id="axiom-right-facet" x1="48" y1="12" x2="32" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>

        {/* Apex Crown Gradient - Ultra Bright Specular Highlight */}
        <linearGradient id="axiom-apex-cap" x1="32" y1="8" x2="32" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0071e3" stopOpacity="0.4" />
        </linearGradient>

        {/* Central Core Crossbar Diamond */}
        <linearGradient id="axiom-core-diamond" x1="24" y1="30" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>

        {/* Outer Ambient Glow */}
        <filter id="axiom-core-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Soft Optical Glow */}
      <circle cx="32" cy="32" r="22" fill="#0071e3" fillOpacity="0.12" filter="url(#axiom-core-glow)" />

      {/* ─── LEFT FACET PILLAR (Ascending A-Leg) ─── */}
      <path
        d="M32 10L14 46C13.2 47.6 14.4 49.5 16.2 49.5H23.5C24.4 49.5 25.2 48.9 25.6 48.1L32 34.5L34 30L32 10Z"
        fill="url(#axiom-left-facet)"
      />

      {/* ─── RIGHT FACET PILLAR (Descending A-Leg) ─── */}
      <path
        d="M32 10L50 46C50.8 47.6 49.6 49.5 47.8 49.5H40.5C39.6 49.5 38.8 48.9 38.4 48.1L32 34.5L30 30L32 10Z"
        fill="url(#axiom-right-facet)"
      />

      {/* ─── CENTRAL PRISM DIAMOND (A-Crossbar & Neural Lens) ─── */}
      <path
        d="M32 26L41 38.5L32 47L23 38.5L32 26Z"
        fill="url(#axiom-core-diamond)"
        filter="url(#axiom-core-glow)"
      />

      {/* ─── INNER FACET RECESS (Geometric Depth Shadow) ─── */}
      <path
        d="M32 26L32 47L23 38.5L32 26Z"
        fill="#000000"
        fillOpacity="0.22"
      />

      {/* ─── APEX REFLECTIVE LIGHT BEVEL ─── */}
      <path
        d="M32 10L27 21L32 19L37 21L32 10Z"
        fill="url(#axiom-apex-cap)"
      />

      {/* Specular Core Glimmer Dot */}
      <circle cx="32" cy="36.5" r="2.2" fill="#ffffff" />
    </svg>
  );
}
