import "./pages.css"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Container, Header, Footer } from "../components/components"
import SEO from "../components/SEO.jsx"
import { avifSrcSet, webpSrcSet } from "../utils/img.js"
import { eventDetails } from "../assets/qcmData.json"
import SliderModule from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useState, useRef } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Sparkles,
  Trophy,
  Compass,
  MapPin,
  Users,
  Award,
  Layers,
  FileText,
  Calendar,
  ChevronRight,
  CheckCircle2,
} from "lucide-react"

const Slider = (SliderModule && SliderModule.default) || SliderModule

// Specialized metadata per event
const EVENT_ENRICHMENT = {
  iqc: {
    badge: "Flagship School Competition",
    tagline: "Madhya Pradesh's Premier Inter-City School Quiz",
    icon: Trophy,
    stats: [
      { label: "Participating Cities", val: "5 Major Cities", sub: "Bhopal, Indore, Jabalpur, Gwalior, Ujjain" },
      { label: "Target Audience", val: "Classes 8th–12th", sub: "Top regional institutions" },
      { label: "Tournament Rounds", val: "3 Competitive Stages", sub: "Online → City Finals → Grand Finale" },
      { label: "Prize Pool", val: "₹35,000+", sub: "Trophies, certificates & cash awards" },
    ],
    resource: {
      title: "Download Official Sample Questions (PDF)",
      desc: "Prepare for IQC with previous year screening questions, trivia drills, and reference rounds.",
      url: "/SampleQestionsIQC.pdf",
    },
  },
  anveshan: {
    badge: "Maffick Cultural Fest Legend",
    tagline: "Where Intellect Meets Adventure across MANIT's 650-Acre Campus",
    icon: Compass,
    stats: [
      { label: "Annual Footfall", val: "5,000+ Students", sub: "MANIT's largest fest turnout" },
      { label: "Event Format", val: "Campus Treasure Hunt", sub: "Multi-stage physical & cryptic hunt" },
      { label: "Challenge Type", val: "Mind & Endurance", sub: "Deciphering ciphers under time pressure" },
      { label: "Finale Glory", val: "The Grand Treasure", sub: "High-stakes hunt for the ultimate prize" },
    ],
  },
  manthan: {
    badge: "National Open Quizzing Arena",
    tagline: "Bringing Together the Brightest Quizzers Across the Country",
    icon: Sparkles,
    stats: [
      { label: "Eligibility", val: "National Circuit", sub: "Open to colleges and quiz enthusiasts" },
      { label: "Format", val: "Multi-Genre Quiz", sub: "MELA, General, Sci-Tech & Pop-Culture" },
      { label: "Standard", val: "National Tier", sub: "Crafted by seasoned QCM quizmasters" },
    ],
  },
  vihaan: {
    badge: "Freshers' Flagship Clash",
    tagline: "The Ultimate Inter-Section Quizzing Battle for First-Year Students",
    icon: Award,
    stats: [
      { label: "Participants", val: "1st Year Students", sub: "Inter-department bragging rights" },
      { label: "Vibe", val: "High Adrenaline", sub: "Buzzer rounds, rapid fire & direct duels" },
    ],
  },
  "flashback-fiesta": {
    badge: "Technosearch Special",
    tagline: "A Nostalgic Pop-Culture & Trivia Odyssey",
    icon: Layers,
    stats: [
      { label: "Festival", val: "Technosearch MANIT", sub: "700+ Registered enthusiasts" },
      { label: "Games", val: "3 Signature Rounds", sub: "Nostalgic Spin, Funky Flip & Vintage Walk" },
    ],
  },
  "aps-quiz": {
    badge: "Inter-School Invitational",
    tagline: "Cluster-Level Battle of Intellect for Army Public Schools",
    icon: Trophy,
    stats: [
      { label: "Circuit", val: "APS Cluster", sub: "Competitive multi-round arena" },
      { label: "Curated By", val: "QCM Quizmasters", sub: "Rigorous standards & dynamic scoring" },
    ],
  },
}

