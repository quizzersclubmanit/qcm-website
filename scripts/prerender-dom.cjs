// Full-DOM prerender via headless system Chrome (puppeteer-core, no download).
// Runs AFTER scripts/prerender.cjs (which already wrote per-route <head> +
// #seo-fallback). For each route this loads the page in Chromium, waits for
// React + intro animations to settle, then transplants the live <body> into
// the injected file (keeping its verified <head>) and drops #seo-fallback
// (full React HTML supersedes it). Falls back silently per-route on failure.
const path = require("path")
const fs = require("fs")
const http = require("http")

const staticDir = path.join(__dirname, "..", "dist")
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const routes = [
  "/",
  "/team",
  "/faqs",
  "/signup",
  "/events/iqc",
  "/events/manthan",
  "/events/anveshan",
  "/events/vihaan",
  "/events/flashback-fiesta",
  "/events/aps-quiz",
]

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".JPG": "image/jpeg",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".pdf": "application/pdf",
}

function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split("?")[0])
      let filePath = path.join(staticDir, urlPath)
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath)
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" })
        fs.createReadStream(filePath).pipe(res)
        return
      }
      // SPA fallback
      const index = fs.readFileSync(path.join(staticDir, "index.html"))
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      res.end(index)
    } catch (e) {
      res.writeHead(500)
      res.end("prerender server error")
    }
  })
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server))
  })
}

function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return m ? m[1] : null
}

async function main() {
  if (!fs.existsSync(CHROME)) {
    console.log("[prerender-dom] system Chrome not found — skipping (injection output kept)")
    return
  }
  const puppeteer = require("puppeteer-core")
  const server = await startServer()
  const port = server.address().port
  console.log("[prerender-dom] server on 127.0.0.1:" + port)

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    headless: "new",
  })

  let ok = 0
  try {
    for (const route of routes) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1366, height: 900 })
      try {
        await page.goto(`http://127.0.0.1:${port}${route}?prerender=1`, {
          waitUntil: "networkidle0",
          timeout: 60000,
        })
        await page.waitForFunction(
          "window.__PRERENDER_READY === true && document.querySelector('#root > *')",
          { timeout: 30000 }
        )
        const snapshot = await page.content()
        const snapBody = extractBody(snapshot)
        const outPath =
          route === "/" ? path.join(staticDir, "index.html") : path.join(staticDir, route, "index.html")
        const current = fs.readFileSync(outPath, "utf8")
        if (!snapBody || !snapBody.includes('id="root"')) {
          console.log(`[prerender-dom] ${route} — snapshot unusable, keeping injection output`)
          continue
        }
        // Keep the verified injected <head>; transplant live <body>,
        // minus the now-redundant #seo-fallback (full React HTML present).
        const liveBody = snapBody.replace(/<div id="seo-fallback">[\s\S]*?<\/div>\s*(?=<\/div>|<script|<\/body)/, "")
        const merged = current.replace(/<body[^>]*>[\s\S]*<\/body>/i, "<body>\n" + liveBody + "\n</body>")
        const rootHasContent = /id="root">\s*<div/i.test(merged) || /id="root">\s*<main/i.test(merged) || /id="root">\s*<section/i.test(merged)
        if (!rootHasContent && !merged.includes('id="root"><')) {
          console.log(`[prerender-dom] ${route} — empty root, keeping injection output`)
          continue
        }
        fs.writeFileSync(outPath, merged)
        console.log(`[prerender-dom] ${route} — full-DOM snapshot written`)
        ok++
      } catch (e) {
        console.log(`[prerender-dom] ${route} — failed (${e.message.split("\n")[0]}), keeping injection output`)
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
    server.close()
  }
  console.log(`[prerender-dom] done (${ok}/${routes.length} full-DOM)`)
}

main().catch((e) => {
  console.error("[prerender-dom] fatal:", e.message)
  process.exit(0) // never fail the build — injection output remains valid
})
