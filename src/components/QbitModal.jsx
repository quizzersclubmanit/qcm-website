import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaTimes, FaArrowRight } from "react-icons/fa"
import confetti from "canvas-confetti"
import { poster } from "../assets/assets"

const QbitModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("qbit_modal_seen")
      if (!seen) {
        const timer = setTimeout(() => {
          setIsOpen(true)
          // Fire subtle golden celebration confetti when modal opens
          try {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.6 },
              colors: ["#fe9c02", "#fca311", "#ffffff", "#2b7966"],
              disableForReducedMotion: true,
            })
          } catch {
            // Ignore confetti errors
          }
        }, 900)
        return () => clearTimeout(timer)
      }
    } catch {
      // Ignore storage errors in private mode
    }
  }, [])

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [isOpen])

  const close = () => {
    setIsOpen(false)
    try {
      sessionStorage.setItem("qbit_modal_seen", "true")
    } catch {
      // Ignore
    }
  }

  const handleRegister = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#fe9c02", "#fca311", "#ffffff"],
      })
    } catch {
      // Ignore
    }
    setTimeout(() => {
      close()
      navigate("/signup")
    }, 250)
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qbit-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Dark Frosted Scrim */}
      <div
        onClick={close}
        aria-hidden="true"
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c1e28] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-white overflow-hidden flex flex-col md:flex-row z-10 transition-all">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={close}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition-colors focus:outline-none"
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Poster Artwork Side */}
        <div className="w-full md:w-5/12 bg-[#08151c] relative flex items-center justify-center overflow-hidden">
          <img
            src={poster}
            alt="Q-BIT '26 Official Poster — Quizzers' Club MANIT"
            className="w-full h-48 md:h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e28] via-transparent to-transparent md:hidden" />
        </div>

        {/* Content Side */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#fe9c02] inline-block" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#fe9c02]">
                Registrations Now Live
              </span>
            </div>

            <h2 id="qbit-modal-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Q-BIT &apos;26
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
              Central India&apos;s Premier Collegiate Quiz Championship
            </p>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Assemble your 4-member team to compete against the sharpest
              quizzing minds from top colleges nationwide, hosted live at MANIT
              Bhopal.
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Team Format:</span>
                <span className="font-semibold text-white">4 Members / Team</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Eligibility:</span>
                <span className="font-semibold text-white">College Students Pan-India</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Venue:</span>
                <span className="font-semibold text-white">MANIT Bhopal Campus</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider text-[#0c1e28] bg-[#fe9c02] hover:bg-amber-400 shadow-md shadow-[#fe9c02]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Register Your Team</span>
              <FaArrowRight className="text-xs" />
            </button>

            <button
              type="button"
              onClick={close}
              className="py-1.5 text-xs text-center text-slate-400 hover:text-white transition-colors"
            >
              Maybe later &bull; Explore website
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QbitModal
