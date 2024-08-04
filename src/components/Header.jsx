import { Container, Nav, Modal,Logo} from "./components"
import { RxHamburgerMenu,RxCross1 } from "react-icons/rx"
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
    setShowTabModal((prev) => !prev);
  };

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
        paddingInline: 12,
        paddingBlock: 4,
        backgroundColor: "#000000a2",
        ease: "power2"
      })
  }, [])

  return (
    <Container
      element="header"
      className="w-screen fixed z-10  flex justify-center"
    >
      <div
        ref={headRef}
        className="w-[90%] h-20 flex m-4 justify-between md:w-[70%] md:justify-center items-center rounded-2xl overflow-y-hidden"
      >
        <Logo
          ref={logoRef}
          className=" block md:hidden md:w-[3vmax] w-[10vmin] "
        />

        <Nav ref={navRef} className="hidden md:flex" />
        {showTabModal ? (
          <RxCross1
            className="block md:hidden w-[15vmin] text-white cursor-pointer"
            onClick={toggleModal}
          />
        ) : (
          <RxHamburgerMenu
            className="block md:hidden w-[15vmin] text-white cursor-pointer"
            onClick={toggleModal}
          />
        )}
        {showTabModal && (
          <Modal setShowModal={setShowTabModal}>
            <Nav
              offModal={() => {
                setShowTabModal(toggleModal)
              }}
            />
          </Modal>
        )}
      </div>
    </Container>
  )
}

export default Header
