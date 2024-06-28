import { Container, Nav, Modal, Logo } from "./components"
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

  useGSAP(() => {
    gsap
      .timeline()
      .from(logoRef.current, {
        x: "-100%",
        ease: "power1.in",
        duration: 0.7,
        opacity: 0
      })
      .from(navRef.current, {
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
        backgroundColor: "#000000a6",
        ease: "power2"
      })
  }, [])

  return (
    <Container
      element="header"
      className="w-screen md:p-[3.5vmax] p-[2vmax] fixed z-10"
    >
      <div
        ref={headRef}
        className="flex py-1 justify-around items-center rounded-2xl overflow-y-hidden"
      >
        <Logo ref={logoRef} className="w-[7vmax] md:w-[5vmax]" />
        <Nav ref={navRef} className="hidden md:flex" />
        <RxHamburgerMenu
          className="block md:hidden text-2xl text-white cursor-pointer"
          onClick={() => {
            setShowTabModal((prev) => !prev)
          }}
        />
        {showTabModal && (
          <Modal setShowModal={setShowTabModal}>
            <Nav
              offModal={() => {
                setShowTabModal(false)
              }}
            />
          </Modal>
        )}
      </div>
    </Container>
  )
}

export default Header
