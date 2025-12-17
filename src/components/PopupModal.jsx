import { createPortal } from "react-dom"
import { useEffect } from "react"
import { Container } from "./components"
import { poster } from "../assets/assets"
import { Button } from "./components"
import { useNavigate } from "react-router-dom"
import { FaWhatsapp } from "react-icons/fa"
import { useSelector } from "react-redux"

const Modal = ({ setShowModal = () => {} }) => {
  const { data } = useSelector((state) => state.user)
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
        <p className="text-yellow-400 font-bold overflow-y-hidden py-3">
          Test Duration: 45 minutes
        </p>

        <div className="w-full flex flex-row justify-center overflow-y-hidden mt-2">
          {Object.keys(data).length == 0 ? (
            <Button
              label="Login to Play Quiz"
              className="bg-green-950 poppins-regular ml-2vmax py-2 px-5 text-sm text-white rounded-3xl border-2 overflow-y-hidden"
              onClick={() => {
                setShowModal(false)
                navigate("login")
              }}
            />
          ) : (
            <Button
              label="Play Quiz"
              className="bg-green-950 poppins-regular ml-2vmax py-2 px-5 text-sm text-white rounded-3xl border-2 overflow-y-hidden"
              onClick={() => {
                setShowModal(false)
                navigate("/quiz/instr/0")
              }}
            />
          )}
          <a
            className="h-auto flex justify-center items-center py-3 overflow-y-hidden"
            href="https://whatsapp.com/channel/0029Vaj1E2e7DAWvNkgDhy2O"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="bg-green-500 p-1 ml-4 rounded-full inline-block border-white">
              <FaWhatsapp size={25} color="white" />
            </div>
          </a>
        </div>
        {/* <a
          className="text-xs text-yellow-400 underline text-left cursor-pointer w-fit overflow-y-hidden mt-3"
          href="https://drive.google.com/file/d/1fDRrSJycHoWlM-ZH6m_JbdgeDR0aIswT/view?usp=sharing"
          target="_blank"
        >
          Download IQC Sample Preparation Booklet
        </a> */}
      </div>
    </Container>,
    document.querySelector("#modal")
  )
}

export default Modal
