import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaTimes, FaUsers, FaUniversity, FaTrophy, FaArrowRight } from "react-icons/fa"
import { poster } from "../assets/assets"

const QbitModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Only open if not already dismissed in this session
    try {
      const seen = sessionStorage.getItem("qbit_modal_seen")
      if (!seen) {
        const timer = setTimeout(() => {
          setIsOpen(true)
        }, 800)
        return () => clearTimeout(timer)
      }
    } catch {
      // Ignore storage errors in private browsing
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
    close()
    navigate("/signup")
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qbit-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Scrim Overlay */}
      <div
        onClick={close}
        aria-hidden="true"
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d222e] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close X Button */}
        <button
          type="button"
          onClick={close}
          aria-label="Close dialog"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors focus:outline-none"
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#fe9c02]/20 text-[#fe9c02] border border-[#fe9c02]/40 mb-3">
          <span>⚡ Registrations Open</span>
        </div>

        {/* Title & Subtitle */}
        <h2 id="qbit-modal-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Q-BIT &apos;26 is Here!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-md">
          Central India&apos;s premier collegiate quiz championship organized by
          Quizzers&apos; Club, MANIT Bhopal.
        </p>

        {/* Key Feature Chips */}
        <div className="grid grid-cols-3 gap-2.5 w-full my-5 text-left">
          <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex flex-col items-center text-center">
            <FaUsers className="text-[#fe9c02] text-lg mb-1" />
            <span className="text-[11px] font-bold text-white">4 Members</span>
            <span className="text-[10px] text-slate-400">Team Size</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex flex-col items-center text-center">
            <FaUniversity className="text-[#fe9c02] text-lg mb-1" />
            <span className="text-[11px] font-bold text-white">MANIT Bhopal</span>
            <span className="text-[10px] text-slate-400">Campus Venue</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex flex-col items-center text-center">
            <FaTrophy className="text-[#fe9c02] text-lg mb-1" />
            <span className="text-[11px] font-bold text-white">National</span>
            <span className="text-[10px] text-slate-400">Merit Awards</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleRegister}
            className="btn-shimmer w-full py-3 px-6 rounded-full font-bold text-sm bg-gradient-to-r from-amber-400 via-[#fe9c02] to-amber-500 text-[#0d222e] shadow-lg shadow-[#fe9c02]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Register Your Team Now</span>
            <FaArrowRight className="text-xs" />
          </button>

          <button
            type="button"
            onClick={close}
            className="py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Maybe later &bull; Explore website
          </button>
        </div>
      </div>
    </div>
  )
}

export default QbitModal
