// Custom sitemap (replaces vite-plugin-sitemap output): URL entries with
// Google Images extensions for event photos + data-derived lastmod.
// Runs after `vite build` (dist exists), before prerender injection.
const path = require("path")
const fs = require("fs")

const root = path.join(__dirname, "..")
const dist = path.join(root, "dist")
const SITE = "https://www.quizzersclub.com"

const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

function main() {
  const data = JSON.parse(fs.readFileSync(path.join(root, "src", "assets", "qcmData.json"), "utf8"))
  const lastmod = fs.statSync(path.join(root, "src", "assets", "qcmData.json")).mtime.toISOString().split("T")[0]

  const urls = [
    { loc: "/", freq: "weekly", pri: "1.0" },
    { loc: "/signup", freq: "weekly", pri: "0.9" },
    { loc: "/team", freq: "monthly", pri: "0.8" },
    { loc: "/faqs", freq: "monthly", pri: "0.8" },
  ]
  for (const e of data.eventDetails || []) {
    urls.push({ loc: `/events/${e.id}`, freq: "monthly", pri: "0.7", event: e })
  }

  const body = urls
    .map((u) => {
      const images = (u.event ? [u.event.cover, ...(u.event.images || [])] : [])
        .filter((src) => typeof src === "string" && !/^https?:\/\//i.test(src))
        .filter((src, i, arr) => arr.indexOf(src) === i)
        .slice(0, 20)
        .map((src) => `      <image:image>\n        <image:loc>${SITE}${esc(src)}</image:loc>\n      </image:image>`)
        .join("\n")
      return `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n${images ? images + "\n" : ""}  </url>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`
  fs.writeFileSync(path.join(dist, "sitemap.xml"), xml)
  const imgCount = (xml.match(/<image:loc>/g) || []).length
  console.log(`[sitemap] sitemap.xml (${urls.length} urls, ${imgCount} images, lastmod ${lastmod})`)
}

main()
