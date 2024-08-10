import { Container, SectionHead, Accordion } from "./components"
import { about, qna } from "../assets/qcmData.json"

const About = () => {
  return (
    <Container
      id="about"
      className="w-screen sm:p-[3.5vmax] p-[2vmax] flex flex-col gap-5 justify-center sm:justify-between items-center sm:items-start relative"
    >
      <div className="w-full flex flex-col lg:flex-row-reverse lg:justify-between items-start gap-4">
        <img
          src={`/hero-bg.jpeg?url`}
          className="w-[50%] h-full rounded-3xl border-[10px] border-[#1b2834] bg-center mx-auto"/>
        <SectionHead label="About Us" className="p-2" />
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
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <img
          src={`/team.jpeg?url`}
          className="sm:w-[65%] h-[100%] sm:rounded-3xl bg-center mx-auto"
        />
        <div className="flex flex-col lg:w-2/3">
          <h1 className="text-[#fff] text-6xl font-semibold overflow-hidden">About Us</h1>
          <p className="w-full pt-4 lg:mx-0 lg:text-base lg:text-[#fff] text-xs font-semibold whitespace-pre-wrap leading-relaxed">{about}</p>
        </div>
      </div>
      <div className="w-full flex lg:justify-end justify-center">
        <Accordion qna={qna}/>
      </div>
    </Container>
  )
}

export default About
