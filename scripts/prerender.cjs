// Build-time static prerender for the Vite SPA (no browser needed).
// JSDOM cannot execute Vite ESM bundles, so instead we inject per-route
// <title>/meta/canonical/JSON-LD into <head> plus a crawler-visible
// #seo-fallback content block (removed by main.jsx on hydration).
// Result: dist/<route>/index.html carries real H1 + text + links for bots.
const path = require("path")
const fs = require("fs")

const staticDir = path.join(__dirname, "..", "dist")
const dataPath = path.join(__dirname, "..", "src", "assets", "qcmData.json")

const SITE = "https://www.quizzersclub.com"

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function setTitle(html, title) {
  return html.replace(/<title>.*?<\/title>/s, "<title>" + esc(title) + "</title>")
}

function setMetaName(html, name, content) {
  const re = new RegExp('<meta name="' + name + '"\\s+content=".*?"\\s*/?>', "s")
  if (re.test(html)) return html.replace(re, '<meta name="' + name + '" content="' + esc(content) + '" />')
  return html.replace("</title>", "</title>\n  <meta name=\"" + name + '" content="' + esc(content) + '" />')
}

function setMetaProperty(html, prop, content) {
  const re = new RegExp('<meta property="' + prop + '"\\s+content=".*?"\\s*/?>', "s")
  if (re.test(html)) return html.replace(re, '<meta property="' + prop + '" content="' + esc(content) + '" />')
  return html
}

function setCanonical(html, href) {
  return html.replace(/<link rel="canonical" href=".*?"\s*\/?>/s, '<link rel="canonical" href="' + esc(href) + '" />')
}

function injectSchema(html, obj) {
  if (!obj) return html
  const tag = '\n  <script type="application/ld+json">' + JSON.stringify(obj) + "</script>"
  return html.replace("</head>", tag + "\n</head>")
}

function fallbackBlock(inner) {
  return '\n  <div id="seo-fallback">' + inner + "\n  </div>"
}

function siteNavLinks() {
  return (
    "<nav><ul>" +
    '<li><a href="/">Home — Quizzers\' Club NIT Bhopal</a></li>' +
    '<li><a href="/team">Meet the Team</a></li>' +
    '<li><a href="/faqs">FAQs</a></li>' +
    '<li><a href="/signup">QBIT Registration</a></li>' +
    "</ul></nav>"
  )
}

