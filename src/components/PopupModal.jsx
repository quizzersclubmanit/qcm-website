import { createPortal } from "react-dom"
import { useEffect,useState } from "react"
import { Container } from "./components"
import { poster } from "../assets/assets"
import { Button} from "./components"
import { useNavigate } from "react-router-dom"
import { FaWhatsapp } from 'react-icons/fa'


const Modal = ({ setShowModal = () => { } }) => {
  const navigate = useNavigate()
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
        className="h-screen w-screen transparent-black z-10 fixed top-0 left-0"
        style={{
          backdropFilter: "blur(8.8px)",
          WebkitBackdropFilter: "blur(8.8px)"
        }}
        onClick={() => {
          setShowModal(false)
        }}
      ></div>

      <div
        className="rounded-lg fixed top-1/2 left-1/2 w-[90%] sm:w-auto sm:h-[100%] text-xl font-bold bg-transparent py-14 z-10 flex flex-col justify-center items-center"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <button
          onClick={() => setShowModal(false)}
          className="self-end overflow-y-hidden text-white text-3xl font-bold shadow-black"
          aria-label="Close"
        >
          &times;
        </button>
        <img src={poster} className="object-contain w-full h-full" alt="" />
        
        <div className="w-full flex flex-row justify-center overflow-y-hidden mt-2">

          <Button
            label="Register for IQC"
            className="bg-green-950 poppins-regular ml-2vmax py-2 px-5 text-sm text-white rounded-3xl border-2 overflow-y-hidden"
            onClick={() => {
              setShowModal(false)
              navigate("register")
            }}
          />
          <a
            className="h-auto flex justify-center items-center"
            href="https://whatsapp.com/channel/0029Vaj1E2e7DAWvNkgDhy2O"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="bg-green-500 p-1 ml-4 rounded-full inline-block  border-white">
              <FaWhatsapp size={25} color="white" />
            </div>
            
          </a>
        </div>
        
      </div>
    </Container>,
    document.querySelector("#modal")
  )
}

export default Modal
