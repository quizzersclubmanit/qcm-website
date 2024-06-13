import { bulb } from "../assets/assets"
import { organization } from "../assets/qcmData.json"
import { Container } from "./components"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

const Hero = () => {
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  const bulbRef = useRef(null)

  useGSAP(() => {
    gsap
      .timeline()
      .from(ref1.current, {
        opacity: 0,
        x: "-200%",
        duration: 1
      })
      .from(ref2.current, {
        opacity: 0,
        x: "-200%",
        duration: 0.7
      })
      .from(ref3.current, {
        opacity: 0,
        x: "-200%",
        duration: 0.7
      })

    gsap.to(bulbRef.current, {
      y: "2%",
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.in"
    })
  }, [])

  return (
    <Container
      id="hero"
      className="londrina-solid-regular h-screen flex flex-col sm:flex-row items-center justify-evenly"
    >
      <div className="left w-full h-full my-[10vh] sm:my-0 sm:w-2/3 flex flex-col justify-center items-center text-white gap-5">
        <h1
          ref={ref1}
          className="sm:text-[9vmax] text-[8vmax]"
          style={{
            WebkitTextStrokeWidth: "3px",
            WebkitTextStrokeColor: "#00aded"
          }}
        >
          {organization}
        </h1>
        <h4 ref={ref2} className="text-[5vmax] text-outline">
          NIT Bhopal
        </h4>
        <p ref={ref3} className="text-[2.5vmax] text-outline-thin">
          Central India's{" "}
          <span className="text-yellow-400 text-[3vmax]">
            Largest Quizzing Club
          </span>
        </p>
      </div>
      <div className="right sm:w-1/3 h-full w-full flex justify-center sm:items-center self-end overflow-y-hidden">
        <img ref={bulbRef} src={bulb} alt="Bulb" />
      </div>
    </Container>
  )
}

export default Hero
