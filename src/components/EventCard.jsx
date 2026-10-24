import React from "react"
import { useNavigate } from "react-router-dom"
import { avifSrcSet, webpSrcSet } from "../utils/img.js"
import { ArrowRight } from "lucide-react"

const EVENT_TAGS = {
  iqc: "Inter-City Flagship",
  anveshan: "Campus Treasure Hunt",
  manthan: "National Open Quiz",
  vihaan: "Freshers' Quiz War",
  "flashback-fiesta": "Technosearch Fest",
  "aps-quiz": "Inter-School Invitational",
}

const EventCard = ({ dets = {} }) => {
  const navigate = useNavigate()
  const avif = avifSrcSet(dets.cover)
  const webp = webpSrcSet(dets.cover)
  const tag = EVENT_TAGS[dets.id] || "Featured Event"

  const handleNavigate = () => {
    navigate(`/events/${dets.id}`)
  }

  return (
    <div className="px-2 sm:px-3 py-3">
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
        className="group relative flex flex-col justify-end h-[440px] sm:h-[460px] w-full rounded-2xl overflow-hidden bg-[#0c1e28] border border-white/15 hover:border-[#fe9c02]/80 shadow-xl shadow-black/50 hover:shadow-[0_24px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(254,156,2,0.18)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#fe9c02]"
      >
        {/* Full Card Cover Image */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          {avif && (
            <source
              srcSet={avif}
              sizes="(max-width: 768px) 90vw, 400px"
              type="image/avif"
            />
          )}
          {webp && (
            <source
              srcSet={webp}
              sizes="(max-width: 768px) 90vw, 400px"
              type="image/webp"
            />
          )}
          <img
            src={dets.cover}
            alt={`${dets.title || "QCM quiz event"} — Quizzers' Club NIT Bhopal`}
            loading="lazy"
            decoding="async"
            width="400"
            height="460"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </picture>

        {/* Gradient Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09151e] via-[#09151e]/60 to-transparent pointer-events-none" />

        {/* Top Tag Badge */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black/75 backdrop-blur-md text-[#fe9c02] border border-[#fe9c02]/40 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fe9c02] inline-block shadow-[0_0_6px_#fe9c02]" />
            <span>{tag}</span>
          </span>
        </div>

        {/* Bottom Card Content */}
        <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#fe9c02] transition-colors leading-tight drop-shadow-sm">
            {dets.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed drop-shadow-sm">
            {dets.desc}
          </p>

          <div className="pt-3 mt-1 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-[#fe9c02]">
            <span>Explore Event</span>
            <span className="inline-flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-200">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
