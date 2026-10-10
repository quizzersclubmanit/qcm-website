import { Container, Accordion } from "./components"
import SEO from "./SEO.jsx"
import { qna } from "../assets/qcmData.json"

const FAQs = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qna.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <Container
      id="main"
      className="min-h-screen flex flex-col justify-center items-center"
      style={{
        background: 'url("/bg-gradient.webp") no-repeat center center/cover'
      }}
    >
      <SEO
        title="FAQs | Quizzers' Club NIT Bhopal (QCM MANIT)"
        description="FAQs about Quizzers' Club NIT Bhopal (QCM MANIT) — joining, QBIT, IQC and college quiz events in Bhopal."
        path="/faqs"
        schema={faqSchema}
        crumbs={[{ name: "FAQs", item: "https://www.quizzersclub.com/faqs" }]}
      />
      <div className="flex flex-col gap-4 bg-white py-4 rounded sm:w-3/4 w-11/12">
        <h1 className="poppins-bold sm:text-[2.5vmax] text-[3vmax] text-center">
          Frequently Asked Questions — Quizzers&apos; Club NIT Bhopal
        </h1>
        <Accordion qna={qna} />
      </div>
    </Container>
  )
}

export default FAQs
