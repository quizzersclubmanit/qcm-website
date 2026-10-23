import { useState, useMemo } from "react"
import { Container, Accordion, Header, Footer } from "./components"
import SEO from "./SEO.jsx"
import { qna } from "../assets/qcmData.json"
import { HelpCircle, Search, Mail, MessageSquare, Sparkles } from "lucide-react"

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredQna = useMemo(() => {
    if (!searchQuery.trim()) return qna
    const q = searchQuery.toLowerCase().trim()
    return qna.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    )
  }, [searchQuery])

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
    <div
      id="main"
      className="min-h-screen text-white relative"
      style={{
        backgroundColor: "#0d222e",
        backgroundImage:
          "radial-gradient(circle at 50% 15%, #184b64 0%, #0d222e 60%, #081720 100%)",
      }}
    >
      <SEO
        title="FAQs | Quizzers' Club NIT Bhopal (QCM MANIT)"
        description="FAQs about Quizzers' Club NIT Bhopal (QCM MANIT) — joining, QBIT, IQC and college quiz events in Bhopal."
        path="/faqs"
        schema={faqSchema}
        crumbs={[{ name: "FAQs", item: "https://www.quizzersclub.com/faqs" }]}
      />

      <Header />

      <Container
        id="faq-content"
        className="flex flex-col gap-8 items-center min-h-screen pb-16 px-4 sm:px-6 lg:px-8 pt-24 md:pt-[15vh] max-w-4xl mx-auto"
      >
        {/* Header Block */}
        <div className="flex flex-col items-center text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Knowledge Base</span>
          </span>

          <h1 className="poppins-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Everything you need to know about Quizzers&apos; Club MANIT, IQC,
            membership, annual recruitment, and competitions.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. IQC, joining, contact)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.14] border border-white/15 focus:border-amber-400/80 text-white placeholder-gray-400 focus:outline-none transition-all shadow-lg text-sm"
          />
        </div>

        {/* Accordion Component */}
        <div className="w-full">
          {filteredQna.length > 0 ? (
            <Accordion qna={filteredQna} />
          ) : (
            <div className="py-12 text-center text-gray-300">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-500 mb-3" />
              <p className="text-base font-semibold">No matching questions found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching with different keywords or contact our team directly below.
              </p>
            </div>
          )}
        </div>

        {/* Contact Support Help Banner */}
        <div className="w-full mt-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-center sm:text-left">
            <h2 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Still have queries?</span>
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              Our coordinators are available on WhatsApp and email to assist you.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:quizzersclubmanit@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-300" />
              <span>Email Us</span>
            </a>
            <a
              href="https://wa.me/918602012570?text=Hi%2C%20I%20have%20a%20query%20regarding%20QCM%20events."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Official</span>
            </a>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  )
}

export default FAQs
