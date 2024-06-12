import { createPortal } from "react-dom"
import { useEffect } from "react"

const Modal = ({ setShowModal = () => {}, children }) => {
  useEffect(() => {
    // This task is performed when this component is mounted
    const body = document.querySelector("body")
    body.style.height = "100vh"
    body.style.overflowY = "hidden"
    return () => {
      // This task is performed when this component is unmounted
      body.style.height = "fit-content"
      body.style.overflowY = "scroll"
    }
  }, [])

  return createPortal(
    <>
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
        className="rounded-lg fixed top-1/2 left-1/2 w-2/3 text-xl font-bold transparent-white p-10 z-10 flex justify-center"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {children}
      </div>
    </>,
    document.querySelector("#modal")
  )
}

export default Modal
