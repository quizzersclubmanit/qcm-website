// Per-route OG cards (1200x630) via satori + sharp — the next/og equivalent.
// Text-only branded cards (no image embedding issues), Poppins TTF from
// Fontsource CDN (cached in scripts/.cache). Falls back gracefully: routes
// keep /og-image.png when a card is missing.
const path = require("path")
const fs = require("fs")
const React = require("react")
const satori = require("satori").default || require("satori")
const sharp = require("sharp")

const root = path.join(__dirname, "..")
const outDir = path.join(root, "public", "og")
const cacheDir = path.join(__dirname, ".cache")

async function font(weight) {
  const cached = path.join(cacheDir, `poppins-${weight}.ttf`)
  if (fs.existsSync(cached)) return fs.readFileSync(cached)
  const url = `https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-${weight}-normal.ttf`
  const res = await fetch(url)
  if (!res.ok) throw new Error("font fetch failed: " + url)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.mkdirSync(cacheDir, { recursive: true })
  fs.writeFileSync(cached, buf)
  return buf
}

function card({ kicker, title, sub }) {
  return React.createElement(
    "div",
    {
      style: {
        width: 1200, height: 630, display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: 72,
        background: "linear-gradient(135deg, #0f3a2e 0%, #1d5c4a 60%, #2b7966 100%)",
        color: "white", fontFamily: "Poppins",
      },
    },
    React.createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 16 } },
      React.createElement("div", { style: { width: 56, height: 56, borderRadius: 16, background: "#fe9c02" } }),
      React.createElement("div", { style: { fontSize: 34, fontWeight: 600, letterSpacing: 4 } }, kicker)
    ),
    React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 12 } },
      React.createElement("div", { style: { fontSize: 76, fontWeight: 700, lineHeight: 1.05 } }, title),
      sub
        ? React.createElement("div", { style: { fontSize: 34, opacity: 0.85 } }, sub)
        : null
    ),
    React.createElement("div", { style: { fontSize: 30, opacity: 0.9 } }, "quizzersclub.com")
  )
}

async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(root, "src", "assets", "qcmData.json"), "utf8"))
  const [regular, bold, semibold] = await Promise.all([font(400), font(700), font(600)])
  const fonts = [
    { name: "Poppins", data: regular, weight: 400 },
    { name: "Poppins", data: semibold, weight: 600 },
    { name: "Poppins", data: bold, weight: 700 },
  ]
  const pages = [
    { slug: "home", kicker: "QUIZZERS' CLUB NIT BHOPAL", title: "QCM MANIT — Official College Quizzing Club", sub: "QBIT • Inter-City Quizzes • Events" },
    { slug: "team", kicker: "QCM MANIT", title: "Meet the Team", sub: "Quizzers' Club NIT Bhopal" },
    { slug: "faqs", kicker: "QCM MANIT", title: "FAQs", sub: "Quizzers' Club NIT Bhopal" },
    { slug: "signup", kicker: "QBIT'26 • 31 OCT 2026", title: "Register Your Team", sub: "Quizzers' Club NIT Bhopal • MANIT Campus" },
  ]
  for (const e of data.eventDetails || []) {
    pages.push({
      slug: `events-${e.id}`,
      kicker: "QUIZZERS' CLUB NIT BHOPAL",
      title: e.title.length > 42 ? e.title.slice(0, 42) + "…" : e.title,
      sub: e.desc || "QCM MANIT Quiz Event",
    })
  }
  fs.mkdirSync(outDir, { recursive: true })
  for (const p of pages) {
    const out = path.join(outDir, `${p.slug}.png`)
    const svg = await satori(card(p), { width: 1200, height: 630, fonts })
    await sharp(Buffer.from(svg)).png().toFile(out)
    console.log(`[og] ${p.slug}.png`)
  }
  console.log(`[og] done (${pages.length} cards)`)
}

main().catch((e) => {
  console.error("[og] failed (routes keep /og-image.png fallback):", e.message)
  process.exit(0)
})
