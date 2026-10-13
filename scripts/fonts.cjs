// Self-host Poppins (latin 400/500/600/700, woff2) — removes the Google Fonts
// runtime dependency (one less third-party connection, zero FOUT variance).
// Cache-aware: regenerates poppins.css when the weight set grows.
const path = require("path")
const fs = require("fs")

const dir = path.join(__dirname, "..", "public", "fonts")
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

async function main() {
  const targets = ["poppins-400-latin.woff2", "poppins-500-latin.woff2", "poppins-600-latin.woff2", "poppins-700-latin.woff2"]
  if (targets.every((f) => fs.existsSync(path.join(dir, f))) && fs.existsSync(path.join(dir, "poppins.css"))) {
    console.log("[fonts] cached — skipping download")
    return
  }
  const cssUrl = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
  const res = await fetch(cssUrl, { headers: { "User-Agent": UA } })
  if (!res.ok) throw new Error("css2 fetch failed: " + res.status)
  const css = await res.text()
  // Split into /* subset */ @font-face blocks; keep latin only
  const blocks = css.match(/\/\* [a-z-]+ \*\/\s*@font-face \{[^}]+\}/g) || []
  const wanted = { 400: null, 500: null, 600: null, 700: null }
  let subset = ""
  for (const line of css.split("\n")) {
    const m = line.match(/\/\* ([a-z-]+) \*\//)
    if (m) subset = m[1]
    const w = line.match(/font-weight:\s*(\d+)/)
    const u = line.match(/url\((https:[^)]+\.woff2)\)/)
    if (w && u && subset === "latin" && wanted[w[1]] === null) {
      // handled below per-block instead
    }
  }
  for (const b of blocks) {
    if (!b.startsWith("/* latin */")) continue
    const w = b.match(/font-weight:\s*(\d+)/)?.[1]
    const u = b.match(/url\((https:[^)]+\.woff2)\)/)?.[1]
    if (w && u && wanted[w] === null) wanted[w] = u
  }
  if (Object.values(wanted).some((u) => !u)) throw new Error("could not parse all latin woff2 URLs")
  fs.mkdirSync(dir, { recursive: true })
  let outCss = ""
  for (const [weight, url] of Object.entries(wanted)) {
    const file = `poppins-${weight}-latin.woff2`
    const dest = path.join(dir, file)
    const dl = await fetch(url, { headers: { "User-Agent": UA } })
    if (!dl.ok) throw new Error("font download failed: " + url)
    fs.writeFileSync(dest, Buffer.from(await dl.arrayBuffer()))
    // Metric overrides from the REAL font tables: the fallback font uses
    // Poppins' exact line box, killing most swap-induced CLS.
    let metrics = ""
    try {
      const fontkit = require("fontkit")
      const f = fontkit.openSync(dest)
      const u = f.unitsPerEm || 1000
      const pct = (v) => (Math.abs(v) / u * 100).toFixed(2).replace(/\.?0+$/, "") + "%"
      metrics = `\n  ascent-override: ${pct(f.ascent)};\n  descent-override: ${pct(f.descent)};\n  line-gap-override: ${pct(f.lineGap || 0)};`
    } catch (e) {
      console.log(`[fonts] metric read skipped for ${file}: ${e.message}`)
    }
    outCss += `@font-face {\n  font-family: "Poppins";\n  font-style: normal;\n  font-weight: ${weight};\n  font-display: swap;\n  src: url("/fonts/${file}") format("woff2");${metrics}\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n`
    console.log(`[fonts] ${file} (${fs.statSync(dest).size} bytes)`)
  }
  fs.writeFileSync(path.join(dir, "poppins.css"), outCss)
  console.log("[fonts] poppins.css written")
}

main().catch((e) => {
  console.error("[fonts] failed (keeping Google Fonts fallback):", e.message)
  process.exit(0) // never fail the build on font download issues
})
