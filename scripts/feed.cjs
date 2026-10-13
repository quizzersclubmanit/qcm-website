// RSS feed of QCM quiz events (data-only, no new copy) for
// Discover/readers. Written to public/feed.xml on every prebuild.
const path = require("path")
const fs = require("fs")

const root = path.join(__dirname, "..")
const SITE = "https://www.quizzersclub.com"

const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

function main() {
  const data = JSON.parse(fs.readFileSync(path.join(root, "src", "assets", "qcmData.json"), "utf8"))
  const mtime = fs.statSync(path.join(root, "src", "assets", "qcmData.json")).mtime.toUTCString()
  const items = (data.eventDetails || [])
    .map(
      (e) => `    <item>
      <title>${esc(e.title)} — Quizzers' Club NIT Bhopal</title>
      <link>${SITE}/events/${esc(e.id)}</link>
      <guid isPermaLink="true">${SITE}/events/${esc(e.id)}</guid>
      <description>${esc(e.desc || e.title)}</description>
    </item>`
    )
    .join("\n")
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Quizzers' Club NIT Bhopal (QCM MANIT) — Quiz Events</title>
    <link>${SITE}/</link>
    <description>Quiz events, competitions and updates from Quizzers' Club NIT Bhopal (QCM MANIT).</description>
    <language>en-in</language>
    <lastBuildDate>${mtime}</lastBuildDate>
${items}
  </channel>
</rss>
`
  fs.writeFileSync(path.join(root, "public", "feed.xml"), xml)
  console.log(`[feed] feed.xml (${(data.eventDetails || []).length} items)`)
}

main()
