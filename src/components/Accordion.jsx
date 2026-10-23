import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

const Accordion = ({ qna = [] }) => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="w-full space-y-3">
      {qna.map((obj, index) => {
        const isOpen = openIndex === index

        return (
          <div
            key={index}
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "bg-[#14213D]/90 border-[#FCA311]/50 shadow-lg"
                : "bg-[#14213D]/60 hover:bg-[#14213D]/80 border-white/10"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer focus:outline-none"
            >
              <span className="text-sm sm:text-base font-semibold text-white">
                {obj.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#FCA311] flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              id={`faq-answer-${index}`}
              role="region"
              className={`grid transition-all duration-200 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-white/5">
                  {obj.answer.trim()}
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
