import { Container, SectionHead, Accordion } from "./components"
import { about, qna } from "../assets/qcmData.json"
import Image from "../../public/hero-bg.jpeg"

const About = () => {
  return (
    <Container
      id="about"
      className="w-screen sm:p-[3.5vmax] p-[2vmax] flex flex-col gap-5 justify-center sm:justify-between items-center sm:items-start relative"
    >
      <div className="w-full flex flex-col lg:flex-row-reverse items-center gap-4">
        <img
          src={`/hero-bg.jpeg?url`}
          className="w-[50%] h-full rounded-3xl border-[10px] border-[#1b2834] bg-center mx-auto"
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
