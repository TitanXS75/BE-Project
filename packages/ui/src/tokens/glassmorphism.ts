export const AXIOM_GLASS_PRESETS = {
  cardBase: "bg-[#0e0e10]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-2xl",
  cardElevated: "bg-[#161618]/90 backdrop-blur-2xl border border-white/[0.12] shadow-2xl rounded-3xl",
  interactiveItem: "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-200",
  interactiveActive: "bg-[#0071e3]/15 border-[#0071e3]/40 text-white shadow-lg shadow-[#0071e3]/10",
  modalOverlay: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4",
  ambientGlow: "absolute rounded-full blur-[140px] pointer-events-none opacity-40",
} as const;

export const AXIOM_BLURS = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
} as const;
