import { bulb, gradientLogo, floatingMarks } from "../assets/assets"
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
        delay: 1,
        transform: "translateY(0)",
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out"
      })
      .from(ref2.current, {
        opacity: 0,
        x: "-200%"
      })
      .from(ref3.current, {
        opacity: 0,
        x: "-200%"
      })
      .from(bulbRef.current, {
        x: "100%",
        opacity: 0
      })
      .to(bulbRef.current, {
        transform: "translateY(-1%)",
        opacity: 0.8,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "expoScale(0.5,7,none)"
      })
  }, [])

  return (
    <Container
      id="hero"
      className="Fira Sans h-screen flex flex-col-reverse sm:flex-row items-center justify-evenly relative"
    >
      <div className="background-img"></div>
      <div className="left w-full h-full flex flex-col justify-center items-start px-16 text-white gap-0">
        <div ref={ref1} className="overflow-y-hidden leading-none">
          {organization.split("").map((char, index) => (
            <span
              key={index}
              className="Fira Sans sm:text-[5vmax] text-[12vmin] inline-block opacity-0 overflow-y-hidden "
              style={{
                fontWeight: 700,
                transform: "translateY(50%)"
              }}
            >
              {char.toUpperCase()}
            </span>
          ))}
        </div>
        <h4
          ref={ref2}
          className="Fira Sans text-[5vmax] font-bold overflow-y-hidden leading-none"
        >
          NIT BHOPAL
        </h4>
        <p ref={ref3} className="text-[2.0vmax] overflow-y-hidden">
          Central India's{" "}
          <span className="" style={{ color: "#fe9c02" }}>
            Largest Quizzing Club
          </span>
        </p>
      </div>
      <div className="flex right h-full w-full justify-center sm:items-center mt-20 self-end overflow-y-hidden">
        <img
          src={gradientLogo}
          alt="gradientLogo"
          className="pt-[36px] scale-90 object-contain z-1"
        />
        <img
          ref={bulbRef}
          src={bulb}
          alt="Bulb"
          className="h-1/3 sm:h-fit absolute md:bottom-0 top-48 md:top-auto md:p-0 z-5"
        />
      </div>

      <img
        src={floatingMarks}
        alt=""
        className="hidden scale-90 md:block absolute left-14 top-14 h-[calc(100vh-40px)] object-cover  z-0"
      />
    </Container>
  )
}

export default Hero
