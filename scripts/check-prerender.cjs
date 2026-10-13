// Build gate: asserts per-route SEO invariants on dist/ output.
// Fails the build (exit 1) on any regression.
const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")
const dist = path.join(root, "dist")
const SITE = "https://www.quizzersclub.com"

const expectations = {
  "index.html": { title: /Quizzers' Club NIT Bhopal/, h1: 1, canonical: SITE + "/" },
  "team/index.html": { title: /Meet the Team/, h1: 1, canonical: SITE + "/team" },
  "faqs/index.html": { title: /FAQs/, h1: 1, canonical: SITE + "/faqs", schema: "FAQPage" },
  "signup/index.html": { title: /QBIT/, h1: 1, canonical: SITE + "/signup" },
  "events/iqc/index.html": { title: /Inter-City Quizzing Challenge/, h1: 1, canonical: SITE + "/events/iqc", schema: "Event" },
  "events/manthan/index.html": { title: /Manthan/, h1: 1, canonical: SITE + "/events/manthan" },
  "events/anveshan/index.html": { title: /Anveshan/, h1: 1, canonical: SITE + "/events/anveshan" },
  "events/vihaan/index.html": { title: /Vihaan/, h1: 1, canonical: SITE + "/events/vihaan" },
  "events/flashback-fiesta/index.html": { title: /Flashback Fiesta/, h1: 1, canonical: SITE + "/events/flashback-fiesta" },
  "events/aps-quiz/index.html": { title: /APS Quiz/, h1: 1, canonical: SITE + "/events/aps-quiz" },
}

let failures = 0
const fail = (msg) => {
  failures++
  console.log("[check] FAIL:", msg)
}

for (const [rel, exp] of Object.entries(expectations)) {
  const p = path.join(dist, rel)
  if (!fs.existsSync(p)) {
    fail(`${rel} missing`)
    continue
  }
  const h = fs.readFileSync(p, "utf8")
  const title = (h.match(/<title>(.*?)<\/title>/s) || ["", ""])[1]
  if (!exp.title.test(title)) fail(`${rel} title mismatch: ${title.slice(0, 80)}`)
  const h1Count = [...h.matchAll(/<h1[^>]*>/g)].length
  if (h1Count !== exp.h1) fail(`${rel} expected ${exp.h1} H1, found ${h1Count}`)
  if (!h.includes(`<link rel="canonical" href="${exp.canonical}"`)) fail(`${rel} canonical mismatch`)
  if (h.includes("Unexpected Application Error")) fail(`${rel} contains React error boundary`)
  if (!h.includes('property="og:image" content="' + SITE + "/og/")) fail(`${rel} missing per-route og:image`)
  if (exp.schema && !h.includes(`"@type":"${exp.schema}"`)) fail(`${rel} missing ${exp.schema} schema`)
  const desc = h.match(/<meta name="description" content="(.*?)"/s)?.[1] || ""
  if (desc.length < 50 || desc.length > 320) fail(`${rel} description length ${desc.length}`)
}

// Sitemap parity: every prerendered route indexed, no stale entries
const sitemap = path.join(dist, "sitemap.xml")
if (!fs.existsSync(sitemap)) {
  fail("sitemap.xml missing")
} else {
  const xml = fs.readFileSync(sitemap, "utf8")
  for (const rel of Object.keys(expectations)) {
    const url = rel === "index.html" ? SITE + "/" : SITE + "/" + rel.replace(/\/index\.html$/, "")
    if (!xml.includes(url)) fail(`sitemap missing ${url}`)
  }
}

// Feed + OG artifacts
if (!fs.existsSync(path.join(dist, "feed.xml"))) fail("feed.xml missing")
for (const slug of ["home", "team", "faqs", "signup"]) {
  if (!fs.existsSync(path.join(dist, "og", `${slug}.png`))) fail(`og/${slug}.png missing`)
}
if (!fs.existsSync(path.join(dist, "robots.txt"))) fail("robots.txt missing")

if (failures) {
  console.log(`[check] ${failures} failure(s) — build rejected`)
  process.exit(1)
}
console.log("[check] all SEO gates passed")
