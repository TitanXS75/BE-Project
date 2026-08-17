---
name: frontend-ui-standards
description: Frontend design patterns, Next.js 16/React 19 standards, Apple dark-glass UI, and strict no-arrow/no-emoji rules for Axiom web app.
---

# Frontend UI Standards & Design System

## When to Use This Skill
Load this skill ONLY when modifying or adding frontend components, landing pages, styles, animations, or layout structures in `apps/web` or `packages/ui`.

---

## 1. Strict Formatting & Style Prohibitions
- **NO ARROWS**: Never include unicode arrows (`→`, `←`, `↑`, `↓`, `->`, `=>`, `➔`, `➜`) in buttons, headers, links, or text copy.
- **NO EMOJIS**: Never include unicode emojis (`🚀`, `🤖`, `💡`, `🔥`, `✨`, `🎉`, etc.). Use Lucide React SVG icons instead.

---

## 2. Layout Structure & Responsive Widths
- **Expansive Landing Container**: Use `w-full max-w-[1440px] mx-auto py-6 px-4 sm:px-10 lg:px-16` for main landing pages.
- **Avoid Narrow Box Centering**: Do not wrap whole screens inside `max-w-4xl` or `my-auto` vertically squashed containers that look like modals on wide monitors.
- **Bento Grids**: Use `grid grid-cols-1 md:grid-cols-3` or `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` with rounded-3xl cards (`rounded-3xl border border-white/10 bg-[#161618]`).

---

## 3. Apple-Grade Dark Theme Tokens
```css
/* Core Palette */
--bg-pure: #000000;
--bg-surface: #0e0e10;
--bg-card: #161618;
--bg-subcard: #1c1c1e;
--text-primary: #f5f5f7;
--text-secondary: #86868b;
--border-subtle: rgba(255, 255, 255, 0.08);
--border-hover: rgba(255, 255, 255, 0.20);
--accent-blue: #0071e3;
--accent-green: #30d158;
--accent-amber: #ff9f0a;
```

---

## 4. Reusable Component Patterns
- **Buttons**:
  - Primary: `px-6 py-2.5 rounded-full bg-white text-black font-bold shadow-lg hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer`
  - Secondary Glass: `px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/12 text-xs sm:text-sm font-semibold text-[#86868b] hover:text-white transition-all cursor-pointer`
- **Ambient Lighting**:
  - `div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#0071e3]/15 blur-[160px] rounded-full"`
