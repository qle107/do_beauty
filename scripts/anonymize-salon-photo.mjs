import sharp from 'sharp'

const SRC = 'public/images/salon_03.jpg'
const OUT = 'public/images/salon_03_anon.jpg'

// Boxes as fractions of the full image [x0, y0, x1, y1].
// Blur the two CUSTOMERS only - Vy (technician, white top, center) stays sharp.
const BOXES = [
  [0.68, 0.17, 0.88, 0.36], // right customer (dark top, long hair, smiling)
  [0.00, 0.00, 0.10, 0.15], // reclining customer's head (upper-left, mostly off-frame)
]

const { width: W, height: H } = await sharp(SRC).metadata()
const overlays = []
for (const [fx0, fy0, fx1, fy1] of BOXES) {
  const left = Math.max(0, Math.round(fx0 * W))
  const top = Math.max(0, Math.round(fy0 * H))
  const width = Math.min(W - left, Math.round((fx1 - fx0) * W))
  const height = Math.min(H - top, Math.round((fy1 - fy0) * H))
  const region = await sharp(SRC).extract({ left, top, width, height }).toBuffer()
  const px = Math.max(6, Math.round(width / 10))
  // Two-stage: sharp collapses chained .resize() calls into the last one,
  // so we materialize the tiny intermediate buffer first, then scale it back up.
  const tiny = await sharp(region).resize(px, null, { kernel: 'nearest' }).toBuffer()
  const mosaic = await sharp(tiny)
    .resize(width, height, { kernel: 'nearest' })
    .blur(8)
    .png()
    .toBuffer()
  overlays.push({ input: mosaic, left, top })
}
await sharp(SRC).composite(overlays).jpeg({ quality: 88 }).toFile(OUT)
console.log(`Wrote ${OUT} (${W}x${H})`)
