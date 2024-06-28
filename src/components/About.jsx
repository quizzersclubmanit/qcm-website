import { Container, SectionHead, Accordion } from "./components"
import { about } from "../assets/qcmData.json"

const About = () => {
  const qna = [
    {
      question: "Question",
      answer: "Answer"
    }
  ]
  return (
    <Container
      id="about"
      className="w-screen sm:p-[3.5vmax] p-[2vmax] flex flex-col gap-5 justify-center sm:justify-between items-center sm:items-start"
    >
      <SectionHead label="About" />
      <p className="w-2/3 mx-auto mb-10 md:text-lg">{about}</p>
      <Accordion qna={qna} />
    </Container>
  )
}

export default About
