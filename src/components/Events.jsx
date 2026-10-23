import Container from "./Container"
import SectionHead from "./SectionHead"
import EventCard from "./EventCard"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import SliderImport from "react-slick"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { eventDetails } from "../assets/qcmData.json"

const Slider = SliderImport.default ?? SliderImport

const SlickPrevArrow = (props) => {
  const { className, style, onClick } = props
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous event"
      className="!hidden md:!flex absolute top-1/2 -left-4 lg:-left-6 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-[#14213D]/90 hover:bg-[#FCA311] text-white hover:text-[#14213D] border border-white/20 hover:border-[#FCA311] shadow-xl backdrop-blur-md transition-all duration-200 focus:outline-none"
    >
      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
    </button>
  )
}

const SlickNextArrow = (props) => {
  const { className, style, onClick } = props
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next event"
      className="!hidden md:!flex absolute top-1/2 -right-4 lg:-right-6 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-[#14213D]/90 hover:bg-[#FCA311] text-white hover:text-[#14213D] border border-white/20 hover:border-[#FCA311] shadow-xl backdrop-blur-md transition-all duration-200 focus:outline-none"
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
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <SlickPrevArrow />,
    nextArrow: <SlickNextArrow />,
    responsive: [
      {
        breakpoint: 1180,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  }

  return (
    <section
      id="events"
      className="w-full py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6 items-center">
        <div className="w-full flex flex-col items-center text-center">
          <SectionHead label="Events" className="text-white" />
          <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl">
            From premier inter-city school challenges to national quizzing arenas
            and campus-wide treasure hunts.
          </p>
        </div>

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