function main() {
  const templatePath = path.join(staticDir, "index.html")
  if (!fs.existsSync(templatePath)) {
    console.error("[prerender] dist/index.html missing — run `vite build` (build:spa) first")
    process.exit(1)
  }
  const template = fs.readFileSync(templatePath, "utf8")
  if (!template.includes('id="seo-fallback"')) {
    // template has no fallback yet; we insert per-route below
  }
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"))
  const events = data.eventDetails || []
  const qna = data.qna || []
  const team = data.team || []

  const routes = [
    {
      route: "/",
      title: "Quizzers' Club NIT Bhopal (QCM MANIT) | College Quizzes, QBIT & Events",
      description:
        "Quizzers' Club NIT Bhopal (QCM MANIT) — official quizzing club of MANIT Bhopal. QBIT, inter-city quizzes, college competitions and events.",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
              { "@type": "ListItem", position: 2, name: "Team", item: SITE + "/team" },
              { "@type": "ListItem", position: 3, name: "FAQs", item: SITE + "/faqs" },
              { "@type": "ListItem", position: 4, name: "QBIT Registration", item: SITE + "/signup" },
            ],
          },
          {
            "@type": "ItemList",
            name: "Quiz events by Quizzers' Club NIT Bhopal",
            itemListElement: events.map((e, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: e.title,
              url: `${SITE}/events/${e.id}`,
            })),
          },
        ],
      },
      body:
        "<h1>Quizzers' Club NIT Bhopal (QCM MANIT) — Official College Quizzing Club</h1>" +
        "<p>Quizzers' Club NIT Bhopal (QCM MANIT) is the official quizzing club of Maulana Azad National Institute of Technology, Bhopal. " +
        "We organize QBIT, inter-city and inter-college quizzes, competitions and knowledge events across Bhopal and Madhya Pradesh.</p>" +
        "<h2>Flagship quiz events</h2><ul>" +
        events.map((e) => '<li><a href="/events/' + esc(e.id) + '">' + esc(e.title) + "</a> — " + esc(e.desc || "") + "</li>").join("") +
        "</ul>" +
        siteNavLinks(),
    },
    {
      route: "/team",
      title: "Meet the Team | Quizzers' Club NIT Bhopal (QCM MANIT)",
      description:
        "Meet the coordinators and members of Quizzers' Club NIT Bhopal (QCM MANIT) — the students behind QBIT, college quizzes and events.",
      crumbs: [{ name: "Team", item: SITE + "/team" }],
      body:
        "<h1>Meet the Team — Quizzers' Club NIT Bhopal</h1>" +
        "<p>Coordinators and members of Quizzers' Club NIT Bhopal (QCM MANIT), Maulana Azad National Institute of Technology Bhopal.</p>" +
        "<ul>" +
        team.map((m) => "<li>" + esc(m.name) + (m.post ? " — " + esc(m.post) : "") + (m.domain ? " (" + esc(m.domain) + ")" : "") + "</li>").join("") +
        "</ul>" +
        siteNavLinks(),
    },
    {
      route: "/faqs",
      title: "FAQs | Quizzers' Club NIT Bhopal (QCM MANIT)",
      description:
        "FAQs about Quizzers' Club NIT Bhopal (QCM MANIT) — joining, QBIT, IQC and college quiz events in Bhopal.",
      crumbs: [{ name: "FAQs", item: SITE + "/faqs" }],
      schema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: qna.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      body:
        "<h1>Frequently Asked Questions — Quizzers' Club NIT Bhopal</h1>" +
        qna.map((item) => "<h2>" + esc(item.question) + "</h2><p>" + esc(item.answer) + "</p>").join("") +
        siteNavLinks(),
    },
    {
      route: "/signup",
      title: "QBIT'26 Registration | Quizzers' Club NIT Bhopal (QCM MANIT)",
      description:
        "Register your team for QBIT'26 at MANIT Bhopal Campus — the flagship quiz event by Quizzers' Club NIT Bhopal. Free team registration.",
      crumbs: [{ name: "QBIT'26 Registration", item: SITE + "/signup" }],
      schema: {
        "@context": "https://schema.org",
        "@type": "Event",
        name: "QBIT'26 — Quizzers' Club NIT Bhopal",
        description: "Register your team for QBIT'26, the quiz event hosted by Quizzers' Club NIT Bhopal (QCM MANIT).",
        startDate: "2026-10-31",
        location: { "@type": "Place", name: "MANIT Bhopal Campus", address: "MANIT Bhopal, Madhya Pradesh, India" },
        organizer: { "@type": "Organization", name: "Quizzers' Club NIT Bhopal", url: SITE + "/" },
      },
      body:
        "<h1>QBIT'26 Registration — Quizzers' Club NIT Bhopal</h1>" +
        "<p>Register your team for QBIT'26, the flagship quiz event hosted by Quizzers' Club NIT Bhopal (QCM MANIT) at MANIT Bhopal Campus on 31 October 2026.</p>" +
        "<p>Contacts: Sakshi Priya — 8226872015; Charunya Zerbade — 7222928982.</p>" +
        siteNavLinks(),
    },
  ]

  for (const e of events) {
    const firstPara = String(e.content || "").split("\n")[0] || e.desc || ""
    routes.push({
      route: "/events/" + e.id,
      title: e.title + " | Quizzers' Club NIT Bhopal (QCM MANIT)",
      description: firstPara.slice(0, 155) || ("Details, photos and highlights of " + e.title + " by Quizzers' Club NIT Bhopal (QCM MANIT)."),
      crumbs: [{ name: e.title, item: `${SITE}/events/${e.id}` }],
      schema: {
        "@context": "https://schema.org",
        "@type": "Event",
        name: e.title + " — Quizzers' Club NIT Bhopal",
        description: String(e.content || "").slice(0, 300),
        organizer: { "@type": "Organization", name: "Quizzers' Club NIT Bhopal", url: SITE + "/" },
        location: { "@type": "Place", name: "MANIT Bhopal", address: "Bhopal, Madhya Pradesh, India" },
      },
      body:
        "<h1>" + esc(e.title) + " — Quizzers' Club NIT Bhopal</h1>" +
        (e.desc ? "<p>" + esc(e.desc) + "</p>" : "") +
        String(e.content || "")
          .split("\n")
          .filter(Boolean)
          .map((p) => "<p>" + esc(p) + "</p>")
          .join("") +
        '<p><a href="/">Back to Quizzers\' Club NIT Bhopal home</a></p>' +
        siteNavLinks(),
    })
  }

  const OG_CARDS = new Set([
    "home", "team", "faqs", "signup",
    "events-flashback-fiesta", "events-iqc", "events-anveshan",
    "events-vihaan", "events-manthan", "events-aps-quiz",
  ])
  const ogFor = (route) => {
    const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-")
    return OG_CARDS.has(slug) ? `${SITE}/og/${slug}.png` : `${SITE}/og-image.png`
  }

  // twitter:image is a name-meta, not property — handle separately
  function setTwitterImage(html, content) {
    const re = /<meta name="twitter:image" content=".*?"\s*\/?>/s
    return html.replace(re, `<meta name="twitter:image" content="${esc(content)}" />`)
  }

  let ok = 0
  for (const r of routes) {
    const canonical = SITE + (r.route === "/" ? "/" : r.route)
    const ogImage = ogFor(r.route)
    let html = template
    html = setTitle(html, r.title)
    html = setMetaName(html, "description", r.description)
    html = setMetaProperty(html, "og:title", r.title)
    html = setMetaProperty(html, "og:description", r.description)
    html = setMetaProperty(html, "og:url", canonical)
    html = setMetaProperty(html, "og:image", ogImage)
    html = setMetaProperty(html, "twitter:title", r.title)
    html = setMetaProperty(html, "twitter:description", r.description)
    html = setTwitterImage(html, ogImage)
    html = setCanonical(html, canonical)
    // WebPage node on every route + BreadcrumbList parity with SectionHead UI
    const webPage = {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: r.title,
      description: r.description,
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "en-IN",
    }
    const trail = r.crumbs
      ? [{
          "@type": "BreadcrumbList",
          itemListElement: [{ name: "Home", item: `${SITE}/` }, ...r.crumbs].map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: c.item,
          })),
        }]
      : []
    const extra = r.schema ? (r.schema["@graph"] ? r.schema["@graph"] : [r.schema]) : []
    html = injectSchema(html, { "@context": "https://schema.org", "@graph": [webPage, ...trail, ...extra] })
    // Insert crawler-visible fallback right after #root (React root stays empty)
    html = html.replace('<div id="root"></div>', '<div id="root"></div>' + fallbackBlock(r.body))
    const outPath =
      r.route === "/" ? path.join(staticDir, "index.html") : path.join(staticDir, r.route, "index.html")
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, html)
    const hasH1 = html.includes("<h1>")
    console.log("[prerender] " + r.route + " -> " + path.relative(staticDir, outPath) + " (h1: " + (hasH1 ? "yes" : "NO") + ")")
    if (hasH1) ok++
  }
  console.log("[prerender] done (" + ok + "/" + routes.length + " with H1)")
}

main()
