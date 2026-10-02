import { Container, Nav, MobileDrawer, Logo } from "./components"
import { RxHamburgerMenu } from "react-icons/rx"
import { useState, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const Header = () => {
  const [showTabModal, setShowTabModal] = useState(false)
  const headRef = useRef(null)
  const logoRef = useRef(null)
  const navRef = useRef(null)
  const toggleModal = () => {
    setShowTabModal((prev) => !prev)
  }

  useGSAP(() => {
    gsap.from(navRef.current, {
      opacity: 0,
      y: "-100%",
      duration: 1,
      ease: "back.out"
    })

    gsap
      .timeline({
        scrollTrigger: {
          start: "top 0",
          scroller: "body",
          trigger: headRef.current,
          scrub: 1
        }
      })
      .to(navRef.current.querySelectorAll(".tabs-bar"), {
        backgroundColor: "transparent",
        ease: "power2"
      })
      .to(headRef.current, {
        backgroundColor: "#000000a2",
        ease: "power2"
      })
  }, [])

  return (
    <Container
      element="header"
      className="w-screen fixed top-0 left-0 z-10 flex justify-center"
    >
      <div
        ref={headRef}
        className="flex sm:justify-around justify-between items-center rounded-3xl overflow-y-hidden lg:w-[75vw] w-[90vw] px-8 mt-3"
        style={{ borderRadius: "3rem" }}
      >
        <Logo
          ref={logoRef}
          className="block md:hidden md:w-[3vmax] w-[5vmax] "
        />

        <Nav ref={navRef} className="hidden md:flex" />
        <RxHamburgerMenu
          className="block md:hidden text-xl text-white cursor-pointer"
          onClick={toggleModal}
        />
        <MobileDrawer
          open={showTabModal}
          onClose={() => setShowTabModal(false)}
        />
      </div>
    </Container>
  )
}

export default Header
