import React from "react"
import { sponsors } from "../assets/qcmData.json"
import logoMap from "../generated/sponsor-logos.json"
import { FaArrowUpRightFromSquare } from "react-icons/fa6"

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

  // Double partner brands for seamless infinite loop
  const seamlessMarquee = [
    ...partnerBrands,
    ...partnerBrands,
    ...partnerBrands,
    ...partnerBrands,
  ]

  // Render individual brand card with professional, clean corporate styling
  const renderSponsorCard = (brand, category, isPrimary = false) => {
    const brandName = brand.brand || brand.name || brand.company || "Partner"
    const website = brand.website || "#"
    const logo = getLogo(brand.logo)

    return (
      <a
        key={`${brandName}-${category}`}
        href={website}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={`group relative flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white/95 p-6 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-zinc-400 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] ${
          isPrimary ? "min-h-[170px] sm:min-h-[190px]" : "min-h-[140px]"
        }`}
        aria-label={`${brandName} - ${category}`}
      >
        {/* Subtle Category Identifier & External Icon */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600 transition-colors">
            {category}
          </span>
          <FaArrowUpRightFromSquare className="text-[11px] text-zinc-300 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-zinc-600" />
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
                  ? "max-h-[64px] max-w-[210px] sm:max-h-[76px]"
                  : "max-h-[46px] max-w-[160px] sm:max-h-[54px]"
              }`}
            />
          ) : (
            <span className="text-center font-bold tracking-tight text-zinc-800 sm:text-base">
              {brandName}
            </span>
          )}
        </div>

        {/* Brand Label */}
        <div className="pt-2 text-center border-t border-zinc-100">
          <span className="line-clamp-1 text-[11px] font-medium text-zinc-500 transition-colors group-hover:text-zinc-900">
            {brandName}
          </span>
        </div>
      </a>
    )
  }

  return (
    <section
      id="sponsors"
      className="relative w-full overflow-hidden px-4 py-16 sm:px-8 lg:px-16"
      style={{
        background: 'url("/bg-gradient.webp") no-repeat center center / cover',
      }}
    >
      <div className="mx-auto max-w-[1200px] rounded-2xl bg-[#fafaf8]/95 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-md sm:p-10 lg:p-14 border border-white/60">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#298f8b]">
            Our Valued Partners
          </span>

          <h2 className="mt-2 text-center leading-[0.95] text-[#1a1a1a]">
            <span className="block text-[clamp(2.4rem,4.5vw,5rem)] font-black tracking-[-0.05em]">
              Special thanks
            </span>
            <span className="block text-[clamp(2.4rem,4.5vw,5rem)] font-black tracking-[-0.05em]">
              to our <span className="italic text-[#3ab8b4] poppins-bold">Sponsors</span>
            </span>
          </h2>

          <p className="mt-3 max-w-xl text-xs sm:text-sm text-zinc-600 font-normal">
            Organizations and institutions empowering intellectual curiosity and quizzing excellence across MANIT Bhopal.
          </p>
        </div>

        {/* 1. TITLE SPONSORS (PREMIER TIER) */}
        <div className="mt-12 flex flex-col gap-12">
          {mainCategories.map((group) => {
            const isTitle =
              group.category.toLowerCase().includes("title") &&
              !group.category.toLowerCase().includes("co-title")

            return (
              <div key={group.category} className="flex flex-col">
                {/* Clean Category Divider */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
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
                    renderSponsorCard(brand, group.category, isTitle)
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 2. EVENT & EXPERIENCE PARTNERS (INFINITE MARQUEE) */}
        <div className="mt-14 flex flex-col">
          {/* Header Divider */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Event, Hospitality &amp; Media Partners
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* Clean Continuous Marquee Ticker */}
          <div className="pause-on-hover relative w-full overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee-left flex gap-4">
              {seamlessMarquee.map((partner, index) => {
                const logo = getLogo(partner.logo)
                return (
                  <a
                    key={`partner-${partner.name}-${index}`}
                    href={partner.website}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="group flex min-w-[170px] sm:min-w-[190px] flex-col items-center justify-between rounded-xl border border-zinc-200/80 bg-white/95 px-5 py-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-zinc-400 hover:shadow-md"
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-600 transition-colors">
                      {partner.category}
                    </span>

                    <div className="my-3 flex h-[38px] w-full items-center justify-center">
                      {logo ? (
                        <img
                          src={logo}
                          alt={`${partner.name} logo`}
                          loading="lazy"
                          decoding="async"
                          className="max-h-[36px] w-auto max-w-[125px] object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-zinc-700">
                          {partner.name}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-medium text-zinc-500 group-hover:text-zinc-800 transition-colors">
                      {partner.name}
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* 3. PROFESSIONAL CORPORATE PARTNERSHIP CALLOUT */}
        <div className="mt-14 rounded-xl border border-zinc-200/90 bg-white/70 p-6 sm:p-8 backdrop-blur-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900">
              Partner with Quizzers' Club MANIT
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-lg">
              Collaborate on upcoming editions of Q-BIT and connect with thousands of collegiate quizzers and innovators across India.
            </p>
          </div>

          <a
            href="mailto:quizzersclubmanit@gmail.com?subject=Partnership%20Inquiry%20-%20QCM"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-zinc-800 hover:shadow-md"
          >
            <span>Inquire for Sponsorship</span>
            <FaArrowUpRightFromSquare className="text-[10px]" />
          </a>
        </div>

      </div>
    </section>
  )
}

export default Sponsors
