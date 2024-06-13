import { Container, SectionHead } from "./components"
import { about } from "../assets/qcmData.json"

const About = () => {
  return (
    <Container
      id="about"
      className="londrina-solid-regular w-screen sm:p-[3.5vmax] p-[2vmax] sm:min-h-[80vh] min-h-1/2 flex flex-col gap-5 justify-center sm:justify-start items-center sm:items-start"
    >
      <SectionHead label="About" outline={false} />
      <p className="w-2/3 md:text-lg">{about}</p>
    </Container>
  )
}

export default About
