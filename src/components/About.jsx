import { Container, SectionHead, Accordion } from "./components"
import { about, qna } from "../assets/qcmData.json"

const About = () => {
  return (
    <Container
      id="about"
      className="w-screen min-h-screen bg-[#faf8f3] sm:p-[3.5vmax] p-[2vmax] flex flex-col gap-10 justify-center sm:justify-between items-center sm:items-start relative"
    >
      <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-4">
        <div className="flex flex-col sm:w-1/3 sm:p-0 p-2 w-full mr-3 justify-between">
          <SectionHead label="About Us" />
          {/* to be animated */}
          <img
            src="/team.jpeg"
            alt="Team"
            className="rounded-lg hidden sm:inline-block"
          />
        </div>
        <div className="flex flex-col gap-1 sm:w-2/3 mx-auto lg:mx-0 md:text-base text-xs">
          {about.split("\n").map((para, index) => (
            <p
              key={index}
              className="whitespace-pre-wrap p-4 border border-slate-800 rounded-lg"
            >
              {para}
            </p>
          ))}
        </div>
      </div>
      <h3 className="poppins-bold sm:text-[2.5vmax] text-[3vmax] text-center w-full">
        Frequently Asked Questions
      </h3>
      <Accordion qna={qna} />
    </Container>
  )
}

export default About
