import { createPortal } from "react-dom"
import { useEffect } from "react"
import { Container } from "./components"

const Modal = ({ setShowModal = () => {}, children }) => {
  useEffect(() => {
    const body = document.querySelector("body")
    body.style.overflowY = "hidden"
    return () => {
      body.style.overflowY = "scroll"
    }
  }, [])

  return createPortal(
    <Container>
      <div
        className="h-screen w-screen transparent-black fixed top-0 left-0"
        style={{
          backdropFilter: "blur(8.8px)",
          WebkitBackdropFilter: "blur(8.8px)"
        }}
        onClick={() => {
          setShowModal(false)
        }}
      ></div>

      <div
        className="rounded-lg fixed top-1/2 left-1/2 sm:w-2/3 w-[90%] text-xl font-bold transparent-white py-8 z-10 flex justify-center"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {children}
      </div>
    </Container>,
    document.querySelector("#modal")
  )
}

export default Modal
