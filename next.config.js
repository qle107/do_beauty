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
        ],
      },
    ]
  },
}

module.exports = nextConfig
