// Production-faithful static server for LHCI: directory-index resolution
// (dist/team/index.html for /team — like Vercel) with SPA fallback to
// dist/index.html. `vite preview` can't do directory index, which made LHCI
// audit the home shell on every URL.
const path = require("path")
const fs = require("fs")
const http = require("http")

const dist = path.join(__dirname, "..", "dist")
const port = Number(process.argv[2] || 4173)

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
  ".webp": "image/webp",
  ".avif": "image/avif",
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0])
    const candidates = [path.join(dist, urlPath)]
    if (!path.extname(urlPath)) candidates.push(path.join(dist, urlPath, "index.html"))
    for (const fp of candidates) {
      if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
        res.writeHead(200, { "Content-Type": MIME[path.extname(fp)] || "application/octet-stream" })
        fs.createReadStream(fp).pipe(res)
        return
      }
    }
    // Local stub for Vercel infra scripts (served by Vercel itself in
    // production): 200-empty here so LHCI doesn't flag a 404 resource error.
    if (urlPath.startsWith("/_vercel/")) {
      res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" })
      res.end("/* serve-dist stub: Vercel infra script no-op outside Vercel */")
      return
    }
    // Correct 404s (not SPA fallback) for API and file-like URLs.
    if (urlPath.startsWith("/api/") || path.extname(urlPath)) {
      res.writeHead(404, { "Content-Type": "text/plain" })
      res.end("not found")
      return
    }
    const index = fs.readFileSync(path.join(dist, "index.html"))
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    res.end(index)
  })
  .listen(port, "127.0.0.1", () => console.log(`[serve-dist] http://127.0.0.1:${port} serving ${dist}`))
