import { Container, Accordion } from "./components"
import { qna } from "../assets/qcmData.json"

const FAQs = () => {
  return (
    <>
      <hr />
      <Container className="flex flex-col py-10 gap-4">
        <h3 className="poppins-bold sm:text-[2.5vmax] text-[3vmax] text-center w-full">
          Frequently Asked Questions
        </h3>
        <Accordion qna={qna} />
      </Container>
    </>
  )
}

export default FAQs
