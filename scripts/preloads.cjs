// Next.js-style route-chunk preloading: reads Vite's manifest and injects
// <link rel="modulepreload"> for each prerendered route's lazy chunk (+ its
// static imports) into that route's <head>. Without this, route chunks
// waterfall after the main bundle parses — delaying boot, LCP, and forcing
// the Suspense fallback to flash (layout shift) on every route.
// Runs AFTER prerender-dom (edits final dist route files).
const path = require("path")
const fs = require("fs")

const dist = path.join(__dirname, "..", "dist")

const ROUTE_ENTRY = {
  "team/index.html": "src/pages/Team.jsx",
  "faqs/index.html": "src/components/FAQs.jsx",
  "signup/index.html": "src/components/SignupPage.jsx",
  "events/iqc/index.html": "src/pages/Event.jsx",
  "events/manthan/index.html": "src/pages/Event.jsx",
  "events/anveshan/index.html": "src/pages/Event.jsx",
  "events/vihaan/index.html": "src/pages/Event.jsx",
  "events/flashback-fiesta/index.html": "src/pages/Event.jsx",
  "events/aps-quiz/index.html": "src/pages/Event.jsx",
}

function collectJs(manifest, key, seen = new Set()) {
  const entry = manifest[key]
  if (!entry) return []
  const out = []
  const visit = (k) => {
    const e = manifest[k]
    if (!e || seen.has(k)) return
    seen.add(k)
    if (e.file && e.file.endsWith(".js")) out.push("/" + e.file)
    for (const imp of e.imports || []) visit(imp)
  }
  visit(key)
  return [...new Set(out)]
}

function main() {
  const manifestPath = path.join(dist, ".vite", "manifest.json")
  if (!fs.existsSync(manifestPath)) {
    console.log("[preloads] no manifest — skipping")
    return
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  let n = 0
  for (const [rel, entryKey] of Object.entries(ROUTE_ENTRY)) {
    const p = path.join(dist, rel)
    if (!fs.existsSync(p)) continue
    const files = collectJs(manifest, entryKey).slice(0, 8)
    if (!files.length) continue
    let html = fs.readFileSync(p, "utf8")
    const missing = files.filter((f) => !html.includes(`href="${f}"`))
    if (!missing.length) continue // idempotent per-file
    const tags = missing.map((f) => `    <link rel="modulepreload" href="${f}" />`).join("\n")
    html = html.replace("</title>", `</title>\n${tags}`)
    fs.writeFileSync(p, html)
    n += files.length
    console.log(`[preloads] ${rel}: ${files.length} chunks`)
  }
  console.log(`[preloads] ${n} modulepreload tags total`)
}

main()
