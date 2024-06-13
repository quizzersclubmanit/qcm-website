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
      .to(ref1.current.children, {
        opacity: 1,
        transform: "translateY(0)",
        duration: 1,
        stagger: 0.1,
        ease: "back.out"
      })
      .from(ref2.current, {
        opacity: 0,
        x: "-200%",
        duration: 0.7,
        ease: "back.out"
      })
      .from(ref3.current, {
        opacity: 0,
        x: "-200%",
        duration: 1,
        ease: "back.out"
      })

    gsap.to(bulbRef.current, {
      transform: "translateY(1%)",
      opacity: 0.8,
      duration: 0.7,
      repeat: -1,
      yoyo: true,
      ease: "expoScale(0.5,7,none)"
    })
  }, [])

  return (
    <Container
      id="hero"
      className="londrina-solid-regular h-screen flex flex-col sm:flex-row items-center justify-evenly"
    >
      <div className="left w-full h-full my-[10vh] sm:my-0 sm:w-2/3 flex flex-col justify-center items-center text-white gap-5">
        <div ref={ref1} className="overflow-y-hidden">
          {organization.split("").map((char, index) => (
            <span
              key={index}
              className="sm:text-[9vmax] text-[8vmax] inline-block opacity-0"
              style={{
                WebkitTextStrokeWidth: "3px",
                WebkitTextStrokeColor: "#00aded",
                transform: "translateY(50%)"
              }}
            >
              {char}
            </span>
          ))}
        </div>
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
