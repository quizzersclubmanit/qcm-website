import { Container, SectionHead } from "./components"
import { team } from "../assets/qcmData.json"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

const Gallery = () => {
  const galleryRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  useGSAP(() => {
    const frames = galleryRef.current.querySelectorAll(".frame")
    const totalScrollWidth =
      galleryRef.current.scrollWidth - galleryRef.current.clientWidth
    gsap.to(frames, {
      transform: `translateX(${-totalScrollWidth}px)`,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#gallery",
        scroller: "body",
        start: "top 0",
        end: `+=${galleryRef.current.clientWidth}`,
        scrub: 5,
        pin: true,
        pinSpacing: true
      }
    })
  }, [])

  return (
    <Container
      id="gallery"
      className="h-screen flex flex-col md:justify-between justify-center text-white bg-black"
    >
      <SectionHead
        label="Team"
        className="londrina-solid-regular sm:ml-[3vmax] h-[20%] self-center sm:self-start"
      />
      <div ref={galleryRef} className="flex h-[80%] shrink-0 sm:gap-0 gap-2">
        {team.map((obj, index) => (
          <div
            key={index}
            className="frame relative flex flex-col justify-center shrink-0 sm:w-[60vw] md:w-[40vw] w-full overflow-x-hidden"
            onMouseOver={() => {
              setHoveredIndex(index)
            }}
            onClick={() => {
              if (!hoveredIndex || hoveredIndex != index) setHoveredIndex(index)
              else setHoveredIndex(null)
            }}
            onMouseLeave={() => {
              setHoveredIndex(null)
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 sm:w-4/5 w-full"
              style={{
                borderRadius: "50%",
                transform: "translate(-50%,-50%)"
              }}
            >
              <img
                src={obj.picture}
                alt="Member"
                className="w-full aspect-square"
              />
            </div>
            <div
              className={`flex flex-col pl-4 backdrop-blur-sm bg-[#00000060] justify-center items-center transition-all ${hoveredIndex == index ? "opacity-100" : "opacity-0"}`}
            >
              <span className="text-xl cursor-default">{obj.member}</span>
              <span className="text-lg cursor-default font-bold">
                {obj.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default Gallery
