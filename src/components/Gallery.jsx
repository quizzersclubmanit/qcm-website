import { Container, SectionHead } from "./components"
import { team } from "../assets/qcmData.json"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

const Gallery = () => {
  const galleryRef = useRef(null)

  useGSAP(() => {
    const frames = galleryRef.current.querySelectorAll(".frame")
    const totalScrollWidth =
      galleryRef.current.scrollWidth - galleryRef.current.clientWidth
    console.log(totalScrollWidth)
    gsap.to(frames, {
      transform: `translateX(${-totalScrollWidth}px)`,
      ease: "none",
      scrollTrigger: {
        trigger: "#gallery",
        scroller: "body",
        start: "top top",
        end: `+=${galleryRef.current.clientWidth}`,
        scrub: 4,
        pin: true,
        pinSpacing: true
      }
    })
  }, [])

  return (
    <Container
      id="gallery"
      className="h-screen flex flex-col justify-between text-white bg-black"
    >
      <SectionHead
        label="Team"
        className="londrina-solid-regular ml-[3vmax] h-[30%]"
      />
      <div ref={galleryRef} className="flex gap-1 h-[70%] shrink-0">
        {team.map((obj, index) => (
          <div
            key={index}
            className="frame relative flex flex-col justify-end shrink-0 w-[33vw]"
          >
            <div className="absolute top-0 left-0 w-full h-full flex items-end">
              <img
                src={obj.picture}
                alt="Member"
                className="w-full aspect-square"
              />
            </div>
            <div className="flex flex-col pl-4 backdrop-blur-sm bg-[#00000060] opacity-0 hover:opacity-100 transition-all">
              <span className="text-[4vmax] cursor-default">{obj.member}</span>
              <span className="text-[3vmax] cursor-default font-bold">
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
