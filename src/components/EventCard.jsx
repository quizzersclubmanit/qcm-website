import React from "react"
import { useNavigate } from "react-router-dom"
import { avifSrcSet, webpSrcSet } from "../utils/img.js"
import { ArrowRight, Sparkles, Trophy, Compass, Flame, School, Clock } from "lucide-react"

const EVENT_METADATA = {
  iqc: {
    tag: "Flagship School Quiz",
    icon: Trophy,
    highlight: "Central India's Premier School Battle",
    accent: "from-amber-500/20 to-orange-500/10",
    badgeBg: "bg-amber-400 text-slate-950",
  },
  anveshan: {
    tag: "Campus Treasure Hunt",
    icon: Compass,
    highlight: "5,000+ Footfall Maffick Legend",
    accent: "from-emerald-500/20 to-teal-500/10",
    badgeBg: "bg-emerald-400 text-slate-950",
  },
  manthan: {
    tag: "National Open Quiz",
    icon: Sparkles,
    highlight: "Nationwide Quizzing Circuit",
    accent: "from-blue-500/20 to-indigo-500/10",
    badgeBg: "bg-blue-400 text-slate-950",
  },
  vihaan: {
    tag: "Freshers' Quiz War",
    icon: Flame,
    highlight: "Inter-Section First-Year Clash",
    accent: "from-rose-500/20 to-red-500/10",
    badgeBg: "bg-rose-400 text-slate-950",
  },
  "flashback-fiesta": {
    tag: "Technosearch Fest",
    icon: Clock,
    highlight: "Nostalgic Pop-Culture Odyssey",
    accent: "from-purple-500/20 to-pink-500/10",
    badgeBg: "bg-purple-400 text-slate-950",
  },
  "aps-quiz": {
    tag: "Inter-School Invitational",
    icon: School,
    highlight: "Army Public School Circuit",
    accent: "from-amber-600/20 to-yellow-500/10",
    badgeBg: "bg-yellow-400 text-slate-950",
  },
}

const EventCard = ({ dets = {} }) => {
  const navigate = useNavigate()
  const avif = avifSrcSet(dets.cover)
  const webp = webpSrcSet(dets.cover)
  const meta = EVENT_METADATA[dets.id] || {
    tag: "Featured Event",
    icon: Sparkles,
    highlight: "Quizzers' Club NIT Bhopal",
    accent: "from-blue-500/20 to-purple-500/10",
    badgeBg: "bg-amber-400 text-slate-950",
  }
  const Icon = meta.icon

  const handleNavigate = () => {
    navigate(`/events/${dets.id}`)
  }

  return (
    <div className="p-3 sm:p-4">
      <div
        role="button"
        tabIndex={0}
        onClick={handleNavigate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleNavigate()
          }
        }}
        className="group relative flex flex-col h-[460px] w-full max-w-[380px] mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950 border border-white/10 hover:border-amber-400/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        {/* Cover Image Container */}
        <div className="relative h-[250px] w-full overflow-hidden bg-slate-950">
          <picture>
            {avif && (
              <source
                srcSet={avif}
                sizes="(max-width: 768px) 340px, 400px"
                type="image/avif"
              />
            )}
            {webp && (
              <source
                srcSet={webp}
                sizes="(max-width: 768px) 340px, 400px"
                type="image/webp"
              />
            )}
            <img
              src={dets.cover}
              alt={`${dets.title || "QCM quiz event"} — Quizzers' Club NIT Bhopal`}
              loading="lazy"
              decoding="async"
              width="400"
              height="250"
              className="h-full w-full object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </picture>

          {/* Vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

          {/* Top Tag & Icon Badge */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-md ${meta.badgeBg}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{meta.tag}</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="relative flex-1 p-5 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 mb-1">
              {meta.highlight}
            </p>
            <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors duration-200 line-clamp-1">
              {dets.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-300/90 leading-relaxed line-clamp-3">
              {dets.desc}
            </p>
          </div>

          {/* Card Footer Action */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-400 group-hover:text-white transition-colors">
              Explore Overview &amp; Photos
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-400 group-hover:text-amber-300 transition-colors">
              <span>View</span>
              <ArrowRight className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
