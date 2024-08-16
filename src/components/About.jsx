import { Container, SectionHead, Accordion } from "./components"
import { about } from "../assets/qcmData.json"
import { bgAboutUs, aboutIllus } from "../assets/assets"
import { useState } from "react"

const About = () => {
  const [exploreMore, setExploreMore] = useState(false)
  const content = exploreMore ? about : about.split("\n").slice(0,2).join("\n")

  function exploreMoreHandler(){
    setExploreMore(!exploreMore)
  }

  return (
    <Container
      id="about"
      classname="w-screen"
    >
      <img
        src={bgAboutUs}
        alt="about"
        className="w-full"
      />
      <div className="w-11/12 mx-auto flex my-4">
        <p className="md:w-[60%] p-4 whitespace-pre-wrap">
          {content}
          <span className="text-[#fe9c02] cursor-pointer" onClick={exploreMoreHandler}>
            {exploreMore ? "\nExplore Less..." : "\nExplore More..."}
          </span>
        </p>
        <img
          src={aboutIllus}
          alt="about"
          className="mx-auto hidden md:flex"
        />
      </div>
    </Container>
  )
}

export default About
