// One-command media pipeline (tech-only, no visual change):
//  1. Downsamples oversized raster sources in place (events ≤1600px q72,
//     bundled manit/team ≤1600px q75) — skips files already small enough.
//  2. Emits WebP sidecars (<basename>.webp) next to public/events images.
// Cache-aware: sidecars regenerate only when older than their source.
const path = require("path")
const fs = require("fs")
const os = require("os")
const crypto = require("crypto")

const root = path.join(__dirname, "..")
const sharp = require("sharp")
// Disable libvips FD caching: on Windows a cached read handle blocks
// overwriting the same source path (EPERM/UNKNOWN on copy-back).
sharp.cache(false)
sharp.concurrency(1)

function* walk(dir, exts) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p, exts)
    else if (exts.has(path.extname(entry.name).toLowerCase()) && !entry.name.includes(".tmp.")) yield p
  }
}

async function downsampleInPlace(file, maxW, quality) {
  const meta = await sharp(file).metadata()
  const size = fs.statSync(file).size
  if ((meta.width || 0) <= maxW && size < 500 * 1024) return "skip"
  // tmp outside the (possibly cloud-synced) repo tree: Windows/OneDrive
  // locks brand-new files in synced folders, breaking rename/copy back.
  const tmp = path.join(os.tmpdir(), "qcm-media-" + crypto.randomBytes(8).toString("hex") + ".jpg")
  const pipeline = sharp(file).rotate()
  if ((meta.width || 0) > maxW) pipeline.resize({ width: maxW, withoutEnlargement: true })
  const ext = path.extname(file).toLowerCase()
  if (ext === ".png") pipeline.png({ compressionLevel: 9, adaptiveFiltering: true })
  else pipeline.jpeg({ quality, mozjpeg: true })
  await pipeline.toFile(tmp)
  // copy+unlink instead of rename: Windows EPERM-safe on busy files
  fs.copyFileSync(tmp, file)
  fs.rmSync(tmp, { force: true })
  return "optimized"
}

const VARIANTS = [
  { suffix: "-800", width: 800 },
  { suffix: "-1600", width: 1600 },
]

// Responsive set per source: AVIF + WebP at 800/1600w (<base>-800.avif …).
// Cache-aware: regenerates only when older than the source.
async function responsiveSet(file) {
  const base = file.replace(/\.(jpe?g|png)$/i, "")
  let made = 0
  for (const v of VARIANTS) {
    for (const fmt of ["avif", "webp"]) {
      const out = `${base}${v.suffix}.${fmt}`
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(file).mtimeMs) continue
      const pipeline = sharp(file).rotate().resize({ width: v.width, withoutEnlargement: true })
      if (fmt === "avif") pipeline.avif({ quality: 60 })
      else pipeline.webp({ quality: 70 })
      await pipeline.toFile(out)
      made++
    }
  }
  return made
}

async function main() {
  let opt = 0, skip = 0, webp = 0
  const eventDirs = [path.join(root, "public", "events")]
  for (const dir of eventDirs) {
    if (!fs.existsSync(dir)) continue
    for (const f of walk(dir, new Set([".jpg", ".jpeg", ".png"]))) {
      if (f.endsWith(".webp")) continue
      const r1 = await downsampleInPlace(f, 1600, 72)
      if (r1 === "optimized") opt++
      else skip++
      // NOTE: keep original filenames (.JPG included) — qcmData.json
      // references them verbatim. Sidecars use <base>-<w>.<fmt> convention.
      webp += await responsiveSet(f)
    }
  }
  for (const [name, maxW, q] of [["manit.jpg", 1600, 75], ["team.jpg", 1600, 75], ["qcm-logo.png", 512, null], ["gradient-qcm-logo.png", 640, null]]) {
    const f = path.join(root, "src", "assets", name)
    if (!fs.existsSync(f)) continue
    if (name.endsWith(".png")) {
      // Re-encode oversized PNGs (5016px logo!): keep PNG, cap dimensions
      const meta = await sharp(f).metadata()
      if ((meta.width || 0) > maxW) {
        const tmp = path.join(os.tmpdir(), "qcm-media-" + crypto.randomBytes(8).toString("hex") + ".png")
        await sharp(f).rotate().resize({ width: maxW, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(tmp)
        fs.copyFileSync(tmp, f)
        fs.rmSync(tmp, { force: true })
        opt++
      }
    } else if ((await downsampleInPlace(f, maxW, q)) === "optimized") opt++
  }
  // Deterministic public derivatives from the (now small) logo source
  const logoSrc = path.join(root, "src", "assets", "qcm-logo.png")
  if (fs.existsSync(logoSrc)) {
    for (const [out, size] of [["logo.png", 512], ["apple-touch-icon.png", 180], ["placeholder-avatar.png", 256]]) {
      const dest = path.join(root, "public", out)
      await sharp(logoSrc).rotate().resize({ width: size, height: size, fit: "cover", withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(dest + ".new")
      fs.copyFileSync(dest + ".new", dest)
      fs.rmSync(dest + ".new", { force: true })
    }
  }
  // Gradient background as WebP (CSS url() refs updated to .webp)
  const bgPng = path.join(root, "public", "bg-gradient.png")
  const bgWebp = path.join(root, "public", "bg-gradient.webp")
  if (fs.existsSync(bgPng) && (!fs.existsSync(bgWebp) || fs.statSync(bgWebp).mtimeMs < fs.statSync(bgPng).mtimeMs)) {
    await sharp(bgPng).rotate().webp({ quality: 75 }).toFile(bgWebp)
    webp++
  }
  console.log(`[media] downsized=${opt} skipped=${skip} responsive-variants=${webp}`)
}

main().catch((e) => {
  console.error("[media] failed:", e.message)
  process.exit(1)
})
