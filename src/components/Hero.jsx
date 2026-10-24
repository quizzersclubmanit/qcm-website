import { bulb, bulbFallback, gradientLogo, gradientLogoFallback, floatingMarks } from "../assets/assets"
import { organization } from "../assets/qcmData.json"
import { Container } from "./components"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

const Hero = () => {
  const navigate = useNavigate()
  const ref0 = useRef(null)
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  const bulbRef = useRef(null)
  const organizationNameList = organization.split(" ")

  useGSAP(() => {
    // Respect reduced-motion: render final states instantly, no tickers
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([ref0.current.children, ref1.current.children], { opacity: 1, y: 0 })
      gsap.set([ref2.current, ref3.current], { opacity: 1, x: 0 })
      gsap.set(bulbRef.current, { opacity: 0.95, y: 0 })
      return
    }
    gsap
      .timeline()
      .to(ref0.current.children, {
        opacity: 1,
        delay: 0.6,
        transform: "translateY(0)",
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out"
      })
      .to(ref1.current.children, {
        opacity: 1,
        delay: 0.1,
        transform: "translateY(0)",
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out"
      })
      .from(ref2.current, {
        opacity: 0,
        x: "-100%",
        duration: 0.5,
        ease: "power2.out"
      })
      .from(ref3.current, {
        opacity: 0,
        x: "-100%",
        duration: 0.5,
        ease: "power2.out"
      })
      .from(bulbRef.current, {
        y: "25%",
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.2)"
      })
      .to(bulbRef.current, {
        y: "-8px",
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
  }, [])

  return (
    <Container
      id="hero"
      element="section"
      aria-label="Quizzers Club NIT Bhopal introduction"
      className="poppins-bold min-h-screen sm:h-screen flex flex-col-reverse sm:flex-row items-center justify-center sm:justify-evenly relative overflow-hidden pt-24 pb-12 sm:py-0 px-4 xs:px-6 sm:px-12 md:px-16"
    >
      <div className="background-img"></div>
      <div className="left w-full sm:w-1/2 flex flex-col justify-center items-center sm:items-start text-center sm:text-left text-white gap-0 z-10 mt-6 sm:mt-0">
        <h1 className="sr-only">
          Quizzers&apos; Club NIT Bhopal (QCM MANIT) — Official College Quizzing Club
        </h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-slate-200 mb-3 sm:mb-4 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#fe9c02] inline-block shadow-[0_0_8px_#fe9c02]" />
          <span>NIT Bhopal&apos;s Official Quizzing Society</span>
        </div>
        <div className="organization-name flex flex-wrap items-baseline justify-center sm:justify-start gap-x-2.5 sm:gap-x-4 mb-0.5" aria-hidden="true">
          <div ref={ref0} className="overflow-y-hidden leading-none flex whitespace-nowrap">
            {organizationNameList[0].split("").map((char, index) => (
              <span
                key={index}
                className="text-[8.5vw] xs:text-[7.5vw] sm:text-[5vmax] inline-block opacity-0 overflow-y-hidden"
                style={{
                  fontWeight: 700,
                  transform: "translateY(50%)"
                }}
              >
                {char.toUpperCase()}
              </span>
            ))}
          </div>
          <div ref={ref1} className="overflow-y-hidden leading-none flex whitespace-nowrap">
            {organizationNameList[1].split("").map((char, index) => (
              <span
                key={index}
                className="text-[8.5vw] xs:text-[7.5vw] sm:text-[5vmax] inline-block opacity-0 overflow-y-hidden"
                style={{
                  fontWeight: 700,
                  transform: "translateY(50%)"
                }}
              >
                {char.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        <p ref={ref2} className="text-[8.5vw] xs:text-[7.5vw] sm:text-[5vmax] overflow-y-hidden leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#fe9c02] to-amber-200 mt-1 sm:mt-1.5">
          NIT BHOPAL
        </p>
        <p
          ref={ref3}
          className="text-base xs:text-lg sm:text-xl md:text-[2vmax] overflow-y-hidden font-bold mt-2 sm:mt-2.5"
        >
          Central India&apos;s{" "}
          <span className="text-[#fe9c02] inline">
            Largest Quizzing Club
          </span>
        </p>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base font-normal max-w-lg mt-3 sm:mt-3.5 leading-relaxed">
          Where sharp minds clash and curiosity thrives. Central India&apos;s
          largest collegiate quizzing society, hosted live at MANIT Bhopal.
        </p>

        <div className="mt-6 sm:mt-7 flex flex-col xs:flex-row items-stretch xs:items-center justify-center sm:justify-start gap-3 w-full sm:w-auto relative z-20">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="btn-shimmer inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-[#fe9c02] to-amber-500 px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-[#0c1e28] shadow-[0_4px_25px_rgba(254,156,2,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_8px_35px_rgba(254,156,2,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <span>Register for Q-BIT &apos;26</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
          <a
            href="#events"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/50 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/20"
          >
            <span>Explore Events</span>
            <span aria-hidden="true">&darr;</span>
          </a>
        </div>

        
      </div>

      <div className="right w-full sm:w-1/2 flex items-center justify-center relative z-10 shrink-0 my-3 sm:my-0">
        <div className="relative flex items-center justify-center w-[230px] xs:w-[260px] sm:w-[360px] md:w-[440px] lg:w-[490px] aspect-square">
          {/* Subtle Ambient Backlight */}
          <div className="absolute w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-[#fe9c02]/20 via-[#26556a]/30 to-transparent blur-3xl pointer-events-none" />

          {/* Rotating Planetary Ring */}
          <div className="absolute w-[92%] h-[92%] rounded-full border border-dashed border-[#fe9c02]/20 animate-spin-slow pointer-events-none" />

          {/* Floating Pill Badge 1 (Top-Right) */}
          <div className="hidden xs:flex absolute top-1 -right-2 sm:top-6 sm:-right-4 z-20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-[#0c1e28]/95 border border-white/20 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] text-[11px] sm:text-xs font-semibold text-white items-center gap-2 animate-float-slow hover:scale-105 transition-transform duration-300">
            <span className="w-2 h-2 rounded-full bg-[#fe9c02] inline-block shadow-[0_0_8px_#fe9c02]" />
            <span>Central India&apos;s #1</span>
          </div>

          {/* Floating Pill Badge 2 (Bottom-Left) */}
          <div className="hidden xs:flex absolute bottom-2 -left-2 sm:bottom-8 sm:-left-4 z-20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-[#0c1e28]/95 border border-white/20 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] text-[11px] sm:text-xs font-semibold text-white items-center gap-2 animate-float-slow [animation-delay:2s] hover:scale-105 transition-transform duration-300">
            <span className="text-[#fe9c02] text-xs font-bold drop-shadow">★</span>
            <span>10+ Yrs Quizzing</span>
          </div>

          {/* QCM Gradient Logo (Backdrop Emblem) */}
          <picture className="w-full h-full flex items-center justify-center">
            <source srcSet={gradientLogo} type="image/webp" />
            <img
              src={gradientLogoFallback}
              alt="Quizzers' Club NIT Bhopal (QCM) logo"
              className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              width="480"
              height="480"
              fetchPriority="high"
            />
          </picture>

          {/* Bulb & Hand (Positioned directly in front of the QCM logo) */}
          <picture className="absolute inset-0 h-full w-full flex justify-center items-end pointer-events-none z-10 overflow-visible">
            <source srcSet={bulb} type="image/webp" />
            <img
              ref={bulbRef}
              src={bulbFallback}
              alt="Quiz idea bulb illustration — QCM MANIT quizzing"
              className="h-[96%] sm:h-[90%] md:h-[94%] w-auto max-h-[460px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] select-none"
              loading="eager"
              width="203"
              height="503"
            />
          </picture>
        </div>
      </div>

      <img
        src={floatingMarks}
        alt=""
        aria-hidden="true"
        className="hidden scale-90 md:block absolute left-14 top-14 h-[calc(100vh-40px)] object-cover z-0 pointer-events-none"
        loading="lazy"
      />
    </Container>
  )
}

export default Hero
