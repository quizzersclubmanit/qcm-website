import "./pages.css"
import { useParams } from "react-router-dom"
import { Container, SectionHead } from "../components/components"
import { eventDetails } from "../assets/qcmData.json"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Event = () => {
  const { eventId } = useParams()
  const event = eventDetails.filter((item) => item.id == eventId)[0]
  const settings = {
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    initialSlide: 0,
    autoplay: true,
    className: "w-full"
  }

  return (
    <div
      id="event"
      className="londrina-solid-regular min-h-screen flex flex-col px-5 pb-5 justify-evenly items-center"
    >
      <SectionHead label="Event" className="text-white" />
      <Container className="sm:w-[60%] w-full flex flex-col p-[1vmax] bg-white rounded-lg gap-5">
        <Slider {...settings}>
          {event.images.map((src, index) => (
            <div key={index}>
              <img
                src={src}
                alt="Event Picture"
                className="aspect-video rounded-lg"
              />
            </div>
          ))}
        </Slider>
        <div className="p-2">
          <h3 className="font-bold text-[3vmax]">{event.title}</h3>
          <p>{event.content}</p>
        </div>
      </Container>
    </div>
  )
}

export default Event
