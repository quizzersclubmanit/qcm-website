import { sponsors } from "../assets/qcmData.json"
import { Container, SectionHead } from "./components"

const Sponsors = () => {
  return (
    <Container
      id="sponsors"
      className="w-screen sm:p-[3.5vmax] p-[2vmax] sm:min-h-screen min-h-[70vh] flex flex-col sm:justify-between justify-center gap-8 items-center sm:items-center"
    >
      <SectionHead label="Our Sponsors" />
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {sponsors.map((sponsor, index) => (
          <a
            key={index}
            href={sponsor.website}
            target="_blank"
            className="sm:h-[20vh] h-[15vh] flex justify-center items-center"
          >
            <img
              src={sponsor.logo}
              alt={`${sponsor.brand} logo`}
              className="max-h-full"
            />
          </a>
        ))}
      </div>
    </Container>
  )
}

export default Sponsors
