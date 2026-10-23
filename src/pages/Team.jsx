import { FaLinkedin } from "react-icons/fa6"
import { useState, useMemo, useRef, useEffect } from "react"
import { Container, SectionHead, Footer, Header } from "../components/components"
import SEO from "../components/SEO.jsx"
import { team } from "../assets/qcmData.json"
import gsap from "gsap"
import {
  Sparkles,
  Users,
  Search,
  Award,
  ExternalLink,
  ShieldCheck,
} from "lucide-react"

const Team = () => {
  const [selectedYear, setSelectedYear] = useState("4th")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("All")
  const gridRef = useRef(null)

  const fourthYearCount = useMemo(
    () => team.filter((m) => m.year === "4th").length,
    []
  )
  const thirdYearCount = useMemo(
    () => team.filter((m) => m.year === "3rd").length,
    []
  )

  const availableDomains = useMemo(() => {
    const list = team
      .filter((m) => m.year === selectedYear)
      .map((m) => m.domain)
      .filter(Boolean)
    return ["All", ...Array.from(new Set(list))]
  }, [selectedYear])

  const filteredMembers = useMemo(() => {
    return team.filter((member) => {
      if (member.year !== selectedYear) return false
      if (
        selectedDomain !== "All" &&
        member.domain?.toLowerCase() !== selectedDomain.toLowerCase()
      ) {
        return false
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = member.name?.toLowerCase().includes(query)
        const matchPost = member.post?.toLowerCase().includes(query)
        const matchDomain = member.domain?.toLowerCase().includes(query)
        return matchName || matchPost || matchDomain
      }
      return true
    })
  }, [selectedYear, selectedDomain, searchQuery])

  // GSAP Stagger Entrance on filter/tab change
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll(".team-card")
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 24, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.04,
        ease: "power2.out",
      }
    )
  }, [selectedYear, selectedDomain, searchQuery])

  return (
    <div
      id="main"
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundColor: "#0d2820",
        backgroundImage:
          "radial-gradient(circle at 50% 10%, #1f5f4f 0%, #0d2820 55%, #081a15 100%)",
      }}
    >
      <SEO
        title="Meet the Team | Quizzers' Club NIT Bhopal (QCM MANIT)"
        description="Meet the coordinators and executive members of Quizzers' Club NIT Bhopal (QCM MANIT) — the leaders behind QBIT, college quizzes and events."
        path="/team"
        crumbs={[{ name: "Team", item: "https://www.quizzersclub.com/team" }]}
      />

      <Header />

      <Container
        id="team-gallery"
        className="flex flex-col gap-6 items-center min-h-screen pb-16 px-4 sm:px-6 lg:px-8 pt-24 md:pt-[15vh] max-w-7xl mx-auto"
      >
        {/* Hero Tagline */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>The Minds Behind Quizzers&apos; Club MANIT</span>
          </span>

          <h1 className="poppins-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Meet the Team
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
            Passionate quizzers, coordinators, and creators orchestrating Central
            India&apos;s largest quizzing community and premier inter-collegiate
            events.
          </p>
        </div>

        {/* Year Segment Switcher */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-full border border-white/10 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setSelectedYear("4th")
              setSelectedDomain("All")
            }}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              selectedYear === "4th"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/50 scale-[1.02]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Final Year (4th Year)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                selectedYear === "4th"
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-gray-400"
              }`}
            >
              {fourthYearCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedYear("3rd")
              setSelectedDomain("All")
            }}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              selectedYear === "3rd"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/50 scale-[1.02]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Pre-Final Year (3rd Year)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                selectedYear === "3rd"
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-gray-400"
              }`}
            >
              {thirdYearCount}
            </span>
          </button>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member or role..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white/[0.08] border border-white/15 focus:border-amber-400/80 focus:bg-white/[0.12] text-white placeholder-gray-400 focus:outline-none transition-all"
            />
          </div>

          {/* Domain Pills (Horizontal scroll on mobile) */}
          <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-1.5 py-1">
            {availableDomains.map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => setSelectedDomain(dom)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDomain === dom
                    ? "bg-amber-400 text-slate-950 font-semibold shadow-sm"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Members Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full mt-2"
        >
          {filteredMembers.map((member, index) => {
            const isLeader =
              member.post?.toLowerCase().includes("president") ||
              member.post?.toLowerCase().includes("lead")

            return (
              <div
                key={`${member.name}-${index}`}
                className="team-card group relative flex flex-col justify-between bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-amber-400/60 rounded-2xl p-5 backdrop-blur-md shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Portrait Avatar Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900/80 border border-white/15 mb-4 group-hover:border-amber-400/40 transition-colors">
                    <img
                      src={member.fileId || "/placeholder-avatar.png"}
                      alt={`${member.name || "QCM member"} — Quizzers' Club NIT Bhopal`}
                      className="h-full w-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/placeholder-avatar.png"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

                    {/* Role Chip Overlay */}
                    {isLeader && (
                      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Core Leadership</span>
                      </span>
                    )}
                  </div>

                  {/* Member Name */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {member.name}
                    </h2>
                  </div>

                  {/* Post / Role */}
                  <p className="mt-1 text-xs font-semibold text-amber-400 tracking-wide uppercase">
                    {member.post || "Team Coordinator"}
                  </p>

                  {/* Domain Chip */}
                  {member.domain && (
                    <p className="mt-1 text-xs text-emerald-300/80 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      <span>{member.domain}</span>
                    </p>
                  )}
                </div>

                {/* Footer with LinkedIn */}
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    NIT Bhopal &apos;{selectedYear === "4th" ? "26" : "27"}
                  </span>

                  {member.linkedIn ? (
                    <a
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 hover:border-blue-400 shadow-sm transition-all duration-200"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <FaLinkedin className="w-3.5 h-3.5" />
                      <span>Connect</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-500">QCM MANIT</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="py-16 text-center text-gray-300">
            <Users className="w-12 h-12 mx-auto text-gray-500 mb-3" />
            <p className="text-base font-medium">No team members found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search query or selecting &quot;All&quot;
              domains.
            </p>
          </div>
        )}
      </Container>

      <Footer />
    </div>
  )
}

export default Team
