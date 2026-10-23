import React from "react"
import { sponsors } from "../assets/qcmData.json"
import logoMap from "../generated/sponsor-logos.json"
import { FaArrowUpRightFromSquare } from "react-icons/fa6"
import { FaHandshake } from "react-icons/fa"

const Sponsors = () => {
  // Helper to resolve optimized mirrored logo or fallback
  const getLogo = (logo) => (logo && logoMap[logo]) || logo

  // Separate categorized sponsor data
  const mainCategories = sponsors.filter((s) => !Array.isArray(s))

  // Extract all event & domain partner brands into a flat list for the infinite marquee
  const partnerRows = sponsors.filter((s) => Array.isArray(s))
  const partnerBrands = partnerRows.flatMap((row) =>
    row.map((item) => ({
      category: item.category,
      name: item.brand?.name || item.brand || item.category,
      logo: item.brand?.logo || item.logo,
      website: item.brand?.website || item.website || "#",
    }))
  )

  // Split into two smooth staggered marquee tracks
  const mid = Math.ceil(partnerBrands.length / 2)
  const track1 = partnerBrands.slice(0, mid)
  const track2 = partnerBrands.slice(mid)

  const loopTrack1 = [...track1, ...track1, ...track1, ...track1]
  const loopTrack2 = [...track2, ...track2, ...track2, ...track2]

  // Key metrics to build prestige and social proof (light theme)
  const metrics = [
    { value: "100+", label: "Quiz Competitions" },
    { value: "1,500+", label: "Collegiate Participants" },
    { value: "50+", label: "Institutions Nationwide" },
    { value: "10+ Yrs", label: "Quizzing Heritage" },
  ]

  // Render individual brand card with crisp white canvas & soft elevation
  const renderCard = (brand, category, isPrimary = false) => {
    const brandName = brand.brand || brand.name || brand.company || "Partner"
    const website = brand.website || "#"
    const logo = getLogo(brand.logo)

    return (
      <a
        key={`${brandName}-${category}`}
        href={website}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={`group relative flex flex-col justify-between rounded-xl bg-white p-5 border border-zinc-200/90 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#3ab8b4] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] ${
          isPrimary ? "min-h-[175px] sm:min-h-[200px] p-6 sm:p-7" : "min-h-[140px]"
        }`}
        aria-label={`${brandName} - ${category}`}
      >
        {/* Top Category Tag & Hover Arrow */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-[#288f8b] transition-colors">
            {category}
          </span>
          <FaArrowUpRightFromSquare className="text-[10px] text-zinc-300 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-zinc-600" />
        </div>

        {/* Logo Container */}
        <div className="flex flex-1 items-center justify-center py-4">
          {logo ? (
            <img
              src={logo}
              alt={`${brandName} logo`}
              loading="lazy"
              decoding="async"
              className={`w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04] ${
                isPrimary
                  ? "max-h-[64px] max-w-[210px] sm:max-h-[78px]"
                  : "max-h-[44px] max-w-[155px] sm:max-h-[50px]"
              }`}
            />
          ) : (
            <span className="text-center font-bold tracking-tight text-zinc-800 sm:text-base">
              {brandName}
            </span>
          )}
        </div>

        {/* Brand Name Footer */}
        <div className="text-center">
          <span className="line-clamp-1 text-[11px] font-semibold text-zinc-600 transition-colors group-hover:text-zinc-950">
            {brandName}
          </span>
        </div>
      </a>
    )
  }

  return (
    <section
      id="sponsors"
      className="relative w-full overflow-hidden px-4 py-20 sm:px-8 lg:px-16"
      style={{
        background: 'url("/bg-gradient.webp") no-repeat center center / cover',
      }}
    >
      <div className="mx-auto max-w-[1240px] rounded-3xl bg-[#fdfdfb]/95 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-10 lg:p-14 border border-white">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-50 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f736f]">
            <FaHandshake className="text-xs" />
            <span>Official Partners</span>
          </div>

          <h2 className="mt-4 text-center leading-[0.95] text-zinc-900">
            <span className="block text-[clamp(2.4rem,4.5vw,5rem)] font-black tracking-[-0.05em]">
              Special Thanks to
            </span>
            <span className="block text-[clamp(2.4rem,4.5vw,5rem)] font-black tracking-[-0.05em]">
              Our Esteemed <span className="italic text-[#3ab8b4] poppins-bold">Sponsors</span>
            </span>
          </h2>

          <p className="mt-3 max-w-xl text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
            Leading enterprises, government boards, and academic institutions driving knowledge discovery and quizzing culture across Central India.
          </p>
        </div>

        {/* Impact Metric Strip (Clean Light Design) */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-y border-zinc-200/80 py-6">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#b48227]">
                {m.value}
              </span>
              <span className="mt-1 text-[11px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Main Tiered Sponsor Categories */}
        <div className="mt-12 flex flex-col gap-12">
          {mainCategories.map((group) => {
            const isTitle =
              group.category.toLowerCase().includes("title") &&
              !group.category.toLowerCase().includes("co-title")

            return (
              <div key={group.category} className="flex flex-col">
                {/* Refined Category Divider */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-zinc-700">
                    {group.category}
                  </span>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>

                {/* Grid */}
                <div
                  className={`grid gap-4 sm:gap-6 ${
                    isTitle
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  }`}
                >
                  {group.brands.map((brand) =>
                    renderCard(brand, group.category, isTitle)
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Domain & Event Partners (Dual-Track Infinite Marquee) */}
        <div className="mt-16 flex flex-col">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-zinc-700">
              Event, Hospitality &amp; Media Partners
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* Marquee Track 1 (Scrolls Left) */}
          <div className="pause-on-hover relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee-left flex gap-4">
              {loopTrack1.map((p, i) => {
                const logo = getLogo(p.logo)
                return (
                  <a
                    key={`track1-${p.name}-${i}`}
                    href={p.website}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="group flex min-w-[170px] sm:min-w-[195px] flex-col items-center justify-between rounded-xl bg-white px-5 py-3.5 border border-zinc-200/90 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#3ab8b4] hover:shadow-md"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-[#288f8b] transition-colors">
                      {p.category}
                    </span>

                    <div className="my-2 flex h-[36px] w-full items-center justify-center">
                      {logo ? (
                        <img
                          src={logo}
                          alt={`${p.name} logo`}
                          loading="lazy"
                          decoding="async"
                          className="max-h-[34px] w-auto max-w-[125px] object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-xs font-bold text-zinc-800">
                          {p.name}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-950 transition-colors">
                      {p.name}
                    </span>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Marquee Track 2 (Scrolls Right) */}
          <div className="pause-on-hover mt-3 relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee-right flex gap-4">
              {loopTrack2.map((p, i) => {
                const logo = getLogo(p.logo)
                return (
                  <a
                    key={`track2-${p.name}-${i}`}
                    href={p.website}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="group flex min-w-[170px] sm:min-w-[195px] flex-col items-center justify-between rounded-xl bg-white px-5 py-3.5 border border-zinc-200/90 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#3ab8b4] hover:shadow-md"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-[#288f8b] transition-colors">
                      {p.category}
                    </span>

                    <div className="my-2 flex h-[36px] w-full items-center justify-center">
                      {logo ? (
                        <img
                          src={logo}
                          alt={`${p.name} logo`}
                          loading="lazy"
                          decoding="async"
                          className="max-h-[34px] w-auto max-w-[125px] object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-xs font-bold text-zinc-800">
                          {p.name}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-950 transition-colors">
                      {p.name}
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Corporate Sponsorship Callout Banner (Clean Light Design) */}
        <div className="mt-14 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900">
              Partner with Central India's Premier Quizzing Festival
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 max-w-xl leading-relaxed">
              Collaborate on upcoming editions of Q-BIT to engage directly with top academic talent, quizzers, and future leaders from across the nation.
            </p>
          </div>

          <a
            href="mailto:quizzersclubmanit@gmail.com?subject=Partnership%20Inquiry%20-%20QCM%20Q-BIT"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800 hover:shadow-md"
          >
            <span>Inquire for Partnership</span>
            <FaArrowUpRightFromSquare className="text-xs" />
          </a>
        </div>

      </div>
    </section>
  )
}

export default Sponsors
