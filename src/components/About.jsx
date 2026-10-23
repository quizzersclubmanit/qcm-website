import { useRef } from "react"
import { Link } from "react-router-dom"
import { Container } from "./components"
import { about } from "../assets/qcmData.json"
import { manit, manitWebp, manitFallback, team, teamWebp, teamFallback } from "../assets/assets"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const containerRef = useRef(null)

  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const cards = containerRef.current?.querySelectorAll(".bento-card")
    if (cards) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
      })
    }
  }, { scope: containerRef })

  return (
    <Container
      id="about"
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col gap-12"
    >
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fe9c02]/10 border border-[#fe9c02]/30 text-xs font-bold uppercase tracking-[0.2em] text-[#fe9c02]">
          <span>Heritage &amp; Legacy</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          About Us
        </h2>
        <div className="w-12 h-1 bg-[#fe9c02] rounded-full mt-1" />
        <p className="text-slate-300 text-xs sm:text-sm max-w-md pt-1">
          A decade of intellectual curiosity, national arenas, and cultivating Central India&apos;s
          sharpest quizzing culture.
        </p>
      </div>

      {/* Bento Grid Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full">
        
        {/* Bento 1: MANIT Bhopal (7 cols) */}
        <div className="bento-card lg:col-span-7 rounded-3xl bg-[#0c1e28]/80 hover:bg-[#0c1e28]/95 border border-white/10 hover:border-[#fe9c02]/40 backdrop-blur-md shadow-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#fe9c02]">
                Institute of National Importance
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                Est. 1960
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Maulana Azad National Institute of Technology
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              {about.manit}
            </p>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <picture className="w-full h-full">
              <source srcSet={manit} type="image/avif" />
              <source srcSet={manitWebp} type="image/webp" />
              <img
                src={manitFallback}
                alt="MANIT Bhopal Campus"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </picture>
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-slate-200">
              650-Acre Campus &bull; Bhopal, MP
            </div>
          </div>
        </div>

        {/* Bento 2: Quizzers' Club Society (5 cols) */}
        <div className="bento-card lg:col-span-5 rounded-3xl bg-[#0c1e28]/80 hover:bg-[#0c1e28]/95 border border-white/10 hover:border-[#fe9c02]/40 backdrop-blur-md shadow-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#fe9c02]">
                Official Society
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fe9c02]/15 text-[#fe9c02]">
                10+ Years
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Quizzers&apos; Club MANIT
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              {about.qcm}
            </p>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <picture className="w-full h-full">
              <source srcSet={team} type="image/avif" />
              <source srcSet={teamWebp} type="image/webp" />
              <img
                src={teamFallback}
                alt="Quizzers' Club Members"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </picture>
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-[#fe9c02]">
              Central India&apos;s Quizzing Hub
            </div>
          </div>
        </div>

        {/* Bento 3: Pillar Stat 1 - Flagship Arena (4 cols) */}
        <div className="bento-card lg:col-span-4 rounded-3xl bg-[#0c1e28]/70 hover:bg-[#0c1e28]/90 border border-white/10 hover:border-[#fe9c02]/40 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#fe9c02]/15 border border-[#fe9c02]/30 flex items-center justify-center text-[#fe9c02] text-lg font-bold mb-4">
              Q
            </div>
            <h4 className="text-lg font-bold text-white group-hover:text-[#fe9c02] transition-colors mb-2">
              Q-BIT Annual Fest
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Central India&apos;s premier collegiate quiz championship bringing top quizzing teams from institutions nationwide.
            </p>
          </div>
          <Link
            to="/signup"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#fe9c02] hover:text-amber-300 transition-colors pt-2.5 border-t border-white/10"
          >
            <span>Register for Q-BIT &apos;26</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Bento 4: Pillar Stat 2 - IQC (4 cols) */}
        <div className="bento-card lg:col-span-4 rounded-3xl bg-[#0c1e28]/70 hover:bg-[#0c1e28]/90 border border-white/10 hover:border-[#fe9c02]/40 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white text-sm font-bold mb-4 font-mono">
              IQC
            </div>
            <h4 className="text-lg font-bold text-white group-hover:text-[#fe9c02] transition-colors mb-2">
              Inter-City Championship
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The prestigious junior and inter-city tournament inspiring thousands of high school &amp; prep scholars across Central India.
            </p>
          </div>
          <Link
            to="/events/iqc"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 group-hover:text-[#fe9c02] transition-colors pt-2.5 border-t border-white/10"
          >
            <span>Explore IQC Details</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Bento 5: Pillar Stat 3 - Anveshan (4 cols) */}
        <div className="bento-card lg:col-span-4 rounded-3xl bg-[#0c1e28]/70 hover:bg-[#0c1e28]/90 border border-white/10 hover:border-[#fe9c02]/40 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white text-lg font-bold mb-4">
              🧭
            </div>
            <h4 className="text-lg font-bold text-white group-hover:text-[#fe9c02] transition-colors mb-2">
              Anveshan Treasure Hunt
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              650-acre sprawling campus hunt. Cryptic clues, physical checkpoints, and a high-stakes race against the clock.
            </p>
          </div>
          <Link
            to="/events/anveshan"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 group-hover:text-[#fe9c02] transition-colors pt-2.5 border-t border-white/10"
          >
            <span>Discover Anveshan</span>
            <span>&rarr;</span>
          </Link>
        </div>

      </div>
    </Container>
  )
}

export default About
