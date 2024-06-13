import { Container, Banner, Social, Contact } from "./components"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const Footer = () => {
  const bannerRef = useRef(null)
  const { contextSafe } = useGSAP()

  const animateBanner = contextSafe((scroll) => {
    const divs = bannerRef.current?.querySelectorAll("div")
    const imgs = bannerRef.current?.querySelectorAll("div img")
    if (scroll > 0) {
      gsap.to(divs, {
        transform: "translateX(0%)",
        ease: "none",
        duration: 4,
        repeat: -1
      })

      gsap.to(imgs, {
        rotate: 0
      })
    } else {
      gsap.to(divs, {
        transform: "translateX(-200%)",
        ease: "none",
        duration: 4,
        repeat: -1
      })

      gsap.to(imgs, {
        rotate: 180
      })
    }
  })

  window.addEventListener("wheel", (e) => {
    animateBanner(e.deltaY)
  })

  return (
    <Container
      element="footer"
      className="londrina-solid-regular sm:px-[3.5vmax] px-[2vmax] sm:pb-[3.5vmax] pb-[2vmax] sm:h-screen h-[75vh] flex flex-col gap-5 items-center justify-between bg-black text-white"
    >
      <Banner ref={bannerRef} />
      <Contact />
      <Social />
    </Container>
  )
}

export default Footer
