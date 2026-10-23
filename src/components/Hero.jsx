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
      className="poppins-bold min-h-screen sm:h-screen flex flex-col-reverse sm:flex-row items-center justify-center sm:justify-evenly relative overflow-hidden pt-24 pb-10 sm:py-0 px-6 sm:px-12 md:px-16"
    >
      <div className="background-img"></div>
      <div className="left w-full sm:w-1/2 flex flex-col justify-center items-start text-white gap-0 z-10 mt-6 sm:mt-0">
        <h1 className="sr-only">
          Quizzers&apos; Club NIT Bhopal (QCM MANIT) — Official College Quizzing Club
        </h1>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-slate-200 mb-4 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#fe9c02] inline-block" />
          <span>NIT Bhopal&apos;s Official Quizzing Society</span>
        </div>
        <div className="organization-name flex flex-row flex-wrap" aria-hidden="true">
          <div ref={ref0} className="overflow-y-hidden leading-none">
            {organizationNameList[0].split("").map((char, index) => (
              <span
                key={index}
                className="sm:text-[5vmax] text-[12vmin] inline-block opacity-0 overflow-y-hidden "
                style={{
                  fontWeight: 700,
                  transform: "translateY(50%)"
                }}
              >
                {char.toUpperCase()}
              </span>
            ))}
          </div>
          <div ref={ref1} className="overflow-y-hidden leading-none">
            {organizationNameList[1].split("").map((char, index) => (
              <span
                key={index}
                className="sm:text-[5vmax] text-[12vmin] inline-block opacity-0 overflow-y-hidden "
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
        <p ref={ref2} className="text-[5vmax] overflow-y-hidden leading-none font-bold">
          NIT BHOPAL
        </p>
        <p
          ref={ref3}
          className="md:text-[2vmax] text-[3vmax] overflow-y-hidden"
        >
          Central India's{" "}
          <span className="text-[#fe9c02] md:inline block">
            Largest Quizzing Club
          </span>
        </p>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base font-normal max-w-lg mt-3.5 leading-relaxed">
          Where sharp minds clash and curiosity thrives. Central India&apos;s
          largest collegiate quizzing society, hosted live at MANIT Bhopal.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3.5 relative z-20">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-[#fe9c02] to-amber-500 px-6 py-3 text-sm font-bold text-[#0c1e28] shadow-lg shadow-[#fe9c02]/25 hover:shadow-xl hover:shadow-[#fe9c02]/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <span>Register for Q-BIT &apos;26</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
          <a
            href="#events"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Events</span>
            <span aria-hidden="true">&darr;</span>
          </a>
        </div>

        
      </div>

      <div className="right w-full sm:w-1/2 flex items-center justify-center relative z-10">
        <div className="relative flex items-center justify-center w-[250px] xs:w-[290px] sm:w-[380px] md:w-[440px] lg:w-[490px] aspect-square">
          {/* Subtle Ambient Backlight */}
          <div className="absolute w-3/4 h-3/4 rounded-full bg-[#fe9c02]/15 blur-3xl pointer-events-none" />

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
          <picture className="absolute inset-x-0 bottom-0 flex justify-center items-end pointer-events-none z-10">
            <source srcSet={bulb} type="image/webp" />
            <img
              ref={bulbRef}
              src={bulbFallback}
              alt="Quiz idea bulb illustration — QCM MANIT quizzing"
              className="h-[80%] sm:h-[86%] md:h-[92%] w-auto max-h-[460px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] animate-float-slow"
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
