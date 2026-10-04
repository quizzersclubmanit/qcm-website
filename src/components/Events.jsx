import Container from "./Container";
import SectionHead from "./SectionHead";
import EventCard from "./EventCard";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import SliderImport from "react-slick";
const Slider = SliderImport.default ?? SliderImport;
import { eventDetails } from "../assets/qcmData.json"

const Events = () => {
  const settings = {
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    className: "w-full",
    autoplay: true,
    responsive: [
      {
        breakpoint: 1300,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 815,
        settings: { arrows: false, slidesToShow: 1}
      }
    ]
  }

  console.log({
  Container,
  SectionHead,
  EventCard,
  Slider,
  containerType: typeof Container,
  sectionHeadType: typeof SectionHead,
  eventCardType: typeof EventCard,
  sliderType: typeof Slider
});

  return (
    <Container
      id="events"
      className="w-screen sm:px-[3.5vmax] p-[2vmax] sm:min-h-screen min-h-[70vh] flex flex-col sm:justify-between justify-center gap-5 items-center"
    >
      <SectionHead label="Events" className="text-white bg-red" />
      <Slider {...settings}>
        {eventDetails.map((dets, index) => (
          <EventCard dets={dets} key={index} />
        ))}
      </Slider>
    </Container>
  )
}

export default Events

