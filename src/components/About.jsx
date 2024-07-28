import { Container, SectionHead, Accordion } from "./components"
import { about } from "../assets/qcmData.json"

const About = () => {
  const qna = [
    {
      question: "Question",
      answer: "Answer"
    },
    {
      question: "Question",
      answer: "Answer"
    },
    {
      question: "Question",
      answer: "Answer"
    },
    {
      question: "Question",
      answer: "Answer"
    },
    {
      question: "Question",
      answer: "Answer"
    },
    {
      question: "Question",
      answer: "Answer"
    },
    {
      question: "Question",
      answer: "Answer"
    }
  ]
  return (
    <Container
      id="about"
      className="w-screen sm:p-[3.5vmax] p-[2vmax] flex flex-col gap-5 justify-center sm:justify-between items-center sm:items-start relative"
    >
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <SectionHead label="About Us" />
        <p className="w-2/3 mb-10 mx-auto lg:mx-0 md:text-lg font-semibold">
          {about}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <img
          src={`/hero-bg.jpeg?url`}
          className="w-[65%] h-[100%] rounded-3xl border-[10px] border-[#c0c0c0] bg-center mx-auto"
        />
        <Accordion qna={qna} />
      </div>
    </Container>
  )
}

export default About
