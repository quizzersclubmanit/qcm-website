import "./pages.css"
import { useParams } from "react-router-dom"
import { Container, SectionHead } from "../components/components"
import SEO from "../components/SEO.jsx"
import { avifSrcSet, webpSrcSet } from "../utils/img.js"
import { eventDetails } from "../assets/qcmData.json"
import SliderModule from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Rolldown interop can hand react-slick through as { default: Slider }
// instead of the component itself (React #130 "got: object" on /events/*).
// Normalize at runtime so both shapes resolve to the component.
const Slider = (SliderModule && SliderModule.default) || SliderModule

const Event = () => {
  const { eventId } = useParams()
  const event = eventDetails.filter((item) => item.id == eventId)[0]
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const settings = {
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    initialSlide: 0,
    autoplay: !reduceMotion,
    className: "w-full",
  }

  const eventTitle = event?.title || "Quiz Event"
  const eventDescription =
    event?.desc ||
    event?.content?.split("\n")[0]?.slice(0, 155) ||
    `Details, photos and highlights of ${eventTitle} by Quizzers' Club NIT Bhopal (QCM MANIT).`
  const eventSchema = event
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: `${event.title} — Quizzers' Club NIT Bhopal`,
        description: event.content?.slice(0, 300),
        image: event.images?.map((src) =>
          src.startsWith("http") ? src : `https://www.quizzersclub.com${src}`
        ),
        organizer: {
          "@type": "Organization",
          name: "Quizzers' Club NIT Bhopal",
          url: "https://www.quizzersclub.com/",
        },
        location: {
          "@type": "Place",
          name: "MANIT Bhopal",
          address: "Bhopal, Madhya Pradesh, India",
        },
      }
    : null

  if (!event) {
    return (
      <Container
        id="event"
        className="min-h-screen flex flex-col pt-2 justify-evenly items-center background-blue sm:gap-5 gap-1"
      >
        <SEO
          title="Event Not Found | Quizzers' Club NIT Bhopal"
          description="The quiz event you are looking for doesn't exist. Explore QBIT, inter-college quizzes and events by QCM MANIT."
          path={`/events/${eventId}`}
          noindex
        />
        <SectionHead logo lightLogo label="Event" className="self-start text-white md:text-[38px]" />
        <div className="p-8 text-white text-center">
          <h1 className="font-bold text-3xl uppercase">Event not found</h1>
          <p className="mt-2 text-sm text-white/80">
            The event “{eventId}” doesn’t exist or was moved. Head back home to explore quizzes and events.
          </p>
          <a href="/" className="mt-4 inline-block underline">Go to Home</a>
        </div>
      </Container>
    )
  }

  return (
    <Container
      id="event"
      className="min-h-screen flex flex-col pt-2 justify-evenly items-center background-blue sm:gap-5 gap-1"
    >
      <SEO
        title={`${eventTitle} | Quizzers' Club NIT Bhopal (QCM MANIT)`}
        description={eventDescription}
        path={`/events/${eventId}`}
        schema={eventSchema}
        crumbs={[{ name: eventTitle, item: `https://www.quizzersclub.com/events/${eventId}` }]}
      />
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
              {event.images.map((src, index) => {
                const avif = avifSrcSet(src)
                const webp = webpSrcSet(src)
                const isLcp = index === 0
                return (
                  <div key={index}>
                    <picture>
                      {avif && <source srcSet={avif} sizes="90vw" type="image/avif" />}
                      {webp && <source srcSet={webp} sizes="90vw" type="image/webp" />}
                      <img
                        src={src}
                        alt={`${event.title} quiz event photo ${index + 1} — Quizzers' Club NIT Bhopal`}
                        className="rounded-xl object-cover h-[50vh] md:h-[65vh]"
                        loading={isLcp ? "eager" : "lazy"}
                        fetchPriority={isLcp ? "high" : undefined}
                        decoding="async"
                      />
                    </picture>
                  </div>
                )
              })}
            </Slider>
          ) : (
            <picture>
              {avifSrcSet(event.images[0]) && <source srcSet={avifSrcSet(event.images[0])} sizes="90vw" type="image/avif" />}
              {webpSrcSet(event.images[0]) && <source srcSet={webpSrcSet(event.images[0])} sizes="90vw" type="image/webp" />}
              <img
                src={event.images[0]}
                alt={`${event.title} quiz event — Quizzers' Club NIT Bhopal`}
                className="aspect-video rounded-xl h-[50vh]  md:h-[65vh]"
                decoding="async"
              />
            </picture>
          )}
        </div>
        <div className="md:w-[50%] p-2 flex flex-col md:gap-2 gap-1">
          <h1 className="font-bold text-3xl century-gothic first-letter:text-[#FCA311] uppercase">
            {event.title}
          </h1>
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
