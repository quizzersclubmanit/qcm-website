import { Container, Button } from "./components"
import { FaPlus, FaMinus } from "react-icons/fa6"
import { useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

const Accordion = ({ qna = [] }) => {
  const [openAccordions, setOpenAccordions] = useState([])
  const { contextSafe } = useGSAP()
  const ref = useRef(null)

  const showAnswer = contextSafe((id) => {
    gsap.to(ref.current.querySelector(`#id_${id}`), {
      height: "10vh",
      opacity: 1,
      duration: 0.2,
      borderLeft: "1px solid gray",
      borderBottom: "1px solid gray",
      borderRight: "1px solid gray"
    })
  })
  const hideAnswer = contextSafe((id) => {
    gsap.to(ref.current.querySelector(`#id_${id}`), {
      height: 0,
      opacity: 0,
      duration: 0.1
    })
  })

  return (
    <Container className="w-3/4 mx-auto" ref={ref}>
      {qna.map((obj, index) => (
        <div
          className="mb-3"
          key={index}
          onClick={() => {
            if (openAccordions.includes(index)) {
              setOpenAccordions((prev) => prev.filter((id) => id != index))
              hideAnswer(index)
            } else {
              setOpenAccordions((prev) => [...prev, index])
              showAnswer(index)
            }
          }}
        >
          <Button className="flex justify-between items-center w-full p-4 text-left ease-in sm:text-base text-lg border border-black">
            <span>{obj.question} ?</span>
            {openAccordions.includes(index) ? <FaMinus /> : <FaPlus />}
          </Button>
          <div
            id={`id_${index}`}
            className={`h-0 opacity-0 overflow-hidden transition-all duration-300 ease-in-out flex items-center`}
          >
            <p className="px-4 sm:text-sm leading-normal text-slate-700">
              {obj.answer}
            </p>
          </div>
        </div>
      ))}
    </Container>
  )
}

export default Accordion
