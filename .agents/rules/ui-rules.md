# UI/UX & Frontend Styling Rules

## 1. Absolute Constraints (Zero Tolerance)
- **NO ARROWS**: Do not use unicode arrows (`→`, `←`, `↑`, `↓`, `➔`, `➜`, `->`, `=>`) anywhere in buttons, text copy, labels, tooltips, or headers. Write clean descriptive action text (e.g., "Proceed to Onboarding", "Launch Setup", "Download EXE", "Back to Home").
- **NO EMOJIS**: Do not use emojis (`🚀`, `🤖`, `💡`, `🔥`, `✨`, `🎉`, `📚`, etc.) in the website interface. Use official Lucide React SVG icons (`<Shield />`, `<Zap />`, `<Database />`, `<Cpu />`, etc.) for visual accents.

## 2. Layout & Width Rules
- **Full-Width Landing Experience**: Never center content inside constrained small boxes (`max-w-4xl` / `max-w-5xl` with `my-auto`) that look like floating modals on desktop viewports.
- Use `max-w-[1440px] w-full mx-auto` with responsive horizontal padding (`px-4 sm:px-10 lg:px-16`) to create expansive, premium desktop layouts.
- Spacing: Use proportional vertical rhythm (`gap-6` to `gap-8`, section spacing `py-10 sm:py-14`).

## 3. Dark Mode Palette & Tokens
- **Backgrounds**: Deep OLED Black (`#000000`), Dark Gray Canvas (`#0e0e10`), Component Card Surfaces (`#161618`), Inner Pill Backgrounds (`#1c1c1e`).
- **Accents**: Apple Blue (`#0071e3`), Emerald Green (`#30d158`), Amber Warning (`#ff9f0a`), Sky Info (`#38bdf8`), Purple AI Accent (`#a855f7`).
- **Typography**: Apple System Sans (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`).
- **Borders**: Thin translucent borders (`border-white/[0.08]` default, `border-white/20` on hover, `border-[#0071e3]` for active states).
