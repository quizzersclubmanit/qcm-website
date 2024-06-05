import { Container, SectionHead, EventCard } from "../components/components"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import {eventDetails} from "../assets/qcmData.json"

const Events = () => {
  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1300,
        settings: {slidesToShow: 2}
      },
      {
        breakpoint: 815,
        settings: {slidesToShow: 1}
      }
    ]
  }

  return (
    <div id="events">
      <Container className="min-h-screen flex flex-col londrina-solid-regular sm:justify-between justify-center gap-5 items-center sm:items-start">
        <SectionHead label="Events" className="text-white" />
        <div className="w-full">
          <Slider {...settings}>
            {eventDetails.map((dets, index) => (
              <EventCard dets={dets} key={index} />
            ))}
          </Slider>
        </div>
      </Container>
    </div>
  )
}

export default Events
