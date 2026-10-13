// Self-host sponsor brand logos (kills third-party cookies, weight and
// hotlink-rot risk). Downloads each remote logo once into
// public/sponsors/vendor/ and writes src/generated/sponsor-logos.json
// mapping remote URL -> local path. Cache-aware: skips existing files
// unless SPONSORS_REFRESH=1. Same visuals, local bytes.
const path = require("path")
const fs = require("fs")

const root = path.join(__dirname, "..")
const outDir = path.join(root, "public", "sponsors", "vendor")
const manifestPath = path.join(root, "src", "generated", "sponsor-logos.json")
const refresh = process.env.SPONSORS_REFRESH === "1"

const slug = (s) =>
  String(s || "sponsor").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "sponsor"

function collect(node, out) {
  if (!node) return
  if (Array.isArray(node)) return node.forEach((n) => collect(n, out))
  if (node.brands) return node.brands.forEach((n) => collect(n, out))
  if (node.brand && typeof node.brand === "object") return collect(node.brand, out)
  if (node.logo && /^https?:\/\//i.test(node.logo)) out.push({ name: node.name || node.brand, url: node.logo })
}

async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(root, "src", "assets", "qcmData.json"), "utf8"))
  const logos = []
  ;(data.sponsors || []).forEach((s) => collect(s, logos))
  const seen = new Map()
  for (const l of logos) if (!seen.has(l.url)) seen.set(l.url, l.name)

  fs.mkdirSync(outDir, { recursive: true })
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  let manifest = {}
  try { manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) } catch { /* fresh */ }

  let fetched = 0
  let i = 0
  for (const [url, name] of seen) {
    const base = `${slug(name)}-${i++}`
    const existing = Object.entries(manifest).find(([u]) => u === url)?.[1]
    if (existing && fs.existsSync(path.join(root, "public", existing.replace(/^\//, "").replace(/\//g, path.sep))) && !refresh) continue
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36" }, redirect: "follow" })
      if (!res.ok) throw new Error("HTTP " + res.status)
      const ct = (res.headers.get("content-type") || "").toLowerCase()
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 512) throw new Error("suspiciously small body")
      let ext = ".jpg"
      let file
      if (ct.includes("svg")) {
        ext = ".svg"
        file = `${base}${ext}`
        fs.writeFileSync(path.join(outDir, file), buf)
      } else {
        if (ct.includes("png")) ext = ".png"
        else if (ct.includes("webp")) ext = ".webp"
        file = `${base}-400${ext}`
        const sharp = require("sharp")
        const pipeline = sharp(buf).rotate().resize({ width: 400, withoutEnlargement: true })
        if (ext === ".png") pipeline.png({ compressionLevel: 9 })
        else if (ext === ".webp") pipeline.webp({ quality: 75 })
        else pipeline.jpeg({ quality: 78, mozjpeg: true })
        await pipeline.toFile(path.join(outDir, file))
      }
      manifest[url] = `/sponsors/vendor/${file}`
      fetched++
      console.log(`[sponsors] ${name} -> ${file} (${(buf.length / 1024).toFixed(0)}KB src)`)
    } catch (e) {
      console.log(`[sponsors] SKIP ${name} (${e.message}) — remote URL kept`)
    }
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`[sponsors] manifest: ${Object.keys(manifest).length} local, fetched ${fetched} this run`)
}

main().catch((e) => {
  console.error("[sponsors] failed (remote URLs kept):", e.message)
  process.exit(0)
})
