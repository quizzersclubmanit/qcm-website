/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async"

const SITE_URL = "https://www.quizzersclub.com"
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

// Per-route OG cards generated at build by scripts/og.cjs.
// Allowlisted so unknown paths (404/Gone) keep the default card.
const OG_CARDS = new Set([
  "home", "team", "faqs", "signup",
  "events-flashback-fiesta", "events-iqc", "events-anveshan",
  "events-vihaan", "events-manthan", "events-aps-quiz",
])

export const ogImageFor = (path) => {
  const slug = path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-")
  return OG_CARDS.has(slug) ? `${SITE_URL}/og/${slug}.png` : DEFAULT_IMAGE
}

const SEO = ({
  title = "Quizzers' Club NIT Bhopal (QCM MANIT) | College Quizzes, QBIT & Events",
  description = "Quizzers' Club NIT Bhopal (QCM MANIT) is the official quizzing club of MANIT Bhopal — QBIT, inter-college quizzes, competitions and events in Bhopal.",
  path = "/",
  image = null,
  ogType = "website",
  noindex = false,
  schema = null,
  // Breadcrumb trail (without Home — always position 1). Visible UI lives in
  // SectionHead; this keeps the JSON-LD graph in parity with it.
  crumbs = null,
}) => {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`
  const resolvedImage = image || ogImageFor(path)
  const webPage = {
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en-IN",
  }
  const trail = crumbs && crumbs.length
    ? [{
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "Home", item: `${SITE_URL}/` }, ...crumbs].map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: c.item,
        })),
      }]
    : []
  const extra = schema ? (schema["@graph"] ? schema["@graph"] : [schema]) : []
  const graph = { "@context": "https://schema.org", "@graph": [webPage, ...trail, ...extra] }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}
      {/* No Helmet canonical: the static per-route canonical (injected at
          build) is the single source of truth. Helmet only manages tags it
          adds itself, so emitting one here duplicates it whenever the served
          shell differs from the route (SPA fallback, preview) — duplicate
          canonicals fail Lighthouse's canonical audit. */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={resolvedImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />
      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </Helmet>
  )
}

export default SEO
