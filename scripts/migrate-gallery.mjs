// One-off, re-runnable migration: catalog the existing /public/images photos as
// gallery metadata entries in data/gallery.json (the committed seed baseline).
//
//   node scripts/migrate-gallery.mjs
//
// Rules (per spec §11/§12):
//  · The curated dob/g1–g9 set becomes the live gallery (published).
//  · entrance.png is the studio/interior shot (category 'studio', published).
//  · The raw "WhatsApp …" photos are imported UNPUBLISHED so the owner reviews
//    and categorises them in the admin before they ever show publicly — we never
//    guess nails-vs-eyes and mislabel them.
//  · Service-card / testimonial images are skipped (they belong to other sections).
//  · uploadedAt is staggered so the gallery sorts newest-first deterministically.

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = process.cwd()
const imagesDir = path.join(root, 'public', 'images')
const outFile = path.join(root, 'data', 'gallery.json')

// Curated homepage set → published gallery. Alts mirror lib/media.ts.
const CURATED = [
  { file: 'dob/g1.jpg', category: 'nails', alt: 'Nail art floral réalisé chez Do Beauty', tags: ['nail-art', 'floral'] },
  { file: 'dob/g5.jpg', category: 'nails', alt: 'French manucure jaune et détail graphique', tags: ['french', 'nail-art'] },
  { file: 'dob/g2.jpg', category: 'nails', alt: 'Manucure nude nacrée aux finitions soignées', tags: ['nude', 'manucure'] },
  { file: 'dob/g4.jpg', category: 'nails', alt: 'Création nail art personnalisée en gros plan', tags: ['nail-art'] },
  { file: 'dob/g6.jpg', category: 'nails', alt: 'Manucure semi-permanente élégante', tags: ['semi-permanent'] },
  { file: 'dob/g7.jpg', category: 'nails', alt: 'Nail art bridal blanc et détails dorés', tags: ['nail-art', 'french', 'mariage'] },
  { file: 'dob/g8.jpg', category: 'nails', alt: 'Manucure chrome perlée, teinte neutre', tags: ['chrome'] },
  { file: 'dob/g9.jpg', category: 'nails', alt: 'Pose de vernis soignée, mains manucurées', tags: ['manucure'] },
  { file: 'dob/g3.jpg', category: 'eyes', alt: 'Beauté du regard — cils rehaussés chez Do Beauty', tags: ['cils', 'rehaussement'] },
  { file: 'entrance.png', category: 'studio', alt: 'Intérieur de l’institut Do Beauty à Gentilly', tags: ['institut', 'intérieur'] },
]

// Files that are NOT gallery portfolio (used elsewhere on the site).
const SKIP = new Set(['svc-manucure.jpg', 'svc-nailart.jpg', 'svc-regard.jpg', 'testimonial.jpg'])

const IMG_RE = /\.(jpe?g|png|webp)$/i
const now = Date.parse('2026-08-09T18:00:00.000Z')
const minute = 60_000
let seq = 0
const entry = (o) => {
  const uploadedAt = new Date(now - seq++ * minute).toISOString()
  return {
    id: `img_${crypto.randomUUID()}`,
    title: o.title ?? '',
    alt: o.alt,
    category: o.category,
    tags: o.tags ?? [],
    published: o.published,
    storage: 'static',
    src: o.src,
    uploadedAt,
    createdAt: uploadedAt,
    updatedAt: uploadedAt,
  }
}

const out = []

// 1) curated set first (newest → they lead the grid)
for (const c of CURATED) {
  const abs = path.join(imagesDir, c.file)
  if (!fs.existsSync(abs)) {
    console.warn(`skip (missing): ${c.file}`)
    continue
  }
  out.push(entry({ ...c, src: '/images/' + c.file, published: true }))
}

// 2) raw WhatsApp photos in the images root → unpublished, pending review
const curatedNames = new Set(CURATED.map((c) => c.file.split('/').pop()))
const rawFiles = fs
  .readdirSync(imagesDir)
  .filter((f) => IMG_RE.test(f) && !SKIP.has(f) && !curatedNames.has(f))
  .sort()

for (const f of rawFiles) {
  out.push(
    entry({
      src: '/images/' + encodeURIComponent(f),
      category: 'nails', // tentative default; owner re-categorises before publishing
      alt: 'Réalisation Do Beauty',
      tags: [],
      published: false,
    }),
  )
}

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n', 'utf-8')

const pub = out.filter((o) => o.published).length
console.log(`Wrote ${out.length} entries → ${path.relative(root, outFile)} (${pub} published, ${out.length - pub} unpublished for review)`)
