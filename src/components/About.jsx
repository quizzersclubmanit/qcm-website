import { Container } from "./components"
import { about } from "../assets/qcmData.json"
import { manit, manitWebp, manitFallback, team, teamWebp, teamFallback } from "../assets/assets"

const About = () => {
  const data = [
    {
      title: "Maulana Azad National Institute of Technology",
      subtitle: "Institute of National Importance • Bhopal",
      content: about.manit,
      imgSrc: manit,
      imgWebp: manitWebp,
      imgFallback: manitFallback,
      alt: "Maulana Azad National Institute of Technology (MANIT) Bhopal campus",
      reverse: false
    },
    {
      title: "Quizzers' Club NIT Bhopal",
      subtitle: "Central India's Largest Quizzing Society",
      content: about.qcm,
      imgSrc: team,
      imgWebp: teamWebp,
      imgFallback: teamFallback,
      alt: "Quizzers' Club NIT Bhopal (QCM MANIT) members at a quiz event",
      reverse: true
    }
  ]

  return (
    <Container
      id="about"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-10"
    >
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-2">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FCA311]">
          Our Heritage &amp; Legacy
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          About Us
        </h2>
      </div>

      <div className="flex flex-col gap-12">
        {data.map((obj, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              obj.reverse ? "md:flex-row-reverse" : "md:flex-row"
            } items-center gap-8 lg:gap-12`}
          >
            {/* Text Card */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 rounded-2xl bg-[#14213D]/75 hover:bg-[#14213D]/90 border border-white/10 hover:border-[#FCA311]/40 backdrop-blur-md shadow-xl transition-all duration-300">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FCA311]">
                {obj.subtitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-3">
                {obj.title}
              </h3>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed text-justify">
                {obj.content}
              </p>
            </div>

            {/* Image Card */}
            <div className="w-full md:w-2/5 aspect-[16/10] md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl group">
              <picture className="w-full h-full">
                <source srcSet={obj.imgSrc} type="image/avif" />
                <source srcSet={obj.imgWebp} type="image/webp" />
                <img
                  src={obj.imgFallback}
                  alt={obj.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </picture>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default About
