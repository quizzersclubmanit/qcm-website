import { Container } from "./components"
import { about } from "../assets/qcmData.json"
import { manit, manitWebp, manitFallback, team, teamWebp, teamFallback } from "../assets/assets"

const About = () => {
  const data = [
    {
      content: about.manit,
      imgSrc: manit,
      imgWebp: manitWebp,
      imgFallback: manitFallback,
      alt: "Maulana Azad National Institute of Technology (MANIT) Bhopal campus",
      reverse: false
    },
    {
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
      className="md:w-11/12 mx-auto flex flex-col gap-3 my-8"
    >
      {data.map((obj, index) => (
        <div
          key={index}
          className={`p-4 text-justify md:text-base text-sm flex gap-3 items-center justify-between ${obj.reverse && "flex-row-reverse"}`}
        >
          <p
            className="md:w-1/2 leading-relaxed p-8 rounded-xl text-white transition-all duration-300"
            style={{
              backgroundColor: "#0f3a2e",
              backgroundImage:
                "linear-gradient(180deg, #0f3a2e 0%, #2b7966 100%)"
            }}
          >
            {obj.content}
          </p>
          <picture className="hidden md:inline-block w-[40%]">
            <source srcSet={obj.imgSrc} type="image/avif" />
            <source srcSet={obj.imgWebp} type="image/webp" />
            <img
              src={obj.imgFallback}
              alt={obj.alt}
              loading="lazy"
              decoding="async"
              className="object-contain rounded-xl w-full"
            />
          </picture>
        </div>
      ))}
    </Container>
  )
}

export default About
