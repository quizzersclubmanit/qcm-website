// Responsive sidecars generated next to public/events originals by
// scripts/media.cjs: <basename>-800/-1600.{avif,webp}. Local files only
// (remote Appwrite/team URLs pass through untouched).
const variant = (src, suffix, fmt) => {
  if (typeof src !== "string") return null
  if (/^https?:\/\//i.test(src)) return null
  if (!/\.(jpe?g|png)$/i.test(src)) return null
  return src.replace(/\.(jpe?g|png)$/i, `${suffix}.${fmt}`)
}

export const toWebp = (src) => variant(src, "-800", "webp") || variant(src, "", "webp")

// srcset strings for <source>; null when the src isn't a local raster
export const avifSrcSet = (src) => {
  if (typeof src !== "string" || /^https?:\/\//i.test(src) || !/\.(jpe?g|png)$/i.test(src)) return null
  const base = src.replace(/\.(jpe?g|png)$/i, "")
  return `${base}-800.avif 800w, ${base}-1600.avif 1600w`
}

export const webpSrcSet = (src) => {
  if (typeof src !== "string" || /^https?:\/\//i.test(src) || !/\.(jpe?g|png)$/i.test(src)) return null
  const base = src.replace(/\.(jpe?g|png)$/i, "")
  return `${base}-800.webp 800w, ${base}-1600.webp 1600w`
}
