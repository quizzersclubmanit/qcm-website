import "./pages.css"
import { useParams, Link } from "react-router-dom"
import { Header, Footer } from "../components/components"
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
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const Slider = (SliderModule && SliderModule.default) || SliderModule

const EVENT_METADATA = {
  iqc: {
    category: "Inter-City Competition",
    tagline: "Madhya Pradesh's largest school quizzing event spanning 5 major cities.",
    hasPdf: true,
    pdfUrl: "/SampleQestionsIQC.pdf",
    pdfTitle: "Official IQC Sample Questions (PDF)",
    pdfDesc: "Practice with actual screening questions, trivia formats, and quiz sheets from previous editions.",
  },
  anveshan: {
    category: "Annual Fest Special",
    tagline: "NIT Bhopal's legendary campus-wide treasure hunt during Maffick.",
    hasPdf: false,
  },
  manthan: {
    category: "National Open Quiz",
    tagline: "The flagship quiz of QCM bringing together top college quizzers from across India.",
    hasPdf: false,
  },
  vihaan: {
    category: "Intra-College Clash",
    tagline: "The ultimate inter-section quiz war for first-year students.",
    hasPdf: false,
  },
  "flashback-fiesta": {
    category: "Technosearch Fest",
    tagline: "A nostalgic pop-culture and mindfulness challenge at NIT Bhopal.",
    hasPdf: false,
  },
  "aps-quiz": {
    category: "School Invitational",
    tagline: "Cluster-level battle of intellect for Army Public Schools.",
    hasPdf: false,
  },
}

const SliderPrevArrow = (props) => {
  const { onClick } = props
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous photo"
      className="!flex absolute top-1/2 left-3 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-[#14213D]/80 hover:bg-[#FCA311] text-white hover:text-[#14213D] border border-white/20 transition-all"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  )
}

const SliderNextArrow = (props) => {
  const { onClick } = props
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next photo"
      className="!flex absolute top-1/2 right-3 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-[#14213D]/80 hover:bg-[#FCA311] text-white hover:text-[#14213D] border border-white/20 transition-all"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  )
}

const Event = () => {
  const { eventId } = useParams()
  const sliderRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const event = eventDetails.find((item) => item.id === eventId)
  const meta = EVENT_METADATA[eventId] || {
    category: "Quiz Event",
    tagline: "Official event organized by Quizzers' Club NIT Bhopal.",
    hasPdf: false,
  }

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const settings = {
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    initialSlide: 0,
    autoplay: !reduceMotion,
    autoplaySpeed: 4500,
    prevArrow: <SliderPrevArrow />,
    nextArrow: <SliderNextArrow />,
    beforeChange: (_, next) => setActiveIdx(next),
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
      <div className="min-h-screen bg-[#1D3441] text-white flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-32">
          <SEO
            title="Event Not Found | Quizzers' Club NIT Bhopal"
            description="The quiz event you are looking for doesn't exist. Explore QBIT, inter-college quizzes and events by QCM MANIT."
            path={`/events/${eventId}`}
            noindex
          />
          <div className="max-w-md bg-[#14213D]/90 border border-white/10 p-8 rounded-2xl shadow-xl">
            <h1 className="font-bold text-2xl uppercase text-[#FCA311]">
              Event Not Found
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              The event “{eventId}” doesn’t exist or has moved. Explore our other
              quizzing events.
            </p>
            <Link
              to="/#events"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FCA311] text-[#14213D] text-sm font-semibold hover:bg-amber-400 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const images = event.images && event.images.length > 0 ? event.images : [event.cover]

  return (
    <div
      id="event-page"
      className="min-h-screen text-white relative flex flex-col justify-between"
      style={{
        background: "linear-gradient(180deg, #1D3441 0%, #182e3b 50%, #14213D 100%)",
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

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 flex flex-col gap-8">
        {/* Top Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <Link
            to="/#events"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-[#FCA311] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FCA311]/15 text-[#FCA311] border border-[#FCA311]/30">
            {meta.category}
          </span>
        </div>

        {/* Event Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            {event.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {meta.tagline}
          </p>
        </div>

        {/* Content Section: Gallery & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery Column (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#0e1626] border border-white/15 shadow-2xl">
              {images.length > 1 ? (
                <Slider ref={sliderRef} {...settings}>
                  {images.map((src, index) => {
                    const avif = avifSrcSet(src)
                    const webp = webpSrcSet(src)
                    const isLcp = index === 0
                    return (
                      <div key={index} className="outline-none">
                        <div className="relative aspect-[16/10] w-full bg-[#0e1626] flex items-center justify-center overflow-hidden">
                          <picture>
                            {avif && <source srcSet={avif} sizes="(max-width: 1024px) 95vw, 650px" type="image/avif" />}
                            {webp && <source srcSet={webp} sizes="(max-width: 1024px) 95vw, 650px" type="image/webp" />}
                            <img
                              src={src}
                              alt={`${event.title} photo ${index + 1} — Quizzers' Club NIT Bhopal`}
                              className="h-full w-full object-cover object-center"
                              loading={isLcp ? "eager" : "lazy"}
                              fetchPriority={isLcp ? "high" : undefined}
                              decoding="async"
                            />
                          </picture>
                        </div>
                      </div>
                    )
                  })}
                </Slider>
              ) : (
                <div className="relative aspect-[16/10] w-full bg-[#0e1626] overflow-hidden">
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
                </div>
              )}
            </div>

            {/* Photo Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sliderRef.current?.slickGoTo(idx)
                      setActiveIdx(idx)
                    }}
                    className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeIdx === idx
                        ? "border-[#FCA311] scale-105 shadow-md"
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

            {/* IQC Sample Questions PDF Box */}
            {meta.hasPdf && (
              <div className="p-5 rounded-2xl bg-[#14213D]/90 border border-[#FCA311]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FCA311] text-[#14213D] flex items-center justify-center flex-shrink-0 font-bold shadow-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {meta.pdfTitle}
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {meta.pdfDesc}
                    </p>
                  </div>
                </div>

                <a
                  href={meta.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FCA311] hover:bg-amber-400 text-[#14213D] text-xs sm:text-sm font-bold shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              </div>
            )}
          </div>

          {/* Description & Details Column (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#14213D]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FCA311]" />
                <span>About the Event</span>
              </h2>

              <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed text-justify">
                {event.content.split("\n").map((para, index) => {
                  const trimmed = para.trim()
                  if (!trimmed) return null
                  return (
                    <p key={index} className="leading-relaxed">
                      {trimmed}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="bg-[#14213D]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#FCA311] uppercase tracking-wider">
                Join QCM Quizzing Action
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ready to represent your college or school? Register your team for
                Q-BIT &apos;26 or explore our FAQ knowledge base.
              </p>
              <div className="pt-2 flex flex-wrap gap-2.5">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
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
