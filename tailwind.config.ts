import type { Config } from 'tailwindcss'

/**
 * Soft UI Evolution design system (pink + lavender luxury).
 *
 * The original token names (`coral`, `blush`, `cream`, `dark`, `sage`, `slate`)
 * are kept stable so existing component classes remain valid - only their hex
 * values have shifted toward a pink / lavender / magenta palette.
 *
 *  coral   #EC4899 → #BE185D  accent on LIGHT bg (raspberry, AA ≥5:1)
 *  coral.light        #F9A8D4  accent text on DARK (#831843) bg (AA ≥5:1)
 *  blush   #F5EDE6 → #FCE7F3 (nude-100)      soft section background
 *  cream   #FBF7F4 → #FDF2F8 (nude-50)       page background
 *  dark    #2A2622 → #831843 (charcoal-900)  text + primary CTA bg
 *
 * Accent accessibility: the original coral #EC4899 only reached 3.0–3.5:1 on the
 * light backgrounds (failed WCAG AA for text). It is darkened to #BE185D for
 * on-light text/links/icons and as a button background with cream text, and a
 * lighter coral.light (#F9A8D4) is used for accent text on the dark sections.
 * The bright #EC4899 lives on as `rosegold-500` for purely graphical pops
 * (rating stars, dot clusters) where the 3:1 UI-component threshold applies.
 *
 * New extended scales (`rosegold`, `peach`, `nude`, `charcoal`) and the
 * lavender `accent` token are available for new components.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── DO BEAUTY quiet-luxury palette ────────────────────────────────
        // The legacy token NAMES (coral, blush, cream, dark, charcoal, nude…)
        // are kept so the ~50 existing components stay valid; only their VALUES
        // are re-mapped from pink/lavender to warm ivory / champagne / near-black.
        // Mirrors the --db-* tokens in app/globals.css.
        coral: {
          DEFAULT: '#9E7A38',  // champagne-gold accent (text/links/borders) — AA on ivory
          dark: '#2A2521',     // warm near-black — CTA hover bg keeps cream/ivory text readable
          light: '#D8C39A',    // light champagne — accent text on dark sections
        },
        blush: '#F0EBE2',      // soft warm-beige section bg (was pink #FCE7F3)
        cream: '#F5F1EA',      // page bg — db-bg (was pink #FDF2F8)
        dark: '#171614',       // near-black foreground — db-ink (was magenta #831843)
        sage: '#8A9A72',       // unchanged (legacy, rarely used)
        slate: '#A8B0B8',      // unchanged (legacy, rarely used)

        // ── Champagne scales (decorative gold pops: stars, dots) ──────────
        rosegold: {
          400: '#D8C39A',      // light champagne
          500: '#C8A66A',      // champagne (= db-champagne)
          600: '#B7935A',      // deeper champagne (= db-champagne-dim)
        },
        peach: {
          400: '#E4D6B8',      // soft champagne (badges, hovers)
          500: '#D8C39A',      // champagne highlight
        },
        nude: {
          50:  '#FAF8F4',      // ivory surface (db-ivory)
          100: '#F0EBE2',      // warm beige section
          200: '#E7E0D4',      // card surface
          300: '#DED6CA',      // dividers / border (db-stone)
        },
        charcoal: {
          500: '#6F675C',      // muted body text — AA on ivory
          700: '#48433C',      // secondary text (db-ink-soft)
          900: '#171614',      // near-black (db-ink)
        },
        beige: {
          50:  '#F5F1EA',      // page bg variant
          100: '#F0EBE2',      // soft section variant
        },

        // ── Champagne accent (replaces the old lavender) ──────────────────
        accent: {
          DEFAULT: '#C8A66A',  // champagne accent
          dark: '#B7935A',     // accent hover
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        script: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        // Luxury soft shadows - never hard, never black (tinted with warm ink)
        'luxe-xs': '0 1px 2px rgba(23,22,20,0.04)',
        'luxe-sm': '0 2px 8px rgba(23,22,20,0.06)',
        'luxe-md': '0 8px 24px rgba(23,22,20,0.08)',
        'luxe-lg': '0 16px 48px rgba(23,22,20,0.10)',
      },
    },
  },
  plugins: [],
}

export default config
