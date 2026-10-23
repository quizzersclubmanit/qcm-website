import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import SliderImport from "react-slick"
import { ChevronLeft, ChevronRight } from "lucide-react"
import EventCard from "./EventCard"
import { eventDetails } from "../assets/qcmData.json"

const Slider = SliderImport.default ?? SliderImport

const SlickPrevArrow = (props) => {
  const { onClick } = props
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous event"
      className="!hidden lg:!flex absolute top-1/2 -left-5 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-[#14213D]/90 hover:bg-[#FCA311] text-white hover:text-[#14213D] border border-white/20 hover:border-[#FCA311] shadow-xl backdrop-blur-md transition-all duration-200 focus:outline-none"
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
      className="!hidden lg:!flex absolute top-1/2 -right-5 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-[#14213D]/90 hover:bg-[#FCA311] text-white hover:text-[#14213D] border border-white/20 hover:border-[#FCA311] shadow-xl backdrop-blur-md transition-all duration-200 focus:outline-none"
    >
      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
    </button>
  )
}

const Events = () => {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

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
      className="w-full py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8 items-center">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FCA311]">
            Quizzers&apos; Club MANIT
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Flagship Events
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
            From premier inter-city school quizzing challenges to campus-wide
            treasure hunts and national open arenas.
          </p>
        </div>

        {/* Carousel */}
        <div className="w-full relative">
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
