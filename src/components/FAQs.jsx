import { useState, useMemo } from "react"
import { Container, Accordion, Header, Footer } from "./components"
import SEO from "./SEO.jsx"
import { qna } from "../assets/qcmData.json"
import { Search, Mail, Phone } from "lucide-react"

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
      id="faq-page"
      className="min-h-screen text-white relative flex flex-col justify-between overflow-x-clip"
      style={{
        backgroundColor: "#0c1e28",
        backgroundImage: "linear-gradient(180deg, #091822 0%, #0c202b 30%, #0e2634 70%, #0a1922 100%)",
      }}
    >
      {/* Subtle Ambient Constellation Grid Matrix */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(254, 156, 2, 0.25) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 25%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 25%, #000 40%, transparent 100%)"
        }}
        aria-hidden="true"
      />

      <SEO
        title="FAQs | Quizzers' Club NIT Bhopal (QCM MANIT)"
        description="FAQs about Quizzers' Club NIT Bhopal (QCM MANIT) — joining, QBIT, IQC and college quiz events in Bhopal."
        path="/faqs"
        schema={faqSchema}
        crumbs={[{ name: "FAQs", item: "https://www.quizzersclub.com/faqs" }]}
      />

      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 flex flex-col items-center gap-8">
        {/* Title Block */}
        <div className="flex flex-col items-center text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold text-[#fe9c02] tracking-wider uppercase">
            Help &amp; Information
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
            Answers to common questions about joining Quizzers&apos; Club MANIT,
            our competitions, and event formats.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. IQC, joining, contact)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c1e28]/70 border border-white/15 focus:border-[#fe9c02] text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none transition-all shadow-md"
          />
        </div>

        {/* Accordion Component */}
        <div className="w-full">
          {filteredQna.length > 0 ? (
            <Accordion qna={filteredQna} />
          ) : (
            <div className="py-12 text-center text-slate-300">
              <p className="text-sm">No matching questions found for &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Contact Help Box */}
        <div className="w-full p-5 sm:p-6 rounded-2xl bg-[#0c1e28]/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white text-center sm:text-left">
              Have further questions?
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 text-center sm:text-left">
              Reach out directly to the club coordinators.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href="mailto:quizzersclubmanit@gmail.com"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-[#fe9c02]" />
              <span>quizzersclubmanit@gmail.com</span>
            </a>
            <a
              href="tel:8602012570"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#fe9c02] text-[#0c1e28] hover:bg-amber-400 font-bold transition-all shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Officials</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default FAQs