const Event = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const sliderRef = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const event = eventDetails.find((item) => item.id === eventId)
  const enrichment = EVENT_ENRICHMENT[eventId] || {
    badge: "Quizzers' Club Event",
    tagline: "Official event of Quizzers' Club NIT Bhopal",
    icon: Sparkles,
    stats: [],
  }
  const Icon = enrichment.icon

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const settings = {
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    initialSlide: 0,
    autoplay: !reduceMotion,
    autoplaySpeed: 4000,
    beforeChange: (_, next) => setActiveSlide(next),
    className: "w-full",
  }

  const eventTitle = event?.title || "Quiz Event"
  const eventDescription =
    event?.desc ||
    event?.content?.split("\n")[0]?.slice(0, 155) ||
    `Details, photos and highlights of ${eventTitle} by Quizzers' Club NIT Bhopal (QCM MANIT).`

  const eventSchema = event
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: `${event.title} — Quizzers' Club NIT Bhopal`,
        description: event.content?.slice(0, 300),
        image: event.images?.map((src) =>
          src.startsWith("http") ? src : `https://www.quizzersclub.com${src}`
        ),
        organizer: {
          "@type": "Organization",
          name: "Quizzers' Club NIT Bhopal",
          url: "https://www.quizzersclub.com/",
        },
        location: {
          "@type": "Place",
          name: "MANIT Bhopal",
          address: "Bhopal, Madhya Pradesh, India",
        },
      }
    : null

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
        <Header />
        <Container className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-24">
          <SEO
            title="Event Not Found | Quizzers' Club NIT Bhopal"
            description="The quiz event you are looking for doesn't exist. Explore QBIT, inter-college quizzes and events by QCM MANIT."
            path={`/events/${eventId}`}
            noindex
          />
          <div className="max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md">
            <h1 className="font-bold text-2xl uppercase text-amber-400">
              Event not found
            </h1>
            <p className="mt-3 text-sm text-gray-300">
              The event “{eventId}” doesn’t exist or has moved. Explore our other
              quizzing competitions.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </Container>
        <Footer />
      </div>
    )
  }

  const images = event.images && event.images.length > 0 ? event.images : [event.cover]

  return (
    <div
      id="main"
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundColor: "#0d1b2a",
        backgroundImage:
          "radial-gradient(circle at 50% 10%, #1b3a57 0%, #0d1b2a 60%, #060d15 100%)",
      }}
    >
      <SEO
        title={`${eventTitle} | Quizzers' Club NIT Bhopal (QCM MANIT)`}
        description={eventDescription}
        path={`/events/${eventId}`}
        schema={eventSchema}
        crumbs={[
          { name: "Events", item: "https://www.quizzersclub.com/#events" },
          { name: eventTitle, item: `https://www.quizzersclub.com/events/${eventId}` },
        ]}
      />

      <Header />

      <main className="pt-24 md:pt-[14vh] pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-10">
        {/* Top Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link
            to="/#events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-semibold text-gray-200 hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Events</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Icon className="w-3.5 h-3.5" />
              <span>{enrichment.badge}</span>
            </span>
          </div>
        </div>

        {/* Hero Title & Tagline */}
        <div className="space-y-3 max-w-4xl">
          <h1 className="poppins-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            {event.title}
          </h1>
          <p className="text-base sm:text-lg text-amber-300/90 font-medium leading-relaxed">
            {enrichment.tagline}
          </p>
        </div>

        {/* Highlight Stats Strip (if available) */}
        {enrichment.stats && enrichment.stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {enrichment.stats.map((st, i) => (
              <div
                key={i}
                className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 p-4 rounded-2xl backdrop-blur-md transition-all shadow-lg"
              >
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {st.label}
                </p>
                <p className="text-lg sm:text-xl font-bold text-white mt-1">
                  {st.val}
                </p>
                <p className="text-xs text-amber-400/80 mt-0.5 line-clamp-1">
                  {st.sub}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Main Content Split Grid: Slider & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photos Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/15 shadow-2xl">
              {images.length > 1 ? (
                <Slider ref={sliderRef} {...settings}>
                  {images.map((src, index) => {
                    const avif = avifSrcSet(src)
                    const webp = webpSrcSet(src)
                    const isLcp = index === 0
                    return (
                      <div key={index} className="outline-none">
                        <div className="relative aspect-[16/10] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                          <picture>
                            {avif && <source srcSet={avif} sizes="(max-width: 1024px) 95vw, 650px" type="image/avif" />}
                            {webp && <source srcSet={webp} sizes="(max-width: 1024px) 95vw, 650px" type="image/webp" />}
                            <img
                              src={src}
                              alt={`${event.title} quiz event photo ${index + 1} — Quizzers' Club NIT Bhopal`}
                              className="h-full w-full object-cover object-center"
                              loading={isLcp ? "eager" : "lazy"}
                              fetchPriority={isLcp ? "high" : undefined}
                              decoding="async"
                            />
                          </picture>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                      </div>
                    )
                  })}
                </Slider>
              ) : (
                <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                  <picture>
                    {avifSrcSet(images[0]) && <source srcSet={avifSrcSet(images[0])} sizes="650px" type="image/avif" />}
                    {webpSrcSet(images[0]) && <source srcSet={webpSrcSet(images[0])} sizes="650px" type="image/webp" />}
                    <img
                      src={images[0]}
                      alt={`${event.title} — Quizzers' Club NIT Bhopal`}
                      className="h-full w-full object-cover object-center"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            {/* Thumbnail Strip (for multi-image events like IQC with 12 photos) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sliderRef.current?.slickGoTo(idx)
                      setActiveSlide(idx)
                    }}
                    className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeSlide === idx
                        ? "border-amber-400 scale-105 shadow-md shadow-amber-500/20"
                        : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* IQC Special Resource Download Card */}
            {enrichment.resource && (
              <div className="mt-2 p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-400/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {enrichment.resource.title}
                    </h2>
                    <p className="text-xs text-gray-300 mt-1 max-w-lg leading-relaxed">
                      {enrichment.resource.desc}
                    </p>
                  </div>
                </div>

                <a
                  href={enrichment.resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>View &amp; Download PDF</span>
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Narrative, Breakdown & Details (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-md shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Event Overview</span>
              </h2>

              <div className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed">
                {event.content.split("\n").map((para, index) => {
                  const trimmed = para.trim()
                  if (!trimmed) return null

                  // Check if bullet point
                  if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-200">
                          {trimmed.replace(/^[•-]\s*/, "")}
                        </span>
                      </div>
                    )
                  }

                  return (
                    <p key={index} className="text-justify leading-relaxed">
                      {trimmed}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* Quick Action Navigation Card */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                Participate in QCM Events
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Ready to represent your institution or test your trivia prowess?
                Registrations for Q-BIT &apos;26 are live now.
              </p>
              <div className="pt-2 flex flex-wrap gap-2.5">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-900/40 transition-all hover:scale-[1.02]"
                >
                  <span>Register for Q-BIT &apos;26</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/faqs"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs sm:text-sm font-semibold transition-all"
                >
                  <span>View FAQs</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Event
