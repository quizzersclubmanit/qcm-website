import React from "react"
import { useNavigate } from "react-router-dom"
import { avifSrcSet, webpSrcSet } from "../utils/img.js"
import { ArrowRight } from "lucide-react"

const EVENT_TAGS = {
  iqc: "Inter-City Challenge",
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
  const tag = EVENT_TAGS[dets.id] || "Quiz Event"

  const handleNavigate = () => {
    navigate(`/events/${dets.id}`)
  }

  return (
    <div className="px-2 py-4 h-full">
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
        className="group relative flex flex-col h-[420px] w-full max-w-[360px] mx-auto rounded-2xl overflow-hidden bg-[#14213D]/80 hover:bg-[#14213D] border border-white/10 hover:border-[#FCA311]/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
      >
        {/* Cover Image Container */}
        <div className="relative h-[220px] w-full overflow-hidden bg-[#0e1626]">
          <picture>
            {avif && (
              <source
                srcSet={avif}
                sizes="(max-width: 768px) 320px, 360px"
                type="image/avif"
              />
            )}
            {webp && (
              <source
                srcSet={webp}
                sizes="(max-width: 768px) 320px, 360px"
                type="image/webp"
              />
            )}
            <img
              src={dets.cover}
              alt={`${dets.title || "QCM quiz event"} — Quizzers' Club NIT Bhopal`}
              loading="lazy"
              decoding="async"
              width="360"
              height="220"
              className="h-full w-full object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </picture>

          {/* Vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14213D] via-transparent to-black/30" />

          {/* Tag badge */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-[#FCA311] text-[#14213D] shadow-md">
              {tag}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FCA311] transition-colors duration-200 line-clamp-1">
              {dets.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
              {dets.desc}
            </p>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400 group-hover:text-white transition-colors">
              Read event details
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#FCA311] group-hover:translate-x-1 transition-transform duration-200">
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
