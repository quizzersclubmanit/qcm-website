import { useState, useMemo, useRef, useEffect } from "react"
import { Container, Footer, Header } from "../components/components"
import SEO from "../components/SEO.jsx"
import { team } from "../assets/qcmData.json"
import gsap from "gsap"
import { FaLinkedin } from "react-icons/fa6"
import { Search } from "lucide-react"

const Team = () => {
  const [selectedYear, setSelectedYear] = useState("4th")
  const [searchQuery, setSearchQuery] = useState("")
  const gridRef = useRef(null)

  const fourthYearCount = useMemo(
    () => team.filter((m) => m.year === "4th").length,
    []
  )
  const thirdYearCount = useMemo(
    () => team.filter((m) => m.year === "3rd").length,
    []
  )

  const filteredMembers = useMemo(() => {
    return team.filter((member) => {
      if (member.year !== selectedYear) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = member.name?.toLowerCase().includes(q)
        const matchPost = member.post?.toLowerCase().includes(q)
        const matchDomain = member.domain?.toLowerCase().includes(q)
        return matchName || matchPost || matchDomain
      }
      return true
    })
  }, [selectedYear, searchQuery])

  // GSAP subtle fade/lift on tab switch or search
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll(".team-card")
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: "power2.out",
      }
    )
  }, [selectedYear, searchQuery])

  return (
    <div
      id="team-page"
      className="min-h-screen text-white relative flex flex-col justify-between"
      style={{
        backgroundColor: "#0f3a2e",
        backgroundImage: "linear-gradient(180deg, #0f3a2e 0%, #144638 50%, #0a261e 100%)",
      }}
    >
      <SEO
        title="Meet the Team | Quizzers' Club NIT Bhopal (QCM MANIT)"
        description="Meet the coordinators and executive members of Quizzers' Club NIT Bhopal (QCM MANIT) — the leaders behind QBIT, college quizzes and events."
        path="/team"
        crumbs={[{ name: "Team", item: "https://www.quizzersclub.com/team" }]}
      />

      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-20 flex flex-col items-center gap-8">
        {/* Title Block */}
        <div className="flex flex-col items-center text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold text-[#FCA311] tracking-wider uppercase">
            Quizzers&apos; Club MANIT Bhopal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Meet the Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
            The student coordinators, quizmasters, and organizers behind Central
            India&apos;s largest quizzing society.
          </p>
        </div>

        {/* Year Toggle Bar & Search */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Year Switcher */}
          <div className="inline-flex bg-black/30 p-1 rounded-full border border-white/15">
            <button
              type="button"
              onClick={() => setSelectedYear("4th")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedYear === "4th"
                  ? "bg-[#2b7966] text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <span>4th Year</span>
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                {fourthYearCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedYear("3rd")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedYear === "3rd"
                  ? "bg-[#2b7966] text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <span>3rd Year</span>
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                {thirdYearCount}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coordinator..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-full bg-white/10 border border-white/15 focus:border-[#FCA311] focus:bg-white/15 text-white placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Member Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
        >
          {filteredMembers.map((member, index) => (
            <div
              key={`${member.name}-${index}`}
              className="team-card flex flex-col justify-between bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-[#FCA311]/50 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 shadow-lg text-center"
            >
              <div>
                {/* Photo Portrait */}
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-900/60 border border-white/10 mb-3">
                  <img
                    src={member.fileId || "/placeholder-avatar.png"}
                    alt={`${member.name || "QCM member"} — Quizzers' Club NIT Bhopal`}
                    className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/placeholder-avatar.png"
                    }}
                  />
                </div>

                {/* Name */}
                <h2 className="text-sm sm:text-base font-bold text-white hover:text-[#FCA311] transition-colors line-clamp-1">
                  {member.name}
                </h2>

                {/* Post */}
                <p className="text-xs font-semibold text-[#FCA311] mt-0.5 tracking-wide uppercase line-clamp-1">
                  {member.post || "Coordinator"}
                </p>

                {/* Domain */}
                {member.domain && (
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                    {member.domain}
                  </p>
                )}
              </div>

              {/* LinkedIn Button */}
              {member.linkedIn && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-center">
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-[#0A66C2] transition-colors"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <FaLinkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="py-12 text-center text-slate-300">
            <p className="text-sm">No members found matching &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Team
