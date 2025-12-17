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
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    initialSlide: 0,
    autoplay: true,
    className: "w-full",
  }

  return (
    <Container
      id="event"
      className="min-h-screen flex flex-col pt-2 justify-evenly items-center background-blue sm:gap-5 gap-1"
    >
      <SectionHead
        logo
        lightLogo
        label="Event"
        className="self-start text-white md:text-[38px]"
      />
      <div className="sm:w-[90%] w-full sm:flex items-center justify-center flex-col md:flex-row-reverse md:items-start p-[2vmax] text-white gap-2">
        <div className="md:w-[50%] md:h-[70vh] md:mt-[54px]">
          {event.images.length > 1 ? (
            <Slider {...settings}>
              {event.images.map((src, index) => (
                <div key={index}>
                  <img
                    src={src}
                    alt="Event Picture"
                    className="rounded-xl object-cover h-[50vh] md:h-[65vh]"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src={event.images[0]}
              alt="Event Picture"
              className="aspect-video rounded-xl h-[50vh]  md:h-[65vh]"
            />
          )}
        </div>
        <div className="md:w-[50%] p-2 flex flex-col md:gap-2 gap-1">
          <h3 className="font-bold text-3xl century-gothic first-letter:text-[#FCA311] uppercase">
            {event.title}
          </h3>
          <hr />
          {event.content.split("\n").map((para, index) => (
            <p
              className="md:text-base text-xs leading-relaxed text-justify"
              key={index}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </Container>
  )
}

export default Event
