export const AXIOM_COLORS = {
  background: {
    pure: "#000000",
    surface: "#0e0e10",
    surfaceElevated: "#161618",
    surfaceInteractive: "#1c1c1e",
    surfaceSubtle: "rgba(255, 255, 255, 0.03)",
  },
  accent: {
    appleBlue: "#0071e3",
    appleBlueHover: "#0077ed",
    appleBlueMuted: "rgba(0, 113, 227, 0.15)",
    cyan: "#38bdf8",
    purple: "#a855f7",
  },
  status: {
    success: "#30d158",
    successMuted: "rgba(48, 209, 88, 0.15)",
    warning: "#ff9f0a",
    warningMuted: "rgba(255, 159, 10, 0.15)",
    error: "#ff453a",
    errorMuted: "rgba(255, 69, 58, 0.15)",
    info: "#38bdf8",
    infoMuted: "rgba(56, 189, 248, 0.15)",
  },
  text: {
    primary: "#ffffff",
    secondary: "#86868b",
    tertiary: "#515154",
    muted: "#3a3a3c",
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.08)",
    medium: "rgba(255, 255, 255, 0.12)",
    prominent: "rgba(255, 255, 255, 0.20)",
    glow: "rgba(0, 113, 227, 0.40)",
  },
} as const;

export type AxiomColorTokens = typeof AXIOM_COLORS;
