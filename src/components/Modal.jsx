import { createPortal } from "react-dom"
import { useEffect } from "react"

const Modal = ({setShowModal=()=>{}, children}) => {
    useEffect(()=>{
        // This task is performed when this component is mounted
        const body = document.querySelector("body")
        body.style.overflowY = "hidden"
        return ()=>{
            // This task is performed when this component is unmounted
            body.style.overflowY = "scroll"
        }
    },[])

	return createPortal(
        <>
            <div className="h-screen w-screen transparent-black fixed top-0 left-0" onClick={()=>{
                setShowModal(false)
            }}></div>

            <div className="rounded-lg fixed top-[30vh] left-1/2 w-2/3 text-xl font-bold transparent-white lg:p-10 p-10" style={{transform: "translate(-50%, -50%)"}}>
                {children}
            </div>
        </>,
        document.querySelector("#modal")
	)
}

export default Modal;
