import React, { useState } from "react"
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react"

const Accordion = ({ qna = [] }) => {
  const [openIndex, setOpenIndex] = useState(0) // First item open by default

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="w-full space-y-3.5">
      {qna.map((obj, index) => {
        const isOpen = openIndex === index

        // Format bullet points nicely if answer contains bullet symbols
        const hasBullets = obj.answer.includes("•") || obj.answer.includes("\n •")
        let intro = obj.answer
        let bullets = []

        if (hasBullets) {
          const parts = obj.answer.split("•")
          intro = parts[0]
          bullets = parts.slice(1).map((b) => b.trim()).filter(Boolean)
        }

        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "bg-slate-900/90 border-amber-400/60 shadow-xl shadow-amber-500/5 ring-1 ring-amber-400/20"
                : "bg-slate-900/50 hover:bg-slate-900/80 border-white/10 hover:border-white/20"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isOpen
                      ? "bg-amber-400 text-slate-950 font-bold"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-base sm:text-lg font-semibold text-white tracking-tight">
                  {obj.question}
                </span>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10 transition-transform duration-300 ${
                  isOpen ? "rotate-180 bg-amber-400/20 border-amber-400/40 text-amber-300" : "text-gray-400"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Collapsible Content */}
            <div
              id={`faq-answer-${index}`}
              role="region"
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100 pb-5 px-5" : "grid-rows-[0fr] opacity-0 px-5"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-2 border-t border-white/10 text-gray-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p className="whitespace-pre-line">{intro.trim()}</p>

                  {bullets.length > 0 && (
                    <div className="space-y-2.5 mt-3 pl-1">
                      {bullets.map((bullet, bIdx) => {
                        const colonIdx = bullet.indexOf(":")
                        let title = ""
                        let desc = bullet
                        if (colonIdx > 0 && colonIdx < 35) {
                          title = bullet.slice(0, colonIdx)
                          desc = bullet.slice(colonIdx + 1)
                        }

                        return (
                          <div
                            key={bIdx}
                            className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5"
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                            <div className="text-sm">
                              {title && (
                                <span className="font-semibold text-amber-300 block mb-0.5">
                                  {title.trim()}
                                </span>
                              )}
                              <span className="text-gray-300 leading-normal">
                                {desc.trim()}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
