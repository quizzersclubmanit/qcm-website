import React, { useState } from "react"
import { sponsors } from "../assets/qcmData.json"
import logoMap from "../generated/sponsor-logos.json"
import {
  FaExternalLinkAlt,
  FaHandshake,
  FaCrown,
  FaStar,
  FaAward,
  FaArrowRight,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa"

const Sponsors = () => {
  const [activeTab, setActiveTab] = useState("all")

  // Helper to resolve optimized mirrored logo or fallback
  const getLogo = (logo) => (logo && logoMap[logo]) || logo

  // Separate categorized sponsor data
  const mainCategories = sponsors.filter((s) => !Array.isArray(s))

  // Extract all event & domain partner brands into a clean flat list
  const partnerRows = sponsors.filter((s) => Array.isArray(s))
  const partnerBrands = partnerRows.flatMap((row) =>
    row.map((item) => ({
      category: item.category,
      name: item.brand?.name || item.brand || item.category,
      logo: item.brand?.logo || item.logo,
      website: item.brand?.website || item.website || "#",
    }))
  )

  // Split partners into two tracks for the dual-track infinite marquee
  const half = Math.ceil(partnerBrands.length / 2)
  const marqueeTrack1 = partnerBrands.slice(0, half)
  const marqueeTrack2 = partnerBrands.slice(half)

  // Duplicate for seamless 100% loop
  const seamlessTrack1 = [
    ...marqueeTrack1,
    ...marqueeTrack1,
    ...marqueeTrack1,
    ...marqueeTrack1,
  ]
  const seamlessTrack2 = [
    ...marqueeTrack2,
    ...marqueeTrack2,
    ...marqueeTrack2,
    ...marqueeTrack2,
  ]

  // Tier configuration
  const getTierMeta = (category) => {
    const cat = category.toLowerCase()
    if (cat.includes("title") && !cat.includes("co-title")) {
      return {
        label: "Title Sponsor",
        icon: <FaCrown className="text-amber-500" />,
        badgeClass: "bg-amber-500/10 border-amber-500/30 text-amber-700",
        cardRing:
          "border-amber-400/30 hover:border-amber-500/80 hover:shadow-[0_16px_36px_rgba(245,158,11,0.18)] ring-1 ring-amber-400/20",
        glow: "from-amber-500/15 via-yellow-500/5 to-transparent",
        headerColor: "from-amber-600 to-yellow-600",
      }
    }
    if (cat.includes("co-title")) {
      return {
        label: "Co-Title Sponsor",
        icon: <FaStar className="text-cyan-600" />,
        badgeClass: "bg-cyan-500/10 border-cyan-500/30 text-cyan-800",
        cardRing:
          "border-cyan-400/30 hover:border-cyan-500 hover:shadow-[0_12px_30px_rgba(6,182,212,0.16)]",
        glow: "from-cyan-500/15 via-teal-500/5 to-transparent",
        headerColor: "from-cyan-600 to-teal-600",
      }
    }
    if (cat.includes("associate")) {
      return {
        label: "Associate Sponsor",
        icon: <FaAward className="text-emerald-600" />,
        badgeClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-800",
        cardRing:
          "border-emerald-400/25 hover:border-emerald-500 hover:shadow-[0_10px_24px_rgba(16,185,129,0.14)]",
        glow: "from-emerald-500/10 to-transparent",
        headerColor: "from-emerald-600 to-teal-600",
      }
    }
    return {
      label: "Education Partner",
      icon: <FaHandshake className="text-blue-600" />,
      badgeClass: "bg-blue-500/10 border-blue-500/30 text-blue-800",
      cardRing:
        "border-blue-400/25 hover:border-blue-500 hover:shadow-[0_10px_24px_rgba(59,130,246,0.14)]",
      glow: "from-blue-500/10 to-transparent",
      headerColor: "from-blue-600 to-indigo-600",
    }
  }

  // Render individual brand card
  const renderCard = (brand, category, isFeatured = false) => {
    const brandName = brand.brand || brand.name || brand.company || "Partner"
    const website = brand.website || "#"
    const logo = getLogo(brand.logo)
    const tier = getTierMeta(category)

    return (
      <a
        key={`${brandName}-${category}`}
        href={website}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={`group relative flex flex-col justify-between rounded-2xl bg-white/95 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 shimmer-sweep border ${
          tier.cardRing
        } ${isFeatured ? "min-h-[170px] sm:min-h-[200px]" : "min-h-[140px]"}`}
        aria-label={`${brandName} - ${category}`}
      >
        {/* Subtle Ambient Glow */}
        <div
          className={`pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${tier.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        />

        {/* Top Tier Tag & External Link Indicator */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tier.badgeClass}`}
          >
            {tier.icon}
            <span>{category}</span>
          </span>
          <FaExternalLinkAlt className="text-xs text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-gray-700" />
        </div>

        {/* Logo Container with clean contrast backplate */}
        <div className="flex flex-1 items-center justify-center py-2">
          {logo ? (
            <img
              src={logo}
              alt={`${brandName} logo`}
              loading="lazy"
              decoding="async"
              className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
                isFeatured
                  ? "max-h-[64px] max-w-[210px] sm:max-h-[80px]"
                  : "max-h-[48px] max-w-[165px] sm:max-h-[58px]"
              }`}
            />
          ) : (
            <span className="text-center font-bold tracking-tight text-gray-800 sm:text-lg">
              {brandName}
            </span>
          )}
        </div>

        {/* Brand Name Footer */}
        <div className="mt-2 text-center">
          <span className="line-clamp-1 text-xs font-semibold text-gray-500 transition-colors group-hover:text-gray-900">
            {brandName}
          </span>
        </div>
      </a>
    )
  }

  // Filter visibility flags
  const showTitle = activeTab === "all" || activeTab === "title"
  const showAssociate = activeTab === "all" || activeTab === "associate"
  const showPartners = activeTab === "all" || activeTab === "partners"

  return (
    <section
      id="sponsors"
      className="relative w-full overflow-hidden px-4 py-16 sm:px-8 lg:px-16"
      style={{
        background:
          'url("/bg-gradient.webp") no-repeat center center / cover',
      }}
    >
      {/* Background Ambient Orbs */}
      <div
        className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1240px] rounded-3xl bg-[#f8f8f5]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.07)] backdrop-blur-md sm:p-10 lg:p-12 border border-white/60">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#237c78]">
            <FaHandshake className="text-sm" />
            <span>Partnership Ecosystem</span>
          </div>

          <h2 className="text-center leading-[1.05] text-[#1b1b1b]">
            <span className="block text-[clamp(2.4rem,4.5vw,4.8rem)] font-black tracking-[-0.05em]">
              Special Thanks to
            </span>
            <span className="block text-[clamp(2.4rem,4.5vw,4.8rem)] font-black tracking-[-0.05em]">
              Our Esteemed <span className="italic text-[#3ab8b4] poppins-bold">Sponsors</span>
            </span>
          </h2>

          <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Powering intellectual curiosity and inter-college quizzing excellence across India through collaborative vision and generous patronage.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 rounded-full bg-gray-200/60 p-1.5 backdrop-blur-sm">
            {[
              { id: "all", label: "All Partners" },
              { id: "title", label: "👑 Title & Co-Title" },
              { id: "associate", label: "🤝 Associate & Education" },
              { id: "partners", label: "⚡ Event Partners" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 sm:text-sm ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-md shadow-gray-400/20"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. TITLE & CO-TITLE SPONSORS */}
        {showTitle && (
          <div className="mt-10 flex flex-col gap-10">
            {mainCategories
              .filter((c) =>
                c.category.toLowerCase().includes("title")
              )
              .map((catGroup, idx) => {
                const isTitle =
                  catGroup.category.toLowerCase().includes("title") &&
                  !catGroup.category.toLowerCase().includes("co-title")

                return (
                  <div key={catGroup.category} className="flex flex-col">
                    {/* Category Title Header with Accent Pill */}
                    <div className="mb-5 flex items-center justify-between border-b border-gray-200/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-[#3ab8b4]" />
                        <h3 className="poppins-bold text-lg uppercase tracking-wider text-gray-800 sm:text-xl">
                          {catGroup.category}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {catGroup.brands.length} {catGroup.brands.length === 1 ? "Brand" : "Brands"}
                      </span>
                    </div>

                    {/* Grid */}
                    <div
                      className={`grid gap-4 sm:gap-6 ${
                        isTitle
                          ? "grid-cols-1 md:grid-cols-2"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                      }`}
                    >
                      {catGroup.brands.map((brand) =>
                        renderCard(brand, catGroup.category, isTitle)
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {/* 2. ASSOCIATE & EDUCATION SPONSORS */}
        {showAssociate && (
          <div className="mt-10 flex flex-col gap-10">
            {mainCategories
              .filter(
                (c) =>
                  !c.category.toLowerCase().includes("title")
              )
              .map((catGroup) => (
                <div key={catGroup.category} className="flex flex-col">
                  <div className="mb-5 flex items-center justify-between border-b border-gray-200/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-3 w-3 rounded-full bg-[#3ab8b4]" />
                      <h3 className="poppins-bold text-lg uppercase tracking-wider text-gray-800 sm:text-xl">
                        {catGroup.category}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {catGroup.brands.length} {catGroup.brands.length === 1 ? "Brand" : "Brands"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
                    {catGroup.brands.map((brand) =>
                      renderCard(brand, catGroup.category, false)
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 3. EVENT & DOMAIN PARTNERS — DUAL-TRACK INFINITE MARQUEE */}
        {showPartners && (
          <div className="mt-12 flex flex-col">
            <div className="mb-6 flex flex-col items-center justify-between gap-2 border-b border-gray-200/80 pb-4 text-center sm:flex-row sm:text-left">
              <div>
                <div className="flex items-center justify-center gap-2.5 sm:justify-start">
                  <span className="h-3 w-3 rounded-full bg-[#3ab8b4]" />
                  <h3 className="poppins-bold text-lg uppercase tracking-wider text-gray-800 sm:text-xl">
                    Event, Experience &amp; Media Partners
                  </h3>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Providing refreshments, logistics, software, and nationwide coverage.
                </p>
              </div>
              <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-700">
                Hover to pause ⏸
              </span>
            </div>

            {/* Marquee Track 1 (Scrolls Left) */}
            <div className="pause-on-hover relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="animate-marquee-left flex gap-4">
                {seamlessTrack1.map((p, i) => {
                  const logo = getLogo(p.logo)
                  return (
                    <a
                      key={`m1-${p.name}-${i}`}
                      href={p.website}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="group flex min-w-[170px] sm:min-w-[200px] flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white/95 px-5 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#3ab8b4]/60 hover:shadow-md"
                    >
                      <span className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-teal-600 transition-colors">
                        {p.category}
                      </span>
                      {logo ? (
                        <img
                          src={logo}
                          alt={`${p.name} logo`}
                          loading="lazy"
                          decoding="async"
                          className="h-[38px] w-auto max-w-[130px] object-contain transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-sm font-bold text-gray-800">
                          {p.name}
                        </span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Marquee Track 2 (Scrolls Right) */}
            <div className="pause-on-hover mt-3 relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="animate-marquee-right flex gap-4">
                {seamlessTrack2.map((p, i) => {
                  const logo = getLogo(p.logo)
                  return (
                    <a
                      key={`m2-${p.name}-${i}`}
                      href={p.website}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="group flex min-w-[170px] sm:min-w-[200px] flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white/95 px-5 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#3ab8b4]/60 hover:shadow-md"
                    >
                      <span className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-teal-600 transition-colors">
                        {p.category}
                      </span>
                      {logo ? (
                        <img
                          src={logo}
                          alt={`${p.name} logo`}
                          loading="lazy"
                          decoding="async"
                          className="h-[38px] w-auto max-w-[130px] object-contain transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-sm font-bold text-gray-800">
                          {p.name}
                        </span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. "PARTNER WITH US" CALLOUT BANNER */}
        <div className="mt-14 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-900/90 via-[#10342b]/95 to-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-300">
                <FaCheckCircle className="text-xs" />
                Opportunities for Q-BIT '26
              </span>
              <h3 className="mt-2 text-xl font-bold sm:text-2xl text-white">
                Interested in Partnering With Quizzers' Club MANIT?
              </h3>
              <p className="mt-1 max-w-xl text-xs text-teal-100/80 sm:text-sm">
                Gain high-impact visibility across thousands of college quizzers, scholars, and youth innovators nationwide.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:quizzersclubmanit@gmail.com?subject=Partnership%20Inquiry%20-%20QCM%20Q-BIT"
                className="inline-flex items-center gap-2 rounded-xl bg-[#3ab8b4] px-5 py-3 text-xs font-bold text-slate-950 transition-all duration-200 hover:bg-[#47d1cd] hover:shadow-lg sm:text-sm"
              >
                <FaEnvelope />
                <span>Partner With Us</span>
              </a>

              <a
                href="#events"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white transition-all duration-200 hover:bg-white/20 sm:text-sm"
              >
                <span>View Event Lineup</span>
                <FaArrowRight className="text-xs" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Sponsors
