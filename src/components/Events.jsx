import Container from "./Container"
import SectionHead from "./SectionHead"
import EventCard from "./EventCard"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import SliderImport from "react-slick"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { eventDetails } from "../assets/qcmData.json"

const Slider = SliderImport.default ?? SliderImport

const SlickPrevArrow = (props) => {
  const { className, style, onClick } = props
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous event"
      className="!hidden md:!flex absolute top-1/2 -left-3 lg:-left-6 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-slate-900/90 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/20 hover:border-amber-400 shadow-2xl backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
      className="!hidden md:!flex absolute top-1/2 -right-3 lg:-right-6 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-slate-900/90 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/20 hover:border-amber-400 shadow-2xl backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
    prevArrow: <SlickPrevArrow />,
    nextArrow: <SlickNextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  }

  return (
    <Container
      id="events"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-8 items-center"
    >
      <div className="w-full flex flex-col items-center text-center">
        <SectionHead label="Events" className="text-white" />
        <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-2xl">
          From nationwide open quizzes to thrilling campus-wide treasure hunts,
          explore the legacy and excitement of Quizzers&apos; Club NIT Bhopal.
        </p>
      </div>

      <div className="w-full relative px-2 sm:px-6">
        <Slider {...settings}>
          {eventDetails.map((dets, index) => (
            <EventCard dets={dets} key={index} />
          ))}
        </Slider>
      </div>
    </Container>
  )
}

export default Events
