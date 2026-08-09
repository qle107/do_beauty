# VyNail Cure Boutique - Design System (MASTER)

> Global source of truth. Page-specific deviations live in `design-system/pages/<page>.md`
> and override these rules. If no page file exists, use this file exclusively.
>
> Generated from UI/UX Pro Max `--design-system` and adopted as the project palette.

## Pattern - Hero-Centric + Social Proof
- Primary CTA above the fold.
- Section order: **Hero → Features → Social Proof → CTA**.

## Style - Soft UI Evolution
- Evolved soft UI: subtle depth, softer-than-flat / clearer-than-neumorphism shadows.
- Light mode primary (dark mode supported but not the default target).
- Transitions 200–300ms, visible focus, WCAG AA+.

## Color Tokens

| Role | Hex | Tailwind token |
|------|-----|----------------|
| Primary | `#EC4899` | `coral` / `rosegold-500` |
| Primary hover | `#DB2777` | `coral-dark` / `rosegold-600` |
| On primary | `#FFFFFF` | - |
| Secondary | `#F9A8D4` | `peach-400` / `secondary` |
| Accent / CTA | `#8B5CF6` | `accent` |
| Accent hover | `#7C3AED` | `accent-dark` |
| Background | `#FDF2F8` | `cream` / `nude-50` |
| Section surface | `#FCE7F3` | `blush` / `nude-100` |
| Card surface | `#FBE0EE` | `nude-200` |
| Foreground (text) | `#831843` | `dark` / `charcoal-900` |
| Muted text | `#9B4A6E` | `charcoal-500` |
| Secondary text | `#6E1E3C` | `charcoal-700` |
| Border / divider | `#FBCFE8` | `nude-300` |
| Muted surface | `#F1EEF5` | - |
| Destructive | `#DC2626` | - |
| Ring (focus) | `#EC4899` | - |

Notes: Soft pink + lavender luxury. Functional colors (error red, success) must pair with an icon/text, not color alone.

## Typography - Playfair Display / Inter
- **Headings:** Playfair Display (`font-serif`, `var(--font-playfair)`) - elegant, editorial, luxury.
- **Body / UI:** Inter (`font-sans`, `var(--font-inter)`) - 16px base, line-height 1.5–1.75.
- **Decorative script:** Dancing Script (`font-script`, `.text-script`) - accents only.

## Effects
- Soft shadows scale: `luxe-xs / luxe-sm / luxe-md / luxe-lg` (tinted with foreground `#831843`, never pure black).
- Radius: rounded, soft. Hover/press states animate 150–300ms.

## Avoid
- Bright neon colors.
- Harsh / abrupt animations.
- Dark-on-dark low-contrast text.

## Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons / Lucide).
- [ ] `cursor-pointer` on all clickable elements.
- [ ] Hover states with smooth 150–300ms transitions.
- [ ] Light mode text contrast ≥ 4.5:1.
- [ ] Visible keyboard focus states.
- [ ] `prefers-reduced-motion` respected.
- [ ] Responsive at 375 / 768 / 1024 / 1440px.
