import { useState, useMemo, useRef, useEffect } from "react"
import { Footer, Header } from "../components/components"
import SEO from "../components/SEO.jsx"
import { team } from "../assets/qcmData.json"
import gsap from "gsap"
import { FaLinkedin } from "react-icons/fa6"
import { Search, Sparkles } from "lucide-react"

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

  const { leaders, coordinators } = useMemo(() => {
    const list = team.filter((member) => {
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

    if (searchQuery.trim()) {
      return { leaders: [], coordinators: list }
    }

    const leadersList = list.filter((m) =>
      m.post?.toLowerCase().includes("president")
    )
    const coordsList = list.filter(
      (m) => !m.post?.toLowerCase().includes("president")
    )

    return { leaders: leadersList, coordinators: coordsList }
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
        stagger: 0.025,
        ease: "power2.out",
      }
    )
  }, [selectedYear, searchQuery])

  const renderCard = (member, isLeader = false) => (
    <div
      key={member.name}
      className={`team-card group flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1.5 shadow-xl text-center backdrop-blur-md ${
        isLeader
          ? "bg-[#0c1e28]/95 hover:bg-[#0c1e28] border-2 border-[#fe9c02] shadow-[0_10px_30px_rgba(254,156,2,0.18)]"
          : "bg-[#0c1e28]/70 hover:bg-[#0c1e28]/95 border border-white/10 hover:border-[#fe9c02]/40"
      }`}
    >
      <div>
        {/* Photo Portrait */}
        <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-900/60 border border-white/10 mb-3 relative">
          <img
            src={member.fileId || "/placeholder-avatar.png"}
            alt={`${member.name || "QCM member"} — Quizzers' Club NIT Bhopal`}
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder-avatar.png"
            }}
          />
        </div>

        {/* Name */}
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#fe9c02] transition-colors line-clamp-1">
          {member.name}
        </h3>

        {/* Post */}
        <p
          className={`text-xs font-semibold mt-1 tracking-wide uppercase line-clamp-1 ${
            isLeader ? "text-[#fe9c02]" : "text-[#fe9c02]/90"
          }`}
        >
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
        <div className="mt-3.5 pt-2.5 border-t border-white/10 flex justify-center">
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-[#0A66C2] transition-colors"
            aria-label={`${member.name}'s LinkedIn profile`}
          >
            <FaLinkedin className="w-3.5 h-3.5 text-blue-400 group-hover:text-white transition-colors" />
            <span>Connect</span>
          </a>
        </div>
      )}
    </div>
  )

  return (
    <div
      id="team-page"
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
        title="Meet the Team | Quizzers' Club NIT Bhopal (QCM MANIT)"
        description="Meet the coordinators and executive members of Quizzers' Club NIT Bhopal (QCM MANIT) — the leaders behind QBIT, college quizzes and events."
        path="/team"
        crumbs={[{ name: "Team", item: "https://www.quizzersclub.com/team" }]}
      />

      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-20 flex flex-col items-center gap-10 relative z-10">
        {/* Title Block */}
        <div className="flex flex-col items-center text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#fe9c02]">
            Quizzers&apos; Club MANIT Bhopal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Meet the Team
          </h1>
          <div className="w-12 h-1 bg-[#fe9c02] rounded-full mt-2" />
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg pt-1">
            The student coordinators, quizmasters, and organizers behind Central
            India&apos;s largest quizzing society.
          </p>
        </div>

        {/* Year Toggle Bar & Search */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Year Switcher */}
          <div className="inline-flex bg-[#0c1e28]/80 p-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => setSelectedYear("4th")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedYear === "4th"
                  ? "bg-[#fe9c02] text-[#0c1e28] font-bold shadow-md shadow-[#fe9c02]/25"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <span>4th Year</span>
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${selectedYear === "4th" ? "bg-black/20" : "bg-white/15"}`}>
                {fourthYearCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedYear("3rd")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedYear === "3rd"
                  ? "bg-[#fe9c02] text-[#0c1e28] font-bold shadow-md shadow-[#fe9c02]/25"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <span>3rd Year</span>
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${selectedYear === "3rd" ? "bg-black/20" : "bg-white/15"}`}>
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
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-full bg-[#0c1e28]/70 border border-white/15 focus:border-[#fe9c02] focus:bg-[#0c1e28] text-white placeholder-slate-400 focus:outline-none transition-all shadow-md"
            />
          </div>
        </div>

        {/* Content Area */}
        <div ref={gridRef} className="w-full flex flex-col gap-10">
          {/* Core Leadership Spotlight (when not searching) */}
          {leaders.length > 0 && (
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fe9c02]/15 text-[#fe9c02] border border-[#fe9c02]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Leadership</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-4xl mx-auto">
                {leaders.map((leader) => renderCard(leader, true))}
              </div>
            </div>
          )}

          {/* Coordinators Grid */}
          {coordinators.length > 0 && (
            <div className="flex flex-col gap-4">
              {leaders.length > 0 && (
                <div className="border-t border-white/10 pt-6 text-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                    Team Coordinators
                  </h3>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {coordinators.map((coordinator) => renderCard(coordinator, false))}
              </div>
            </div>
          )}

          {leaders.length === 0 && coordinators.length === 0 && (
            <div className="py-12 text-center text-slate-300">
              <p className="text-sm">No members found matching &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Team
