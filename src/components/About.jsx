import { useRef } from "react"
import { Container } from "./components"
import { about } from "../assets/qcmData.json"
import { manit, manitWebp, manitFallback, team, teamWebp, teamFallback } from "../assets/assets"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const containerRef = useRef(null)

  const data = [
    {
      title: "Maulana Azad National Institute of Technology",
      subtitle: "Institute of National Importance • Bhopal",
      tag: "650-Acre Campus • Est. 1960",
      content: about.manit,
      imgSrc: manit,
      imgWebp: manitWebp,
      imgFallback: manitFallback,
      alt: "Maulana Azad National Institute of Technology (MANIT) Bhopal campus",
      reverse: false
    },
    {
      title: "Quizzers' Club NIT Bhopal",
      subtitle: "Central India's Largest Quizzing Society",
      tag: "Central India's Quizzing Hub",
      content: about.qcm,
      imgSrc: team,
      imgWebp: teamWebp,
      imgFallback: teamFallback,
      alt: "Quizzers' Club NIT Bhopal (QCM MANIT) members at a quiz event",
      reverse: true
    }
  ]

  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const rows = containerRef.current?.querySelectorAll(".about-row")
    if (rows) {
      rows.forEach((row) => {
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
        })
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
          A decade of curiosity, national arenas, and cultivating Central India&apos;s
          sharpest quizzing culture.
        </p>
      </div>

      <div className="flex flex-col gap-14 sm:gap-16">
        {data.map((obj, index) => (
          <div
            key={index}
            className={`about-row flex flex-col ${
              obj.reverse ? "md:flex-row-reverse" : "md:flex-row"
            } items-center gap-8 lg:gap-12`}
          >
            {/* Text Card */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 rounded-2xl bg-[#0c1e28]/80 hover:bg-[#0c1e28]/95 border border-white/10 hover:border-[#fe9c02]/40 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#fe9c02]">
                  {obj.subtitle}
                </span>
                <span className="text-xs font-mono font-bold text-white/30">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 mb-3">
                {obj.title}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-left">
                {obj.content}
              </p>
            </div>

            {/* Image Card */}
            <div className="relative w-full md:w-2/5 aspect-[16/10] md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl group">
              <picture className="w-full h-full">
                <source srcSet={obj.imgSrc} type="image/avif" />
                <source srcSet={obj.imgWebp} type="image/webp" />
                <img
                  src={obj.imgFallback}
                  alt={obj.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </picture>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-slate-200 pointer-events-none">
                {obj.tag}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default About
