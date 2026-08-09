/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't advertise the framework via the X-Powered-By response header
  poweredByHeader: false,

  // Remove the Next.js dev tools indicator (the floating "N" badge)
  devIndicators: false,

  // googleapis and mysql2 use Node.js built-ins - keep them server-side only
  serverExternalPackages: ['googleapis', 'mysql2'],

  // Allow dev HMR/resource requests when accessing the dev server over the LAN
  allowedDevOrigins: ['192.168.1.180'],

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },

  async headers() {
    return [
      {
        source: '/images/:all*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Content-Security-Policy: a backstop that contains the blast radius of any
          // future markup-injection. 'unsafe-inline' on script-src is required by
          // Next.js's inline bootstrap + the inline JSON-LD; external scripts are
          // limited to Cloudflare Turnstile + Google Tag Manager / Analytics.
          // NOTE: after deploy, verify booking (Turnstile) + analytics still fire; if
          // a tag is blocked, add its host here (or ship as -Report-Only first).
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com",
              "frame-src https://challenges.cloudflare.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join('; '),
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
