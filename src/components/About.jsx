import { Container, SectionHead } from "./components"
import { about } from "../assets/qcmData.json"

const About = () => {
  return (
    <Container
      id="about"
      className="w-screen bg-[#f8f3ea] sm:p-[3.5vmax] justify-center sm:justify-between items-center sm:items-start flex flex-col lg:flex-row lg:justify-between gap-4"
    >
      <div className="flex flex-col sm:w-1/3 sm:p-0 p-2 w-full mr-3 justify-between items-center">
        <SectionHead label="About Us" />
        {/* to be animated */}
        <img
          src="/team.jpeg"
          alt="Team"
          className="rounded-lg hidden lg:inline-block"
        />
      </div>
      <div className="flex flex-col sm:gap-1 md:w-2/3 w-full mx-auto md:text-base text-xs border-2 border-slate-800 rounded-lg">
        {about.split("\n").map((para, index) => (
          <p
            key={index}
            className="text-justify px-4 sm:py-4 py-2 first-letter:text-[#FCA311] sm:first-letter:text-3xl first-letter:text-lg"
          >
            {para}
          </p>
        ))}
      </div>
    </Container>
  )
}

export default About
