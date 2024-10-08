import { bulb, gradientLogo, floatingMarks } from "../assets/assets"
import { organization } from "../assets/qcmData.json"
import { Container } from "./components"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

const Hero = () => {
  const ref0 = useRef(null)
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  const bulbRef = useRef(null)
  const organizationNameList = organization.split(" ")

  useGSAP(() => {
    gsap
      .timeline()
      .to(ref0.current.children, {
        opacity: 1,
        delay: 1,
        transform: "translateY(0)",
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out"
      })
      .to(ref1.current.children, {
        opacity: 1,
        delay: 0.1,
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
        y: "-10%",
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
      className="poppins-bold h-screen flex flex-col-reverse sm:flex-row items-center justify-evenly relative"
    >
      <div className="background-img"></div>
      <div className="left w-full h-full flex flex-col justify-center items-start sm:px-16 px-10 text-white gap-0">
        <div className="organization-name flex flex-row flex-wrap">
          <div ref={ref0} className="overflow-y-hidden leading-none">
            {organizationNameList[0].split("").map((char, index) => (
              <span
                key={index}
                className="sm:text-[5vmax] text-[12vmin] inline-block opacity-0 overflow-y-hidden "
                style={{
                  fontWeight: 700,
                  transform: "translateY(50%)"
                }}
              >
                {char.toUpperCase()}
              </span>
            ))}
          </div>
          <div ref={ref1} className="overflow-y-hidden leading-none">
            {organizationNameList[1].split("").map((char, index) => (
              <span
                key={index}
                className="sm:text-[5vmax] text-[12vmin] inline-block opacity-0 overflow-y-hidden "
                style={{
                  fontWeight: 700,
                  transform: "translateY(50%)"
                }}
              >
                {char.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        <h4 ref={ref2} className="text-[5vmax] overflow-y-hidden leading-none">
          NIT BHOPAL
        </h4>
        <p
          ref={ref3}
          className="md:text-[2vmax] text-[3vmax] overflow-y-hidden"
        >
          Central India's{" "}
          <span className="text-[#fe9c02] md:inline block">
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
