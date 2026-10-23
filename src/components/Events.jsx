import { useRef } from "react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import SliderImport from "react-slick"
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react"
import EventCard from "./EventCard"
import { eventDetails } from "../assets/qcmData.json"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Slider = SliderImport.default ?? SliderImport

const SlickPrevArrow = (props) => {
  const { onClick } = props
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous event"
      className="!hidden lg:!flex absolute top-1/2 -left-6 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-[#0c1e28]/95 hover:bg-[#fe9c02] text-white hover:text-[#0c1e28] border border-white/20 hover:border-[#fe9c02] shadow-xl backdrop-blur-md transition-all duration-200 focus:outline-none hover:scale-105 active:scale-95"
    >
      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
    </button>
  )
}

const SlickNextArrow = (props) => {
  const { onClick } = props
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next event"
      className="!hidden lg:!flex absolute top-1/2 -right-6 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-[#0c1e28]/95 hover:bg-[#fe9c02] text-white hover:text-[#0c1e28] border border-white/20 hover:border-[#fe9c02] shadow-xl backdrop-blur-md transition-all duration-200 focus:outline-none hover:scale-105 active:scale-95"
    >
      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
    </button>
  )
}

const Events = () => {
  const sectionRef = useRef(null)

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useGSAP(() => {
    if (reduceMotion) return

    gsap.from(sectionRef.current?.querySelector(".events-slider-wrap"), {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
    })
  }, { scope: sectionRef })

  const settings = {
    infinite: true,
    speed: reduceMotion ? 0 : 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: !reduceMotion,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <SlickPrevArrow />,
    nextArrow: <SlickNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: false,
        },
      },
    ],
  }

  return (
    <section
      id="events"
      ref={sectionRef}
      className="w-full py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10 items-center">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fe9c02]/10 border border-[#fe9c02]/30 text-xs font-bold uppercase tracking-[0.2em] text-[#fe9c02]">
            <Trophy className="w-3.5 h-3.5" />
            <span>Competitive Arenas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Flagship Events
          </h2>
          <div className="w-12 h-1 bg-[#fe9c02] rounded-full mt-1" />

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg pt-1">
            From premier inter-city collegiate championships to campus-wide
            treasure hunts and national open arenas.
          </p>
        </div>

        {/* Carousel */}
        <div className="events-slider-wrap w-full relative">
          <Slider {...settings}>
            {eventDetails.map((dets, index) => (
              <EventCard dets={dets} key={index} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default Events
