import { useRef } from "react"
import { manit, manitWebp, manitFallback, team, teamWebp, teamFallback } from "../assets/assets"
import { about } from "../assets/qcmData.json"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Building2, Trophy, Users, Sparkles, MapPin, Award } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const rows = sectionRef.current?.querySelectorAll(".showcase-row")
    if (rows) {
      rows.forEach((row, i) => {
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 50,
          duration: 0.9,
          delay: i * 0.1,
          ease: "power3.out",
        })
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient Atmospheric Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#fe9c02]/10 via-[#1D3441]/25 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] bg-[#26556A]/15 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-20 sm:gap-24">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#fe9c02]" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#fe9c02]">
              About The Society
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
            Intellect in Motion.{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#fe9c02] to-amber-200">
              Driven by Curiosity.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            A decade of competitive quizzing, national championships, and cultivating
            Central India&apos;s sharpest collegiate thinkers at MANIT Bhopal.
          </p>
        </div>

        {/* Showcase 1: The Institute — MANIT Bhopal */}
        <div className="showcase-row grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Narrative Side (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-5 text-left order-2 lg:order-1">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fe9c02] inline-block shadow-[0_0_10px_#fe9c02]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fe9c02]">
                Institute of National Importance
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Maulana Azad National Institute of Technology
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {about.manit}
            </p>

            {/* Metric Pills */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm flex flex-col text-left">
                <span className="text-lg sm:text-xl font-black text-white">650+</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Acres</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm flex flex-col text-left">
                <span className="text-lg sm:text-xl font-black text-white">1960</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Est. Year</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm flex flex-col text-left">
                <span className="text-lg sm:text-xl font-black text-[#fe9c02]">Top NIT</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Central India</span>
              </div>
            </div>
          </div>

          {/* Media Visual Side (6 cols) */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <picture className="w-full aspect-[4/3] block">
                <source srcSet={manit} type="image/avif" />
                <source srcSet={manitWebp} type="image/webp" />
                <img
                  src={manitFallback}
                  alt="MANIT Bhopal 650-Acre Campus"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </picture>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e28]/85 via-transparent to-transparent pointer-events-none" />

              {/* Overlay Glass Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#fe9c02]" />
                  <span className="text-xs font-semibold">MANIT Bhopal Campus</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Bhopal, MP
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Showcase 2: The Society — Quizzers' Club MANIT */}
        <div className="showcase-row grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center pt-8">
          
          {/* Media Visual Side (6 cols) */}
          <div className="lg:col-span-6 relative order-1">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <picture className="w-full aspect-[4/3] block">
                <source srcSet={team} type="image/avif" />
                <source srcSet={teamWebp} type="image/webp" />
                <img
                  src={teamFallback}
                  alt="Quizzers' Club MANIT Members and Quiz Arena"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </picture>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e28]/85 via-transparent to-transparent pointer-events-none" />

              {/* Overlay Glass Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#fe9c02]" />
                  <span className="text-xs font-semibold">The Quizzing Vanguard</span>
                </div>
                <span className="text-[11px] font-bold text-[#fe9c02] uppercase tracking-wider">
                  Official Society
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Side (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-5 text-left order-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fe9c02] inline-block shadow-[0_0_10px_#fe9c02]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fe9c02]">
                Central India&apos;s Largest Quizzing Hub
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Quizzers&apos; Club MANIT Bhopal
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {about.qcm}
            </p>

            {/* Society Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fe9c02]/15 text-[#fe9c02] flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white">National Arenas</span>
                  <span className="text-xs text-slate-400 mt-0.5">Organizers of Q-BIT, IQC, and Manthan Open</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fe9c02]/15 text-[#fe9c02] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white">1,500+ Community</span>
                  <span className="text-xs text-slate-400 mt-0.5">Active quizzers &amp; alumni in civil services &amp; tech</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default About
